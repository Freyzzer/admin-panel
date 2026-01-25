import { PrismaClient, Prisma, ClientStatus, PaymentStatus, PaymentMethod } from "../app/generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Company
  const company = await prisma.company.create({
    data: {
      name: "Wave Services",
      slug: "wave-services",
    },
  });

  // 2. Users (Admin / Staff)
  await prisma.user.createMany({
    data: [
      {
        name: "Admin Principal",
        email: "admin@wave.com",
        role: "ADMIN",
        companyId: company.id,
      },
      {
        name: "Staff User",
        email: "staff@wave.com",
        role: "STAFF",
        companyId: company.id,
      },
    ],
  });

  // 3. Plans
  const basicPlan = await prisma.plan.create({
    data: {
      name: "Basic",
      price: 15,
      interval: "monthly",
      companyId: company.id,
    },
  });

  const proPlan = await prisma.plan.create({
    data: {
      name: "Pro",
      price: 25,
      interval: "monthly",
      companyId: company.id,
    },
  });

  const premiumPlan = await prisma.plan.create({
    data: {
      name: "Premium",
      price: 40,
      interval: "monthly",
      companyId: company.id,
    },
  });

  const plans = [basicPlan, proPlan, premiumPlan];

  // 4. Clients
  const clients = [];

  for (let i = 1; i <= 25; i++) {
    const client = await prisma.client.create({
      data: {
        name: `Client ${i}`,
        email: `client${i}@email.com`,
        phone: `30000000${i}`,
        status:
          i % 5 === 0
            ? ClientStatus.SUSPENDED
            : i % 7 === 0
            ? ClientStatus.CANCELLED
            : ClientStatus.ACTIVE,
        companyId: company.id,
        planId: plans[i % plans.length].id,
      },
    });

    clients.push(client);
  }

  // 5. Payments
  for (const client of clients) {
    const paymentsCount = Math.floor(Math.random() * 4) + 1;

    for (let i = 0; i < paymentsCount; i++) {
      const status =
        i === paymentsCount - 1 && Math.random() > 0.6
          ? PaymentStatus.PENDING
          : PaymentStatus.PAID;

      await prisma.payment.create({
        data: {
          amount: client.planId === premiumPlan.id ? 40 : client.planId === proPlan.id ? 25 : 15,
          status,
          method: Object.values(PaymentMethod)[
            Math.floor(Math.random() * Object.values(PaymentMethod).length)
          ],
          clientId: client.id,
          companyId: company.id,
          paidAt: status === PaymentStatus.PAID ? new Date() : null,
        },
      });
    }
  }

  console.log("✅ Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });