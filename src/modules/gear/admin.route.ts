import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { gearController } from "./gear.controller";

const router = Router();

router.get("/gears", auth(Role.ADMIN), gearController.getAllGearForAdmin);

export const adminGearRoutes = router;
