import Stripe from "stripe";

import {
  PaymentProvider,
  PaymentStatus,
  RentalStatus,
} from "../../../generated/prisma/enums";

import { prisma } from "../../lib/prisma";

export const handleCheckoutCompleted = async (
  session: Stripe.Checkout.Session,
) => {
  const rentalOrderId = session.metadata?.rentalOrderId;

  if (!rentalOrderId) {
    console.log("Webhook: Missing rentalOrderId in metadata.");
    return;
  }

  const rentalOrder = await prisma.rentalOrder.findUnique({
    where: {
      id: rentalOrderId,
    },
  });

  if (!rentalOrder) {
    throw new Error(`Rental order with ID ${rentalOrderId} not found.`);
  }

  // Prevent duplicate processing
  const existingPayment = await prisma.payment.findUnique({
    where: {
      rentalOrderId,
    },
  });

  if (existingPayment) {
    console.log(`Webhook: Payment already exists for rental ${rentalOrderId}.`);

    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.create({
      data: {
        rentalOrderId: rentalOrder.id,
        amount: rentalOrder.totalAmount,

        provider: PaymentProvider.STRIPE,

        status: PaymentStatus.COMPLETED,

        stripeCustomerId:
          typeof session.customer === "string" ? session.customer : null,

        stripeSessionId: session.id,

        transactionId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : null,

        paidAt: new Date(),
      },
    });

    await tx.rentalOrder.update({
      where: {
        id: rentalOrder.id,
      },
      data: {
        isPaid: true,
        status: RentalStatus.PAID,
      },
    });
  });

  console.log(
    `Webhook: Payment completed successfully for rental ${rentalOrderId}.`,
  );
};
