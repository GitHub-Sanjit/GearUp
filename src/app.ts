import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import config from "./config";
import { userRoutes } from "./modules/users/user.route";
import { authRoutes } from "./modules/auth/auth.route";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { categoryRoutes } from "./modules/category/caterory.route";
import { gearRoutes } from "./modules/gear/gear.route";
import { providerRoutes } from "./modules/gear/provider.route";
import { rentalRoutes } from "./modules/rental/rental.route";
import { paymentRoutes } from "./modules/payment/payment.route";
import { adminUserRoutes } from "./modules/users/admin.route";
import { adminGearRoutes } from "./modules/gear/admin.route";
import { adminRentalRoutes } from "./modules/rental/admin.route";
// import { subscriptionRoutes } from "./modules/subcription/subcription.route";
// import { premiumRoutes } from "./modules/premium/premium.route";

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (req: Request, res: Response) => {
  res.json({ message: "This is the Root Route And Welcome to Our API" });
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/gear", gearRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/payments", paymentRoutes);

app.use("/api/admin", adminUserRoutes);
app.use("/api/admin", adminGearRoutes);
app.use("/api/admin", adminRentalRoutes);

/*
  Admin    : admin@gearup.com
  Provider : provider@gearup.com
  Customer : customer@gearup.com
  Password : admin123
*/

app.use(notFound);

app.use(globalErrorHandler);

export default app;
