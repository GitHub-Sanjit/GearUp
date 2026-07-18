import { ActiveStatus, Role } from "../../../generated/prisma/enums";
import { z } from "zod";

const registerUserValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters"),

    email: z.string().email("Invalid email address"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password cannot exceed 100 characters"),

    profilePhoto: z
      .string()
      .url("Profile photo must be a valid URL")
      .optional(),

    role: z.enum([Role.CUSTOMER, Role.PROVIDER]).optional(),
  }),
});

const updateMyProfileValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50).optional(),

    bio: z.string().max(500).optional(),

    profilePhoto: z.string().url().optional(),
  }),
});

const updateUserStatusValidationSchema = z.object({
  body: z.object({
    activeStatus: z.nativeEnum(ActiveStatus),
  }),
});

export const userValidation = {
  registerUserValidationSchema,
  updateMyProfileValidationSchema,
  updateUserStatusValidationSchema,
};
