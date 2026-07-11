import { prisma } from "../../lib/prisma";
import { ICreateGearPayload, IUpdateGearPayload } from "./gear.interface";

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

const getSingleGearFromDB = async (gearId: string) => {
  const gear = await prisma.gear.findUniqueOrThrow({
    where: {
      id: gearId,
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

const updateGearInDB = async (
  gearId: string,
  providerId: string,
  payload: IUpdateGearPayload,
) => {
  // Check gear exists
  const existingGear = await prisma.gear.findUniqueOrThrow({
    where: {
      id: gearId,
    },
  });

  // Ownership check
  if (existingGear.providerId !== providerId) {
    throw new Error("You are not allowed to update this gear.");
  }

  // If category is being changed, verify it exists
  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: payload.categoryId,
      },
    });

    if (!category) {
      throw new Error(`Category with ID ${payload.categoryId} not found`);
    }
  }

  const updatedGear = await prisma.gear.update({
    where: {
      id: gearId,
    },
    data: payload,
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

  return updatedGear;
};

const deleteGearFromDB = async (gearId: string, providerId: string) => {
  // Check gear exists
  const existingGear = await prisma.gear.findUniqueOrThrow({
    where: {
      id: gearId,
    },
  });

  // Ownership check
  if (existingGear.providerId !== providerId) {
    throw new Error("You are not allowed to delete this gear.");
  }

  await prisma.gear.delete({
    where: {
      id: gearId,
    },
  });

  return null;
};

export const gearServices = {
  createGearIntoDB,
  getAllGearFromDB,
  getSingleGearFromDB,
  updateGearInDB,
  deleteGearFromDB,
};
