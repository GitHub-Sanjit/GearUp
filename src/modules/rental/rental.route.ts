import { Router } from "express";
import { rentalController } from "./rental.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { rentalValidation } from "./rental.validation";

const router = Router();

router.post(
  "/",
  auth(Role.CUSTOMER),
  validateRequest(rentalValidation.createRentalValidationSchema),
  rentalController.createRental,
);

router.get("/", auth(Role.CUSTOMER), rentalController.getMyRentals);

router.get("/:id", auth(Role.CUSTOMER), rentalController.getSingleRental);

router.get(
  "/provider/orders",
  auth(Role.PROVIDER),
  rentalController.getProviderOrders,
);

router.patch(
  "/provider/orders/:id",
  auth(Role.PROVIDER),
  validateRequest(rentalValidation.updateRentalStatusValidationSchema),
  rentalController.updateRentalStatus,
);

router.get(
  "/provider/orders/:id",
  auth(Role.PROVIDER),
  rentalController.getProviderSingleOrder,
);

export const rentalRoutes = router;
