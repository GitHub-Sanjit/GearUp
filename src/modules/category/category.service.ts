import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { ICreateCategoryPayload } from "./category.interface";

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

export const categoryServices = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
};


