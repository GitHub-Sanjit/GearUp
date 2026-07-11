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

export const gearController = {
  createGear,
  getAllGear,
};
