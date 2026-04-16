import { PrismaClient } from "@prisma/client";

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

    const storage = await prisma.category.upsert({
        where: { name: "Storage" },
        update: {},
        create: { name: "Storage" },
    });

    await prisma.product.createMany({
        data: [
            // 🟢 GPU
            {
                title: "RTX 3060",
                price: 350,
                thumbnail: "https://via.placeholder.com/300",
                stock: 10,
                categoryId: gpu.id,
            },
            {
                title: "RTX 3070",
                price: 500,
                thumbnail: "https://via.placeholder.com/300",
                stock: 8,
                categoryId: gpu.id,
            },
            {
                title: "RTX 3080",
                price: 700,
                thumbnail: "https://via.placeholder.com/300",
                stock: 5,
                categoryId: gpu.id,
            },
            {
                title: "RX 6700 XT",
                price: 480,
                thumbnail: "https://via.placeholder.com/300",
                stock: 7,
                categoryId: gpu.id,
            },
            {
                title: "RX 6800",
                price: 600,
                thumbnail: "https://via.placeholder.com/300",
                stock: 6,
                categoryId: gpu.id,
            },

            // 🔵 CPU
            {
                title: "Ryzen 5 5600X",
                price: 220,
                thumbnail: "https://via.placeholder.com/300",
                stock: 15,
                categoryId: cpu.id,
            },
            {
                title: "Ryzen 7 5800X",
                price: 300,
                thumbnail: "https://via.placeholder.com/300",
                stock: 12,
                categoryId: cpu.id,
            },
            {
                title: "Ryzen 9 5900X",
                price: 450,
                thumbnail: "https://via.placeholder.com/300",
                stock: 9,
                categoryId: cpu.id,
            },
            {
                title: "Intel i5 12400F",
                price: 180,
                thumbnail: "https://via.placeholder.com/300",
                stock: 20,
                categoryId: cpu.id,
            },
            {
                title: "Intel i7 12700K",
                price: 320,
                thumbnail: "https://via.placeholder.com/300",
                stock: 10,
                categoryId: cpu.id,
            },

            // 🟡 RAM
            {
                title: "8GB DDR4",
                price: 40,
                thumbnail: "https://via.placeholder.com/300",
                stock: 30,
                categoryId: ram.id,
            },
            {
                title: "16GB DDR4",
                price: 80,
                thumbnail: "https://via.placeholder.com/300",
                stock: 25,
                categoryId: ram.id,
            },
            {
                title: "32GB DDR4",
                price: 150,
                thumbnail: "https://via.placeholder.com/300",
                stock: 12,
                categoryId: ram.id,
            },
            {
                title: "16GB DDR5",
                price: 120,
                thumbnail: "https://via.placeholder.com/300",
                stock: 18,
                categoryId: ram.id,
            },
            {
                title: "32GB DDR5",
                price: 220,
                thumbnail: "https://via.placeholder.com/300",
                stock: 10,
                categoryId: ram.id,
            },

            // 🟣 STORAGE
            {
                title: "SSD 500GB",
                price: 60,
                thumbnail: "https://via.placeholder.com/300",
                stock: 20,
                categoryId: storage.id,
            },
            {
                title: "SSD 1TB",
                price: 100,
                thumbnail: "https://via.placeholder.com/300",
                stock: 18,
                categoryId: storage.id,
            },
            {
                title: "SSD 2TB",
                price: 180,
                thumbnail: "https://via.placeholder.com/300",
                stock: 10,
                categoryId: storage.id,
            },
            {
                title: "HDD 1TB",
                price: 50,
                thumbnail: "https://via.placeholder.com/300",
                stock: 25,
                categoryId: storage.id,
            },
            {
                title: "HDD 2TB",
                price: 80,
                thumbnail: "https://via.placeholder.com/300",
                stock: 15,
                categoryId: storage.id,
            },
        ],
    });
}

main()
    .then(() => console.log("Seed completo 🌱"))
    .catch(console.error)
    .finally(() => prisma.$disconnect());