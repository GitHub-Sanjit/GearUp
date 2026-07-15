import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { rentalController } from "./rental.controller";

const router = Router();

router.get(
  "/rentals",
  auth(Role.ADMIN),
  rentalController.getAllRentalsForAdmin
);

export const adminRentalRoutes = router;