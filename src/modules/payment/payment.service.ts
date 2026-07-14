import httpStatus from "http-status";
import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

const createCheckoutSession = async (userId: string, rentalOrderId: string) => {
  // 1. Find rental order
  const rental = await prisma.rentalOrder.findUnique({
    where: {
      id: rentalOrderId,
    },
    include: {
      gear: true,
      payment: true,
    },
  });

  // 2. Rental exists
  if (!rental) {
    throw new Error(`Rental order with ID ${rentalOrderId} not found.`);
  }

  // 3. Ownership validation
  if (rental.customerId !== userId) {
    throw new Error(
      `User with ID ${userId} is not authorized to create a checkout session for rental order ${rentalOrderId}.`,
    );
  }

  // 4. Rental must be confirmed
  if (rental.status !== "CONFIRMED") {
    throw new Error(
      `Rental order with ID ${rentalOrderId} is not confirmed. Current status: ${rental.status}.`,
    );
  }

  // 5. Already paid?
  if (rental.isPaid) {
    throw new Error(
      `Rental order with ID ${rentalOrderId} has already been paid.`,
    );
  }

  // 6. Payment already exists?
  if (rental.payment) {
    throw new Error(
      `Payment already exists for rental order ${rentalOrderId}.`,
    );
  }

  // 7. Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    payment_method_types: ["card"],

    line_items: [
      {
        price_data: {
          currency: "usd",

          product_data: {
            name: rental.gear.name,
            description: rental.gear?.description as string,
          },

          unit_amount: Math.round(Number(rental.totalAmount) * 100),
        },

        quantity: 1,
      },
    ],

    success_url: `${config.app_url}/payment/success`,
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

export const paymentServices = {
  createCheckoutSession,
};
