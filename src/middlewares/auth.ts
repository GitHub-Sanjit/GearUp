import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { jwtUtils } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        name: string;
        id: string;
        role: Role;
      };
    }
  }
}

export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      throw new Error(
        "You are not logged in. Please log in to Access this resources",
      );
    }

    const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

    console.log("Verified Token:", verifiedToken.data);
    if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
    }

    const { email, name, id, role } = verifiedToken.data as JwtPayload;

    console.log("Required Roles:", requiredRoles);
    console.log("User Role:", role);
    console.log("Includes:", requiredRoles.includes(role));

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new Error(
        "Forbidden. You don't have permission to access this resources",
      );
    }

    // if (requiredRoles.length && !requiredRoles.includes(role)) {
    //   console.log("BLOCKED");
    //   return res.status(403).json({
    //     success: false,
    //     message: "Forbidden",
    //   });
    // }

    const user = await prisma.user.findUnique({
      where: { id, email, name, role },
    });

    if (!user) {
      throw new Error("User now found. Please login Again");
    }

    if (user.activeStatus === "SUSPEND") {
      throw new Error(
        "Your Account has been suspended. Please Contact Support",
      );
    }

    req.user = { email, name, id, role };

    next();
  });
};
