import httpStatus from "http-status";
import { Prisma } from "../../../generated/prisma/client";

import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import {
  allowedSortFields,
  ICreateGearPayload,
  IUpdateGearPayload,
} from "./gear.interface";

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
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
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

const getAllGearFromDB = async (query: any) => {
  const { search, categoryId, brand, isAvailable, sortBy, sortOrder } = query;

  const where: Prisma.GearWhereInput = {};

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        brand: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (brand) {
    where.brand = {
      equals: brand,
      mode: "insensitive",
    };
  }

  if (isAvailable !== undefined) {
    where.isAvailable = isAvailable === "true";
  }

  const { minPrice, maxPrice } = query;

  if (minPrice || maxPrice) {
    where.dailyRentalPrice = {};

    if (minPrice) {
      where.dailyRentalPrice.gte = Number(minPrice);
    }

    if (maxPrice) {
      where.dailyRentalPrice.lte = Number(maxPrice);
    }
  }

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await prisma.gear.count({
    where,
  });

  const sortField: Prisma.GearScalarFieldEnum = allowedSortFields.includes(
    sortBy as Prisma.GearScalarFieldEnum,
  )
    ? (sortBy as Prisma.GearScalarFieldEnum)
    : "createdAt";

  const orderBy: Prisma.GearOrderByWithRelationInput = {
    [sortField]:
      sortOrder === "asc" ? Prisma.SortOrder.asc : Prisma.SortOrder.desc,
  };

  const gears = await prisma.gear.findMany({
    where,
    skip,
    take: limit,
    orderBy,
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

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    gears,
  };
};

const getSingleGearFromDB = async (gearId: string) => {
  const gear = await prisma.gear.findUnique({
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

  if (!gear) {
    throw new AppError(httpStatus.NOT_FOUND, "Gear not found");
  }

  return gear;
};

const updateGearInDB = async (
  gearId: string,
  providerId: string,
  payload: IUpdateGearPayload,
) => {
  const existingGear = await prisma.gear.findUnique({
    where: {
      id: gearId,
    },
  });

  if (!existingGear) {
    throw new AppError(httpStatus.NOT_FOUND, "Gear not found");
  }

  if (existingGear.providerId !== providerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to update this gear",
    );
  }

  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: payload.categoryId,
      },
    });

    if (!category) {
      throw new AppError(httpStatus.NOT_FOUND, "Category not found");
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
  const existingGear = await prisma.gear.findUnique({
    where: {
      id: gearId,
    },
  });

  if (!existingGear) {
    throw new AppError(httpStatus.NOT_FOUND, "Gear not found");
  }

  if (existingGear.providerId !== providerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to delete this gear",
    );
  }

  await prisma.gear.delete({
    where: {
      id: gearId,
    },
  });

  return null;
};

const getMyGearFromDB = async (providerId: string) => {
  const gears = await prisma.gear.findMany({
    where: {
      providerId,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return gears;
};

const getAllGearForAdmin = async (query: any) => {
  const {
    search,
    categoryId,
    brand,
    isAvailable,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
  } = query;

  const where: Prisma.GearWhereInput = {};

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        brand: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (brand) {
    where.brand = {
      equals: brand,
      mode: "insensitive",
    };
  }

  if (isAvailable !== undefined) {
    where.isAvailable = isAvailable === "true";
  }

  if (minPrice || maxPrice) {
    where.dailyRentalPrice = {};

    if (minPrice) {
      where.dailyRentalPrice.gte = Number(minPrice);
    }

    if (maxPrice) {
      where.dailyRentalPrice.lte = Number(maxPrice);
    }
  }

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await prisma.gear.count({
    where,
  });

  const orderBy: Prisma.GearOrderByWithRelationInput =
    sortBy && allowedSortFields.includes(sortBy)
      ? {
          [sortBy]:
            sortOrder === "asc" ? Prisma.SortOrder.asc : Prisma.SortOrder.desc,
        }
      : {
          createdAt: Prisma.SortOrder.desc,
        };

  const gears = await prisma.gear.findMany({
    where,
    skip,
    take: limit,
    orderBy,
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
      rentals: {
        select: {
          id: true,
          status: true,
          isPaid: true,
          startDate: true,
          endDate: true,
        },
      },
    },
  });

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    gears,
  };
};

export const gearServices = {
  createGearIntoDB,
  getAllGearFromDB,
  getSingleGearFromDB,
  updateGearInDB,
  deleteGearFromDB,
  getMyGearFromDB,
  getAllGearForAdmin,
};
