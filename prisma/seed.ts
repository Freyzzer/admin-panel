import { PrismaClient, Prisma, ClientStatus, PaymentStatus, PaymentMethod } from "../app/generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
});

// Helper function to create Decimal from number
const toDecimal = (value: number) => new Prisma.Decimal(value);

async function main() {
  console.log("🌱 Seeding database...");

  // ========================
  // 1. Crear Empresa
  // ========================
  const company = await prisma.company.upsert({
    where: { slug: 'streaming-colombia' },
    update: {},
    create: {
      name: 'Streaming Colombia SAS',
      slug: 'streaming-colombia',
    },
  })

  console.log(`Empresa creada: ${company.name}`)

  // ========================
  // 2. Crear Usuarios
  // ========================
  const admin = await prisma.user.upsert({
    where: { email: 'admin@streamingcolombia.com' },
    update: {},
    create: {
      name: 'Admin Principal',
      email: 'admin@streamingcolombia.com',
      password: await hashPassword('admin123456'),     // ← contraseña que tú quieras // Cambia esto por un hash real (bcrypt)
      role: 'ADMIN',
      companyId: company.id,
    },
  })

  const staff = await prisma.user.upsert({
    where: { email: 'ventas@streamingcolombia.com' },
    update: {},
    create: {
      name: 'Juan Carlos Ramírez',
      email: 'ventas@streamingcolombia.com',
      password: await hashPassword('ventas123456'),
      role: 'STAFF',
      companyId: company.id,
    },
  })

  // ========================
  // 3. Crear Planes de Streaming
  // ========================
  const plans = [
    { name: "Netflix Básico", price: 29900, interval: "monthly" },
    { name: "Netflix Estándar", price: 44900, interval: "monthly" },
    { name: "Netflix Premium", price: 69900, interval: "monthly" },
    { name: "Disney+ Premium", price: 39900, interval: "monthly" },
    { name: "HBO Max", price: 49900, interval: "monthly" },
    { name: "Amazon Prime Video", price: 29900, interval: "monthly" },
    { name: "Apple TV+", price: 24900, interval: "monthly" },
    { name: "Combo Netflix + Disney", price: 79900, interval: "monthly" },
    { name: "Paramount+ + Showtime", price: 35900, interval: "monthly" },
    { name: "Netflix Premium Anual", price: 699000, interval: "yearly" },
  ]

  const createdPlans = []
  for (const p of plans) {
    const plan = await prisma.plan.upsert({
      where: {
        companyId_name: {           // ← exactamente este nombre
          companyId: company.id,
          name: p.name,
        },
      },
      update: {},                   // nada que actualizar si ya existe
      create: {
        name: p.name,
        price: p.price.toString(),   // o new Prisma.Decimal(p.price) si lo prefieres
        interval: p.interval,
        companyId: company.id,
      },
    })

    createdPlans.push(plan)
  }

  console.log(`${createdPlans.length} planes creados`)

  // ========================
  // 4. Crear 35 Clientes
  // ========================
  const clientData = [
    { name: "Juan Pablo Rodríguez", email: "juanpablo@gmail.com", phone: "3104567890" },
    { name: "María Fernanda López", email: "mafe.lopez@hotmail.com", phone: "3156782345" },
    { name: "Carlos Andrés Gómez", email: "carlosgomez22@yahoo.com", phone: "3209876543" },
    { name: "Ana Sofía Martínez", email: "anasofia.m@gmail.com", phone: "3123456789" },
    { name: "Luis Miguel Torres", email: "luismiguel.torres@outlook.com", phone: "3012345678" },
    { name: "Valentina Ruiz", email: "valenruiz15@gmail.com", phone: "3145678901" },
    { name: "Santiago Morales", email: "santiagomorales@gmail.com", phone: "3167890123" },
    { name: "Camila Herrera", email: "camiherrera@gmail.com", phone: "3189012345" },
    { name: "Diego Alejandro Vargas", email: "diego.vargas@empresa.com", phone: "3056789012" },
    { name: "Isabella Castro", email: "isacastro.18@hotmail.com", phone: "3190123456" },
    // ... (Voy a continuar hasta 35 en la versión final)
    { name: "Mateo Jiménez", email: "mateojimenez@gmail.com", phone: "3114567890" },
    { name: "Sara Valentina Cruz", email: "saracruz99@gmail.com", phone: "3178901234" },
    { name: "Sebastián Ortiz", email: "sebasortiz@gmail.com", phone: "3135678901" },
    { name: "Laura Daniela Silva", email: "lauradsilva@gmail.com", phone: "3204567890" },
    { name: "Samuel Mendoza", email: "samuel.mendoza@outlook.com", phone: "3156789012" },
    { name: "Gabriela Soto", email: "gabisoto22@gmail.com", phone: "3145671234" },
    { name: "Alejandro Ríos", email: "alerios89@gmail.com", phone: "3189015678" },
    { name: "Paula Andrea Vargas", email: "paula.vargas@gmail.com", phone: "3012349876" },
    { name: "Nicolás Herrera", email: "nicolasherrera@gmail.com", phone: "3105678901" },
    { name: "Mariana López", email: "marianita.lopez@gmail.com", phone: "3167893456" },
    { name: "David Esteban Muñoz", email: "davidesteban@gmail.com", phone: "3123456789" },
    { name: "Daniela Ortiz", email: "danielao@gmail.com", phone: "3190126789" },
    { name: "Tomás Ramírez", email: "tomasramirez@gmail.com", phone: "3056782345" },
    { name: "Elena Vargas", email: "elenavargas15@gmail.com", phone: "3178904567" },
    { name: "Miguel Ángel Castro", email: "miguelangel.c@gmail.com", phone: "3145678901" },
    { name: "Sofía Morales", email: "sofiamorales@gmail.com", phone: "3112345678" },
    { name: "Andrés Felipe Gómez", email: "andresfelipeg@gmail.com", phone: "3209871234" },
    { name: "Valeria Jiménez", email: "valerijimenez@gmail.com", phone: "3189012345" },
    { name: "José Manuel Torres", email: "josemanuelt@gmail.com", phone: "3156789012" },
    { name: "Catalina Ruiz", email: "catalinaruiz@gmail.com", phone: "3124567890" },
    { name: "Emilio Sánchez", email: "emiliosanchez@gmail.com", phone: "3190123456" },
    { name: "Luciana Pérez", email: "lucianaperez@gmail.com", phone: "3012345678" },
    { name: "Fernando Morales", email: "fermorales22@gmail.com", phone: "3167890123" },
    { name: "Isabella Gómez", email: "isagomez18@gmail.com", phone: "3145678901" },
    { name: "Rodrigo Vargas", email: "rodrigovargas@gmail.com", phone: "3105678901" },
  ]

  for (let i = 0; i < clientData.length; i++) {
    const client = clientData[i]
    const randomPlan = createdPlans[Math.floor(Math.random() * createdPlans.length)]
    const statuses = [ClientStatus.ACTIVE, ClientStatus.PENDING, ClientStatus.SUSPENDED]
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

    await prisma.client.upsert({
      where: { email: client.email },
      update: {},
      create: {
        name: client.name,
        email: client.email,
        phone: client.phone,
        status: randomStatus,
        companyId: company.id,
        planId: randomPlan.id,
      },
    })
  }

  console.log(`35 clientes creados exitosamente`)

  // ========================
  // 5. Crear Pagos de ejemplo
  // ========================
  console.log("Creando pagos de ejemplo...");

  const clients = await prisma.client.findMany({
    where: { status: ClientStatus.ACTIVE },
    include: { plan: true },
  });

  let paymentCount = 0;

  for (const client of clients) {
    if (!client.plan) continue; // salta si no tiene plan asignado

    const planPrice = client.plan.price; // ya es Decimal
    const numPayments = Math.floor(Math.random() * 3) + 1; // 1 a 3 pagos

    const methods = [PaymentMethod.NEQUI, PaymentMethod.DAVIPLATA, PaymentMethod.TRANSFER, PaymentMethod.CARD, PaymentMethod.CASH];
    const statuses = [PaymentStatus.PAID, PaymentStatus.PAID, PaymentStatus.PAID, PaymentStatus.PENDING, PaymentStatus.OVERDUE];

    for (let i = 0; i < numPayments; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const method = methods[Math.floor(Math.random() * methods.length)];

      // Fecha aproximada: últimos 12 meses, más reciente para PAID
      const daysAgo = Math.floor(Math.random() * 365) + 1;
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);

      let paidAt: Date | undefined = undefined;
      if (status === PaymentStatus.PAID) {
        paidAt = new Date(createdAt);
        paidAt.setDate(paidAt.getDate() + Math.floor(Math.random() * 3)); // pago 0-3 días después de creado
      }

      await prisma.payment.create({
        data: {
          amount: planPrice,           // o planPrice.mul(12) si quieres simular anual
          status,
          method,
          clientId: client.id,
          companyId: company.id,
          createdAt,
          paidAt,
        },
      });

      paymentCount++;
    }
  }

  console.log(`${paymentCount} pagos creados para ${clients.length} clientes activos`);

  console.log('Seed completado con éxito! ✅')
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const SALT_ROUNDS = 12;

async function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, SALT_ROUNDS);
}