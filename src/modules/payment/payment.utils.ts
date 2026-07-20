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
  console.log("🔥 Processing checkout session:", session.id);

  console.log("Metadata:", session.metadata);
  const rentalOrderId = session.metadata?.rentalOrderId;

  if (!rentalOrderId) {
    console.log("Webhook: Missing rentalOrderId in metadata.");
    return;
  }

  console.log("Rental ID:", rentalOrderId);

  const rentalOrder = await prisma.rentalOrder.findUnique({
    where: {
      id: rentalOrderId,
    },
  });
  console.log("Rental found:", !!rentalOrder);

  if (!rentalOrder) {
    throw new Error(`Rental order with ID ${rentalOrderId} not found.`);
  }

  // Prevent duplicate processing
  const existingPayment = await prisma.payment.findUnique({
    where: {
      rentalOrderId,
    },
  });

  console.log("Existing payment:", !!existingPayment);

  console.log("Creating payment...");

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

        stripeCustomerId: session.customer as string,

        stripeSessionId: session.id,

        transactionId: session.payment_intent as string,

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

  console.log("✅ Transaction completed");

  console.log(
    `Webhook: Payment completed successfully for rental ${rentalOrderId}.`,
  );
};
