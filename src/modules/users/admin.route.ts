import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";

const router = Router();

router.get("/users", auth(Role.ADMIN), userController.getAllUsers);

router.patch(
  "/users/:id",
  auth(Role.ADMIN),
  validateRequest(userValidation.updateUserStatusValidationSchema),
  userController.updateUserStatus,
);

export const adminUserRoutes = router;
