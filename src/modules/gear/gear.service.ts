import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
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

const getAllGearFromDB = async (query: any) => {
  const { search, categoryId, brand, isAvailable, sortBy, sortOrder } = query;

  const where: Prisma.GearWhereInput = {};

  // Search
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

  // Category Filter
  if (categoryId) {
    where.categoryId = categoryId;
  }

  // Brand Filter
  if (brand) {
    where.brand = {
      equals: brand,
      mode: "insensitive",
    };
  }

  // Availability Filter
  if (isAvailable !== undefined) {
    where.isAvailable = isAvailable === "true";
  }

  // Price Range Filter
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

  // Pagination
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  // Total Count
  const total = await prisma.gear.count({
    where,
  });

  // Sorting
  const sortField: Prisma.GearScalarFieldEnum = allowedSortFields.includes(
    sortBy as Prisma.GearScalarFieldEnum,
  )
    ? (sortBy as Prisma.GearScalarFieldEnum)
    : "createdAt";

  const orderBy: Prisma.GearOrderByWithRelationInput = {
    [sortField]:
      sortOrder === "asc" ? Prisma.SortOrder.asc : Prisma.SortOrder.desc,
  };

  // Fetch Data
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

  // Search
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

  // Filters
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

  // Price Range
  if (minPrice || maxPrice) {
    where.dailyRentalPrice = {};

    if (minPrice) {
      where.dailyRentalPrice.gte = Number(minPrice);
    }

    if (maxPrice) {
      where.dailyRentalPrice.lte = Number(maxPrice);
    }
  }

  // Pagination
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  // Total
  const total = await prisma.gear.count({
    where,
  });

  // Sorting
  const orderBy: Prisma.GearOrderByWithRelationInput =
    sortBy && allowedSortFields.includes(sortBy)
      ? {
          [sortBy]:
            sortOrder === "asc" ? Prisma.SortOrder.asc : Prisma.SortOrder.desc,
        }
      : {
          createdAt: Prisma.SortOrder.desc,
        };

  // Query
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
