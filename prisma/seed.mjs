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
        where: { name: "STORAGE" },
        update: {},
        create: { name: "STORAGE" },
    });

    await prisma.product.createMany({
        data: [
            // 🟢 GPU
            {
                title: "RTX 3060",
                price: 350,
                thumbnail: "https://dlcdnwebimgs.asus.com/gain/d52e1124-7fdc-4ba1-8bab-29fea27e8272/w692",
                stock: 10,
                categoryId: gpu.id,
            },
            {
                title: "RTX 3070",
                price: 500,
                thumbnail: "https://dlcdnwebimgs.asus.com/gain/053b4bff-7ff8-4f6f-b41f-a70766bc3a99/",
                stock: 8,
                categoryId: gpu.id,
            },
            {
                title: "RTX 3080",
                price: 700,
                thumbnail: "https://dlcdnwebimgs.asus.com/gain/95f0e9a2-aa85-473e-b5a6-b1e3bb3341a6/w692",
                stock: 5,
                categoryId: gpu.id,
                featured: true
            },
            {
                title: "RX 6700 XT",
                price: 480,
                thumbnail: "https://dlcdnwebimgs.asus.com/gain/7942f7a6-d4d8-4cb0-8f60-c3c0dfc7f291/",
                stock: 7,
                categoryId: gpu.id,
                featured: true
            },
            {
                title: "RX 6800",
                price: 600,
                thumbnail: "https://dlcdnwebimgs.asus.com/gain/9f14ea28-9979-4c86-a831-07e5e455c7a3/",
                stock: 6,
                categoryId: gpu.id,
            },

            // 🔵 CPU
            {
                title: "Ryzen 5 5600X",
                price: 220,
                thumbnail: "https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2463180-ryzen-chip-front.png",
                stock: 15,
                categoryId: cpu.id,
            },
            {
                title: "Ryzen 7 5800X",
                price: 300,
                thumbnail: "https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2463180-ryzen-chip-front.png",
                stock: 12,
                categoryId: cpu.id,
                featured: true
            },
            {
                title: "Ryzen 9 5900X",
                price: 450,
                thumbnail: "https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2463180-ryzen-chip-front.png",
                stock: 9,
                categoryId: cpu.id,
            },
            {
                title: "Intel i5 12400F",
                price: 180,
                thumbnail: "https://www.venex.com.ar/products_images/1617202662_1555515752_sda.png",
                stock: 20,
                categoryId: cpu.id,
                featured: true
            },
            {
                title: "Intel i7 12700K",
                price: 320,
                thumbnail: "https://www.venex.com.ar/products_images/1617202662_1555515752_sda.png",
                stock: 10,
                categoryId: cpu.id,
            },

            // 🟡 RAM
            {
                title: "8GB DDR4",
                price: 40,
                thumbnail: "https://www.pngall.com/wp-content/uploads/5/Gaming-RAM-PNG-File.png",
                stock: 30,
                categoryId: ram.id,
            },
            {
                title: "16GB DDR4",
                price: 80,
                thumbnail: "https://www.pngall.com/wp-content/uploads/5/Gaming-RAM-PNG-File.png",
                stock: 25,
                categoryId: ram.id,
            },
            {
                title: "32GB DDR4",
                price: 150,
                thumbnail: "https://www.pngall.com/wp-content/uploads/5/Gaming-RAM-PNG-File.png",
                stock: 12,
                categoryId: ram.id,
            },
            {
                title: "16GB DDR5",
                price: 120,
                thumbnail: "https://www.pngall.com/wp-content/uploads/5/Gaming-RAM-PNG-File.png",
                stock: 18,
                categoryId: ram.id,
            },
            {
                title: "32GB DDR5",
                price: 220,
                thumbnail: "https://www.pngall.com/wp-content/uploads/5/Gaming-RAM-PNG-File.png",
                stock: 10,
                categoryId: ram.id,
            },

            // 🟣 STORAGE
            {
                title: "SSD 500GB",
                price: 60,
                thumbnail: "https://www.pngall.com/wp-content/uploads/5/SSD-PNG-Image-File.png",
                stock: 20,
                categoryId: storage.id,
            },
            {
                title: "SSD 1TB",
                price: 100,
                thumbnail: "https://www.pngall.com/wp-content/uploads/5/SSD-PNG-Image-File.png",
                stock: 18,
                categoryId: storage.id,
            },
            {
                title: "SSD 2TB",
                price: 180,
                thumbnail: "https://www.pngall.com/wp-content/uploads/5/SSD-PNG-Image-File.png",
                stock: 10,
                categoryId: storage.id,
                featured: true
            },
            {
                title: "HDD 1TB",
                price: 50,
                thumbnail: "https://pngimg.com/uploads/hard_disc/Hard%20disc%20PNG,%20hard%20drive%20PNG%20images%20free%20download,%20HDD%20PNG_PNG12038.png",
                stock: 25,
                categoryId: storage.id,
            },
            {
                title: "HDD 2TB",
                price: 80,
                thumbnail: "https://pngimg.com/uploads/hard_disc/Hard%20disc%20PNG,%20hard%20drive%20PNG%20images%20free%20download,%20HDD%20PNG_PNG12038.png",
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