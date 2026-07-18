import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Prisma } from "../../generated/prisma/client";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong";

  let errorDetails: {
    formErrors: string[];
    fieldErrors: Record<string, string[]>;
  } = {
    formErrors: [],
    fieldErrors: {},
  };

  /**
   * Custom App Error
   */
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ZodError) {
    /**
     * Zod Error
     */
    statusCode = httpStatus.BAD_REQUEST;
    message = "Validation failed";

    errorDetails = err.flatten();
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    /**
     * Prisma Validation Error
     */
    statusCode = httpStatus.BAD_REQUEST;
    message = "Invalid request data";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    /**
     * Prisma Known Error
     */
    statusCode = httpStatus.BAD_REQUEST;

    switch (err.code) {
      case "P2002":
        message = "Duplicate value found";
        break;

      case "P2003":
        message = "Foreign key constraint failed";
        break;

      case "P2025":
        message = "Requested resource not found";
        break;

      default:
        message = "Database operation failed";
    }
  } else if (err instanceof Error) {
    /**
     * Unknown Error
     */
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
  });
};
