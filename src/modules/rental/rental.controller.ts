import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { rentalServices } from "./rental.service";

const createRental = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user?.id as string;

  const rental = await rentalServices.createRentalIntoDB(customerId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Rental Order Created Successfully",
    data: {
      rental,
    },
  });
});

const getMyRentals = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user?.id as string;

  const rentals = await rentalServices.getMyRentalsFromDB(customerId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental Orders Retrieved Successfully",
    data: {
      rentals,
    },
  });
});

export const rentalController = {
  createRental,
  getMyRentals,
};
