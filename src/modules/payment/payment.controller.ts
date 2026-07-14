import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentServices } from "./payment.service";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const { rentalOrderId } = req.body;

    const result = await paymentServices.createCheckoutSession(
      userId,
      rentalOrderId,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Checkout session created successfully",
      data: result,
    });
  },
);

const handleWebhook = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as Buffer;

  const signature = req.headers["stripe-signature"] as string;

  await paymentServices.handleWebhook(payload, signature);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Webhook processed successfully",
    data: null,
  });
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const result = await paymentServices.getMyPayments(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payments retrieved successfully",
    data: result,
  });
});

const getProviderPayments = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user!.id;

  const result = await paymentServices.getProviderPayments(providerId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Provider payments retrieved successfully",
    data: result,
  });
});

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentServices.getAllPayments(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payments retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const paymentController = {
  createCheckoutSession,
  handleWebhook,
  getMyPayments,
  getProviderPayments,
  getAllPayments,
};
