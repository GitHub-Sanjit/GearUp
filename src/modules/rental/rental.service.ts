import { RentalStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ICreateRentalPayload } from "./rental.interface";

const createRentalIntoDB = async (
  customerId: string,
  payload: ICreateRentalPayload,
) => {
  const { gearId, quantity, startDate, endDate } = payload;

  // 1. Find Gear
  const gear = await prisma.gear.findUnique({
    where: {
      id: gearId,
    },
  });

  if (!gear) {
    throw new Error(`Gear with ID ${gearId} not found.`);
  }

  // 2. Check availability
  if (!gear.isAvailable) {
    throw new Error();
  }

  // 3. Validate quantity
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0.");
  }

  if (quantity > gear.availableQuantity) {
    throw new Error(`Only ${gear.availableQuantity} item(s) available.`);
  }

  // 4. Validate dates
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start >= end) {
    throw new Error("End date must be after start date.");
  }

  // 5. Calculate total days
  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  const totalDays = Math.ceil(
    (end.getTime() - start.getTime()) / millisecondsPerDay,
  );

  // 6. Calculate total amount
  const totalAmount = totalDays * gear.dailyRentalPrice * quantity;

  // 7. Transaction
  const rental = await prisma.$transaction(async (tx) => {
    // Create Rental
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

    // Update Gear
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
  const rentals = await prisma.rentalOrder.findMany({
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

  return rentals;
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
    throw new Error("Rental not found.");
  }

  // Ownership Check
  if (rental.customerId !== customerId) {
    throw new Error("You are not authorized to access this rental.");
  }

  return rental;
};

const getProviderOrdersFromDB = async (providerId: string) => {
  const orders = await prisma.rentalOrder.findMany({
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

  return orders;
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
    throw new Error("Rental not found.");
  }

  // Ownership check
  if (rental.gear.providerId !== providerId) {
    throw new Error(
      "You are not authorized to update the status of this rental.",
    );
  }

  // Allowed transitions
  const allowedTransitions: Record<RentalStatus, RentalStatus[]> = {
    PLACED: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PICKED_UP"],
    PICKED_UP: ["RETURNED"],
    RETURNED: [],
    CANCELLED: [],
    PAID: ["PICKED_UP"],
  };

  if (!allowedTransitions[rental.status].includes(status)) {
    throw new Error(
      `Invalid status transition from ${rental.status} to ${status}.`,
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

export const rentalServices = {
  createRentalIntoDB,
  getMyRentalsFromDB,
  getSingleRentalFromDB,
  getProviderOrdersFromDB,
  updateRentalStatusIntoDB,
};
