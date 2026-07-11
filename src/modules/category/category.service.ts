import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import {
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
} from "./category.interface";

const createCategoryIntoDB = async (payload: ICreateCategoryPayload) => {
  const { name, description } = payload;

  const isCategoryExist = await prisma.category.findUnique({
    where: {
      name,
    },
  });

  if (isCategoryExist) {
    throw new Error(httpStatus.CONFLICT + " " + "Category already exists");
  }

  const category = await prisma.category.create({
    data: {
      name,
      description,
    },
  });

  return category;
};

const getAllCategoriesFromDB = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return categories;
};

const getSingleCategoryFromDB = async (categoryId: string) => {
  const category = await prisma.category.findUniqueOrThrow({
    where: {
      id: categoryId,
    },
  });

  return category;
};

const updateCategoryInDB = async (
  categoryId: string,
  payload: IUpdateCategoryPayload,
) => {
  // Check if category exists
  await prisma.category.findUniqueOrThrow({
    where: {
      id: categoryId,
    },
  });

  // Check duplicate name only if name is being updated
  if (payload.name) {
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: payload.name,
        NOT: {
          id: categoryId,
        },
      },
    });

    if (existingCategory) {
      throw new Error(httpStatus.CONFLICT + " " + "Category already exists");
    }
  }

  const updatedCategory = await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: payload,
  });

  return updatedCategory;
};

const deleteCategoryFromDB = async (categoryId: string) => {
  const deletedCategory = await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });

  return deletedCategory;
};

export const categoryServices = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
};
