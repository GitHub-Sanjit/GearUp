import httpStatus from "http-status";
import Stripe from "stripe";

import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { AppError } from "../../errors/AppError";
import { handleCheckoutCompleted } from "./payment.utils";

const createCheckoutSession = async (userId: string, rentalOrderId: string) => {
  // Find rental order
  const rental = await prisma.rentalOrder.findUnique({
    where: {
      id: rentalOrderId,
    },
    include: {
      gear: true,
      payment: true,
    },
  });

  // Rental exists
  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental order not found");
  }

  // Ownership validation
  if (rental.customerId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to pay for this rental order",
    );
  }

  // Rental must be confirmed
  if (rental.status !== "CONFIRMED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Rental order must be CONFIRMED before payment. Current status: ${rental.status}`,
    );
  }

  // Already paid?
  if (rental.isPaid) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rental order has already been paid",
    );
  }

  // Existing payment
  if (rental.payment) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Payment already exists for this rental order",
    );
  }

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    payment_method_types: ["card"],

    line_items: [
      {
        price_data: {
          currency: "usd",

          product_data: {
            name: rental.gear.name,
            description: rental.gear.description ?? undefined,
          },

          unit_amount: Math.round(rental.totalAmount * 100),
        },

        quantity: 1,
      },
    ],

    success_url: `${config.app_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

    cancel_url: `${config.app_url}/payment/cancel`,

    metadata: {
      rentalOrderId: rental.id,
      customerId: rental.customerId,
    },
  });

  return {
    paymentUrl: session.url,
  };
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripe_webhook_secret;

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(
        event.data.object as Stripe.Checkout.Session,
      );
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};

const getMyPayments = async (userId: string) => {
  return prisma.payment.findMany({
    where: {
      rentalOrder: {
        customerId: userId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      amount: true,
      provider: true,
      status: true,
      paidAt: true,
      createdAt: true,

      rentalOrder: {
        select: {
          id: true,
          status: true,
          startDate: true,
          endDate: true,
          totalAmount: true,

          gear: {
            select: {
              id: true,
              name: true,
              brand: true,
              image: true,

              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

const getProviderPayments = async (providerId: string) => {
  return prisma.payment.findMany({
    where: {
      rentalOrder: {
        gear: {
          providerId,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,
      amount: true,
      provider: true,
      status: true,
      paidAt: true,
      createdAt: true,

      rentalOrder: {
        select: {
          id: true,
          startDate: true,
          endDate: true,
          totalAmount: true,

          customer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },

          gear: {
            select: {
              id: true,
              name: true,
              brand: true,
              image: true,
            },
          },
        },
      },
    },
  });
};

const getAllPayments = async (query: any) => {
  const {
    status,
    provider,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const where: any = {};

  if (status) {
    where.status = status;
  }

  if (provider) {
    where.provider = provider;
  }

  const currentPage = Number(page);
  const currentLimit = Number(limit);

  const skip = (currentPage - 1) * currentLimit;

  const total = await prisma.payment.count({
    where,
  });

  const payments = await prisma.payment.findMany({
    where,

    skip,
    take: currentLimit,

    orderBy: {
      [sortBy]: sortOrder,
    },

    include: {
      rentalOrder: {
        include: {
          customer: {
            omit: {
              password: true,
            },
          },

          gear: {
            include: {
              category: true,

              provider: {
                omit: {
                  password: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return {
    meta: {
      page: currentPage,
      limit: currentLimit,
      total,
      totalPage: Math.ceil(total / currentLimit),
    },
    data: payments,
  };
};

export const paymentServices = {
  createCheckoutSession,
  handleWebhook,
  getMyPayments,
  getProviderPayments,
  getAllPayments,
};
