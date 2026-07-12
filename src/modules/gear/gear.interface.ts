import { Prisma } from "../../../generated/prisma/client";
import { GearCondition } from "../../../generated/prisma/enums";

export interface ICreateGearPayload {
  name: string;
  description?: string;
  brand?: string;
  image?: string;
  dailyRentalPrice: number;
  stockQuantity: number;
  availableQuantity: number;
  condition?: GearCondition;
  categoryId: string;
}

export type IUpdateGearPayload = Partial<ICreateGearPayload>;

export const allowedSortFields: Prisma.GearScalarFieldEnum[] = [
  "createdAt",
  "dailyRentalPrice",
  "stockQuantity",
  "availableQuantity",
  "name",
];
