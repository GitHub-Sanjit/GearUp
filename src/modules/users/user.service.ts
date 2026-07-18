import bcrypt from "bcryptjs";
import httpStatus from "http-status";

import config from "../../config";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";

import { IRegisterUserPayload } from "./user.interface";
import { ActiveStatus, Role } from "../../../generated/prisma/enums";

const userRegisterIntoDB = async (payload: IRegisterUserPayload) => {
  const { name, email, password, profilePhoto, role = Role.CUSTOMER } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      "User with this email already exists",
    );
  }

  if (role !== Role.CUSTOMER && role !== Role.PROVIDER) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid role. Only CUSTOMER and PROVIDER can register.",
    );
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

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
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      profile: true,
    },
    omit: {
      password: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

const updateMyProfileInDB = async (userId: string, payload: any) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const { name, email, profilePhoto, bio } = payload;

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
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
    include: {
      profile: true,
    },
    omit: {
      password: true,
    },
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
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      activeStatus: payload.activeStatus,
    },
    include: {
      profile: true,
    },
    omit: {
      password: true,
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
