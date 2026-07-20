import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentServices } from "./payment.service";
import { handleCheckoutCompleted } from "./payment.utils";
import Stripe from "stripe";
import { stripe } from "../../lib/stripe";
import config from "../../config";

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

// const handleWebhook = catchAsync(async (req: Request, res: Response) => {
//   console.log("🔥 WEBHOOK HIT");

//   const payload = req.body as Buffer;

//   const signature = req.headers["stripe-signature"] as string;

//   console.log("Signature:", signature ? "Received" : "Missing");

//   await paymentServices.handleWebhook(payload, signature);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Webhook processed successfully",
//     data: null,
//   });
// });

const handleWebhook = async (payload: Buffer, signature: string) => {
  try {
    console.log("Step 1: Constructing event...");

    const endpointSecret = config.stripe_webhook_secret;

    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      endpointSecret,
    );

    console.log("Step 2: Event =", event.type);

    switch (event.type) {
      case "checkout.session.completed":
        console.log("Step 3: Calling handleCheckoutCompleted");

        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session,
        );

        console.log("Step 4: handleCheckoutCompleted finished");
        break;

      default:
        console.log("Unhandled event:", event.type);
    }
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    throw error;
  }
};

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
