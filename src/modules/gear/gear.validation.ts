import { z } from "zod";
import { GearCondition } from "../../../generated/prisma/enums";

const createGearValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Gear name must be at least 2 characters")
      .max(100),

    description: z.string().trim().max(1000).optional(),

    brand: z.string().trim().max(100).optional(),

    image: z.string().url("Image must be a valid URL").optional(),

    dailyRentalPrice: z
      .number()
      .positive("Daily rental price must be greater than 0"),

    stockQuantity: z
      .number()
      .int("Stock quantity must be an integer")
      .min(1, "Stock quantity must be at least 1"),

    categoryId: z.uuid("Invalid category ID"),

    condition: z.nativeEnum(GearCondition).optional(),
  }),
});

const updateGearValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100).optional(),

    description: z.string().trim().max(1000).optional(),

    brand: z.string().trim().max(100).optional(),

    image: z.string().url().optional(),

    dailyRentalPrice: z.number().positive().optional(),

    stockQuantity: z.number().int().min(1).optional(),

    categoryId: z.uuid().optional(),

    condition: z.nativeEnum(GearCondition).optional(),
  }),
});

export const gearValidation = {
  createGearValidationSchema,
  updateGearValidationSchema,
};
