import bcrypt from "bcryptjs";
import config from "../src/config";
import { ActiveStatus, GearCondition, Role } from "../generated/prisma/enums";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🌱 Seeding database...");

  // Delete child tables first
  await prisma.payment.deleteMany();
  await prisma.rentalOrder.deleteMany();
  await prisma.gear.deleteMany();
  await prisma.category.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash(
    "admin123",
    Number(config.bcrypt_salt_rounds),
  );

  // ==========================
  // Admin
  // ==========================

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@gearup.com",
      password: hashedPassword,
      role: Role.ADMIN,
      activeStatus: ActiveStatus.ACTIVATE,

      profile: {
        create: {
          profilePhoto: "https://i.pravatar.cc/300?img=1",
        },
      },
    },
  });

  // ==========================
  // Provider
  // ==========================

  const provider = await prisma.user.create({
    data: {
      name: "John Provider",
      email: "provider@gearup.com",
      password: hashedPassword,
      role: Role.PROVIDER,
      activeStatus: ActiveStatus.ACTIVATE,

      profile: {
        create: {
          profilePhoto: "https://i.pravatar.cc/300?img=2",
        },
      },
    },
  });

  // ==========================
  // Customer
  // ==========================

  const customer = await prisma.user.create({
    data: {
      name: "Jane Customer",
      email: "customer@gearup.com",
      password: hashedPassword,
      role: Role.CUSTOMER,
      activeStatus: ActiveStatus.ACTIVATE,

      profile: {
        create: {
          profilePhoto: "https://i.pravatar.cc/300?img=3",
        },
      },
    },
  });

  console.log("✅ Users Created");

  // ==========================
  // Categories
  // ==========================

  const camping = await prisma.category.create({
    data: {
      name: "Camping",
      description: "Camping equipment",
    },
  });

  const cycling = await prisma.category.create({
    data: {
      name: "Cycling",
      description: "Cycling equipment",
    },
  });

  const fitness = await prisma.category.create({
    data: {
      name: "Fitness",
      description: "Fitness gear",
    },
  });

  const football = await prisma.category.create({
    data: {
      name: "Football",
      description: "Football accessories",
    },
  });

  const hiking = await prisma.category.create({
    data: {
      name: "Hiking",
      description: "Hiking equipment",
    },
  });

  console.log("✅ Categories Created");

  // ==========================
  // Gear
  // ==========================

  await prisma.gear.createMany({
    data: [
      {
        name: "Mountain Bike",
        brand: "Trek",
        dailyRentalPrice: 25,
        stockQuantity: 5,
        availableQuantity: 5,
        providerId: provider.id,
        categoryId: cycling.id,
        condition: GearCondition.EXCELLENT,
      },
      {
        name: "Camping Tent",
        brand: "Coleman",
        dailyRentalPrice: 18,
        stockQuantity: 8,
        availableQuantity: 8,
        providerId: provider.id,
        categoryId: camping.id,
        condition: GearCondition.GOOD,
      },
      {
        name: "Football",
        brand: "Nike",
        dailyRentalPrice: 8,
        stockQuantity: 20,
        availableQuantity: 20,
        providerId: provider.id,
        categoryId: football.id,
        condition: GearCondition.NEW,
      },
      {
        name: "Treadmill",
        brand: "NordicTrack",
        dailyRentalPrice: 40,
        stockQuantity: 2,
        availableQuantity: 2,
        providerId: provider.id,
        categoryId: fitness.id,
        condition: GearCondition.EXCELLENT,
      },
      {
        name: "Hiking Backpack",
        brand: "Deuter",
        dailyRentalPrice: 15,
        stockQuantity: 10,
        availableQuantity: 10,
        providerId: provider.id,
        categoryId: hiking.id,
        condition: GearCondition.GOOD,
      },
    ],
  });

  console.log("✅ Gear Created");

  console.log("\n===============================");
  console.log("Seed Completed");
  console.log("===============================");
  console.log("Admin    : admin@gearup.com");
  console.log("Provider : provider@gearup.com");
  console.log("Customer : customer@gearup.com");
  console.log("Password : admin123");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
