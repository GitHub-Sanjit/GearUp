import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { rentalServices } from "./rental.service";

const createRental = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user?.id as string;

  const rental = await rentalServices.createRentalIntoDB(customerId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Rental Order Created Successfully",
    data: {
      rental,
    },
  });
});

const getMyRentals = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user?.id as string;

  const rentals = await rentalServices.getMyRentalsFromDB(customerId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental Orders Retrieved Successfully",
    data: {
      rentals,
    },
  });
});

const getSingleRental = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user?.id as string;
  const rentalId = req.params.id;

  const rental = await rentalServices.getSingleRentalFromDB(
    customerId,
    rentalId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental Retrieved Successfully",
    data: {
      rental,
    },
  });
});

const getProviderOrders = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user?.id as string;

  const orders = await rentalServices.getProviderOrdersFromDB(providerId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Provider Orders Retrieved Successfully",
    data: {
      orders,
    },
  });
});

const updateRentalStatus = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user?.id as string;
  const rentalId = req.params.id;

  const updatedOrder = await rentalServices.updateRentalStatusIntoDB(
    providerId,
    rentalId as string,
    req.body.status,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental Status Updated Successfully",
    data: {
      order: updatedOrder,
    },
  });
});

const getProviderSingleOrder = catchAsync(
  async (req: Request, res: Response) => {
    const providerId = req.user?.id as string;
    const rentalId = req.params.id;

    const order = await rentalServices.getProviderSingleOrderFromDB(
      providerId,
      rentalId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Provider Order Retrieved Successfully",
      data: {
        order,
      },
    });
  },
);

export const rentalController = {
  createRental,
  getMyRentals,
  getSingleRental,
  getProviderOrders,
  updateRentalStatus,
  getProviderSingleOrder,
};
