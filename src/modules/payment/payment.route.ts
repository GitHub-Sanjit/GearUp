import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/auth";
import { paymentController } from "./payment.controller";

const router = Router();

router.post(
  "/checkout",
  auth(Role.CUSTOMER),
  paymentController.createCheckoutSession,
);

export const paymentRoutes = router;
