import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { userServices } from "./user.service";

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const user = await userServices.userRegisterIntoDB(payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Register Successfully",
      data: { user },
    });
  },
);

const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const profile = await userServices.getMyProfileFromDB(
      req.user?.id as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Profile Fetched Successfully",
      data: { profile },
    });
  },
);

const updateMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payload = req.body;

    const updatedProfile = await userServices.updateMyProfileInDB(
      userId,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Profile Updated Successfully",
      data: { updatedProfile },
    });
  },
);

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.getAllUsers(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const payload = req.body;

  const result = await userServices.updateUserStatus(userId as string, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User status updated successfully",
    data: result,
  });
});

export const userController = {
  registerUser,
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  updateUserStatus,
};
