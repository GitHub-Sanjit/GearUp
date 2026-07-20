import { z } from "zod";
import { RentalStatus } from "../../../generated/prisma/enums";

const createRentalValidationSchema = z
  .object({
    body: z.object({
      gearId: z.uuid("Invalid gear ID"),

      startDate: z.string().date("Invalid start date"),

      endDate: z.string().date("Invalid end date"),

      quantity: z
        .number()
        .int("Quantity must be an integer")
        .min(1, "Quantity must be at least 1"),
    }),
  })
  .refine(
    (data) => new Date(data.body.endDate) > new Date(data.body.startDate),
    {
      message: "End date must be after start date.",
      path: ["body", "endDate"],
    },
  );

const updateRentalStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([
      RentalStatus.CONFIRMED,
      RentalStatus.PICKED_UP,
      RentalStatus.RETURNED,
      RentalStatus.CANCELLED,
    ]),
  }),
});

export const rentalValidation = {
  createRentalValidationSchema,
  updateRentalStatusValidationSchema,
};
