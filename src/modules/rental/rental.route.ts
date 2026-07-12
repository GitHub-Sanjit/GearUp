import { Router } from "express";
import { rentalController } from "./rental.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.CUSTOMER), rentalController.createRental);

router.get("/", auth(Role.CUSTOMER), rentalController.getMyRentals);

router.get("/:id", auth(Role.CUSTOMER), rentalController.getSingleRental);

router.get(
  "/provider/orders",
  auth(Role.PROVIDER),
  rentalController.getProviderOrders,
);

export const rentalRoutes = router;
