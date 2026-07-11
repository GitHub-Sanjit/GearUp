import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { gearController } from "./gear.controller";

const router = Router();

router.post(
  "/",
  auth(Role.PROVIDER),
  gearController.createGear,
);

export const gearRoutes = router;