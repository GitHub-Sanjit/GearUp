import { z } from "zod";

const createCheckoutSessionValidationSchema = z.object({
  body: z.object({
    rentalOrderId: z.uuid("Invalid rental order ID"),
  }),
});

export const paymentValidation = {
  createCheckoutSessionValidationSchema,
};