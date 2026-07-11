import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { gearServices } from "./gear.service";

const createGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const providerId = req.user?.id as string;
    const payload = req.body;

    const gear = await gearServices.createGearIntoDB(providerId, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Gear Created Successfully",
      data: {
        gear,
      },
    });
  },
);

const getAllGear = catchAsync(async (req: Request, res: Response) => {
  const gears = await gearServices.getAllGearFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear Retrieved Successfully",
    data: {
      gears,
    },
  });
});

const getSingleGear = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const gear = await gearServices.getSingleGearFromDB(id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear Retrieved Successfully",
    data: {
      gear,
    },
  });
});

const updateGear = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user?.id as string;
  const { id } = req.params;
  const payload = req.body;

  const updatedGear = await gearServices.updateGearInDB(
    id as string,
    providerId,
    payload,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear Updated Successfully",
    data: {
      updatedGear,
    },
  });
});

const deleteGear = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user?.id as string;
  const { id } = req.params;

  await gearServices.deleteGearFromDB(id as string, providerId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear Deleted Successfully",
    data: null,
  });
});

const getMyGear = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user?.id as string;

  const gears = await gearServices.getMyGearFromDB(providerId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Provider Gear Retrieved Successfully",
    data: {
      gears,
    },
  });
});

export const gearController = {
  createGear,
  getAllGear,
  getSingleGear,
  updateGear,
  deleteGear,
  getMyGear,
};
