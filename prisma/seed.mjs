import { PrismaClient } from "@prisma/client";

import { gpus } from "./data/gpus.js";
import { cpus } from "./data/cpus.js";
import { rams } from "./data/rams.js";
import { storage } from "./data/storage.js";

import { buildProduct } from "./data/helpers.js";

const prisma = new PrismaClient();

async function main() {
    const gpu = await prisma.category.upsert({
        where: { name: "GPU" },
        update: {},
        create: { name: "GPU" },
    });

    const cpu = await prisma.category.upsert({
        where: { name: "CPU" },
        update: {},
        create: { name: "CPU" },
    });

    const ram = await prisma.category.upsert({
        where: { name: "RAM" },
        update: {},
        create: { name: "RAM" },
    });

    const sto = await prisma.category.upsert({
        where: { name: "STORAGE" },
        update: {},
        create: { name: "STORAGE" },
    });

    await prisma.product.deleteMany();

    const products = [
        ...gpus.map((p) => buildProduct(p, gpu.id, "GPU")),
        ...cpus.map((p) => buildProduct(p, cpu.id, "CPU")),
        ...rams.map((p) => buildProduct(p, ram.id, "RAM")),
        ...storage.map((p) => buildProduct(p, sto.id, "STORAGE")),
    ];

    await prisma.product.createMany({
        data: products,
    });
}

main()
    .then(() => console.log("Seed completo 🌱"))
    .catch(console.error)
    .finally(() => prisma.$disconnect());