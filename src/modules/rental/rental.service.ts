import httpStatus from "http-status";
import { Prisma, RentalStatus } from "../../../generated/prisma/client";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { allowedSortFields } from "../gear/gear.interface";
import { ICreateRentalPayload } from "./rental.interface";

const createRentalIntoDB = async (
  customerId: string,
  payload: ICreateRentalPayload,
) => {
  const { gearId, quantity, startDate, endDate } = payload;

  const gear = await prisma.gear.findUnique({
    where: { id: gearId },
  });

  if (!gear) {
    throw new AppError(httpStatus.NOT_FOUND, "Gear not found");
  }

  if (!gear.isAvailable) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This gear is currently unavailable",
    );
  }

  if (quantity <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Quantity must be greater than 0",
    );
  }

  if (quantity > gear.availableQuantity) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Only ${gear.availableQuantity} item(s) available`,
    );
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start >= end) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "End date must be after start date",
    );
  }

  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  const totalDays = Math.ceil(
    (end.getTime() - start.getTime()) / millisecondsPerDay,
  );

  const totalAmount = totalDays * gear.dailyRentalPrice * quantity;

  const rental = await prisma.$transaction(async (tx) => {
    const createdRental = await tx.rentalOrder.create({
      data: {
        customerId,
        gearId,
        quantity,
        startDate: start,
        endDate: end,
        totalDays,
        totalAmount,
      },
      include: {
        customer: {
          omit: {
            password: true,
          },
          include: {
            profile: true,
          },
        },
        gear: {
          include: {
            category: true,
          },
        },
      },
    });

    const updatedAvailableQuantity = gear.availableQuantity - quantity;

    await tx.gear.update({
      where: {
        id: gear.id,
      },
      data: {
        availableQuantity: updatedAvailableQuantity,
        isAvailable: updatedAvailableQuantity > 0,
      },
    });

    return createdRental;
  });

  return rental;
};

const getMyRentalsFromDB = async (customerId: string) => {
  return prisma.rentalOrder.findMany({
    where: {
      customerId,
    },
    include: {
      gear: {
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
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getSingleRentalFromDB = async (customerId: string, rentalId: string) => {
  const rental = await prisma.rentalOrder.findUnique({
    where: {
      id: rentalId,
    },
    include: {
      gear: {
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
      },
    },
  });

  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental not found");
  }

  if (rental.customerId !== customerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to access this rental",
    );
  }

  return rental;
};

const getProviderOrdersFromDB = async (providerId: string) => {
  return prisma.rentalOrder.findMany({
    where: {
      gear: {
        providerId,
      },
    },
    include: {
      customer: {
        omit: {
          password: true,
        },
        include: {
          profile: true,
        },
      },
      gear: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateRentalStatusIntoDB = async (
  providerId: string,
  rentalId: string,
  status: RentalStatus,
) => {
  const rental = await prisma.rentalOrder.findUnique({
    where: {
      id: rentalId,
    },
    include: {
      gear: true,
    },
  });

  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental not found");
  }

  if (rental.gear.providerId !== providerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to update this rental",
    );
  }

  const allowedTransitions: Record<RentalStatus, RentalStatus[]> = {
    PLACED: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PICKED_UP"],
    PAID: ["PICKED_UP"],
    PICKED_UP: ["RETURNED"],
    RETURNED: [],
    CANCELLED: [],
  };

  if (!allowedTransitions[rental.status].includes(status)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid status transition from ${rental.status} to ${status}`,
    );
  }

  const updatedRental = await prisma.rentalOrder.update({
    where: {
      id: rentalId,
    },
    data: {
      status,
    },
    include: {
      customer: {
        omit: {
          password: true,
        },
        include: {
          profile: true,
        },
      },
      gear: {
        include: {
          category: true,
        },
      },
    },
  });

  return updatedRental;
};

const getProviderSingleOrderFromDB = async (
  providerId: string,
  rentalId: string,
) => {
  const order = await prisma.rentalOrder.findUnique({
    where: {
      id: rentalId,
    },
    include: {
      customer: {
        omit: {
          password: true,
        },
        include: {
          profile: true,
        },
      },
      gear: {
        include: {
          category: true,
        },
      },
    },
  });

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  if (order.gear.providerId !== providerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to access this order",
    );
  }

  return order;
};

const getAllRentalsForAdmin = async (query: any) => {
  const { search, status, isPaid, sortBy, sortOrder, page, limit } = query;

  const where: Prisma.RentalOrderWhereInput = {};

  if (search) {
    where.OR = [
      {
        customer: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        customer: {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        gear: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
    ];
  }

  if (status) {
    where.status = status;
  }

  if (isPaid !== undefined) {
    where.isPaid = isPaid === "true";
  }

  const currentPage = Number(page) || 1;
  const currentLimit = Number(limit) || 10;
  const skip = (currentPage - 1) * currentLimit;

  const total = await prisma.rentalOrder.count({
    where,
  });

  const orderBy: Prisma.RentalOrderOrderByWithRelationInput =
    sortBy && allowedSortFields.includes(sortBy)
      ? {
          [sortBy]:
            sortOrder === "asc" ? Prisma.SortOrder.asc : Prisma.SortOrder.desc,
        }
      : {
          createdAt: Prisma.SortOrder.desc,
        };

  const rentals = await prisma.rentalOrder.findMany({
    where,
    skip,
    take: currentLimit,
    orderBy,
    include: {
      customer: {
        omit: {
          password: true,
        },
        include: {
          profile: true,
        },
      },
      gear: {
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
      },
      payment: true,
    },
  });

  return {
    meta: {
      page: currentPage,
      limit: currentLimit,
      total,
      totalPage: Math.ceil(total / currentLimit),
    },
    data: rentals,
  };
};

export const rentalServices = {
  createRentalIntoDB,
  getMyRentalsFromDB,
  getSingleRentalFromDB,
  getProviderOrdersFromDB,
  updateRentalStatusIntoDB,
  getProviderSingleOrderFromDB,
  getAllRentalsForAdmin,
};
