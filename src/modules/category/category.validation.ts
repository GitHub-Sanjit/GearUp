import { z } from "zod";

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Category name must be at least 2 characters")
      .max(50, "Category name cannot exceed 50 characters"),

    description: z
      .string()
      .trim()
      .min(5, "Description must be at least 5 characters")
      .max(500, "Description cannot exceed 500 characters")
      .optional(),
  }),
});

const updateCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Category name must be at least 2 characters")
      .max(50, "Category name cannot exceed 50 characters")
      .optional(),

    description: z
      .string()
      .trim()
      .min(5, "Description must be at least 5 characters")
      .max(500, "Description cannot exceed 500 characters")
      .optional(),
  }),
});

export const categoryValidation = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};
