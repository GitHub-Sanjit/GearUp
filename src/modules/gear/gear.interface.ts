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