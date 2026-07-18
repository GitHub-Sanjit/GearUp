import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { IRegisterUserPayload } from "./user.interface";
import { ActiveStatus, Role } from "../../../generated/prisma/enums";

const userRegisterIntoDB = async (payload: IRegisterUserPayload) => {
  const { name, email, password, profilePhoto, role = Role.CUSTOMER } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExist) {
    throw new Error("User with this email already exist");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  if (role !== Role.CUSTOMER && role !== Role.PROVIDER) {
    throw new Error("Invalid role. Only CUSTOMER and PROVIDER can register.");
  }

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      profile: {
        create: {
          profilePhoto,
        },
      },
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email || email,
    },
    include: {
      profile: true,
    },
    omit: {
      password: true,
    },
  });
  return user;
};

const getMyProfileFromDB = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    omit: { password: true },
    include: { profile: true },
  });

  return user;
};

const updateMyProfileInDB = async (userId: string, payload: any) => {
  const { name, email, profilePhoto, bio } = payload;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      email,
      profile: {
        update: {
          profilePhoto,
          bio,
        },
      },
    },
    omit: { password: true },
    include: { profile: true },
  });

  return updatedUser;
};

const getAllUsers = async (query: any) => {
  const {
    search,
    role,
    activeStatus,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const where: any = {};

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (role) {
    where.role = role;
  }

  if (activeStatus) {
    where.activeStatus = activeStatus;
  }

  const currentPage = Number(page);
  const currentLimit = Number(limit);

  const skip = (currentPage - 1) * currentLimit;

  const total = await prisma.user.count({
    where,
  });

  const users = await prisma.user.findMany({
    where,

    skip,
    take: currentLimit,

    orderBy: {
      [sortBy]: sortOrder === "asc" ? "asc" : "desc",
    },

    include: {
      profile: true,
    },

    omit: {
      password: true,
    },
  });

  return {
    meta: {
      page: currentPage,
      limit: currentLimit,
      total,
      totalPage: Math.ceil(total / currentLimit),
    },

    data: users,
  };
};

const updateUserStatus = async (
  userId: string,
  payload: { activeStatus: ActiveStatus },
) => {
  // Check if user exists
  await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      activeStatus: payload.activeStatus,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return updatedUser;
};

export const userServices = {
  userRegisterIntoDB,
  getMyProfileFromDB,
  updateMyProfileInDB,
  getAllUsers,
  updateUserStatus,
};
