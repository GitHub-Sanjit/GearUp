import { prisma } from "../../lib/prisma";
import { ICreateGearPayload } from "./gear.interface";

const createGearIntoDB = async (
  providerId: string,
  payload: ICreateGearPayload,
) => {
  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!category) {
    throw new Error(`Category with ID ${payload.categoryId} not found`);
  }

  const gear = await prisma.gear.create({
    data: {
      ...payload,
      providerId,
    },
    include: {
      category: true,
      provider: {
        omit: {
          password: true,
        },
        include: {
          profile: true,
        },
      },
    },
  });

  return gear;
};

const getAllGearFromDB = async () => {
  const gears = await prisma.gear.findMany({
    include: {
      category: true,
      provider: {
        omit: {
          password: true,
        },
        include: {
          profile: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return gears;
};

export const gearServices = {
  createGearIntoDB,
  getAllGearFromDB,
};
