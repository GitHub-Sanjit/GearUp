import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { gearController } from "./gear.controller";
import { paymentController } from "../payment/payment.controller";

const router = Router();

router.post("/gear", auth(Role.PROVIDER), gearController.createGear);

router.patch("/gear/:id", auth(Role.PROVIDER), gearController.updateGear);

router.delete("/gear/:id", auth(Role.PROVIDER), gearController.deleteGear);

router.get("/gear", auth(Role.PROVIDER), gearController.getMyGear);

// provider.route.ts

router.get(
  "/payments",
  auth(Role.PROVIDER),
  paymentController.getProviderPayments,
);

export const providerRoutes = router;
