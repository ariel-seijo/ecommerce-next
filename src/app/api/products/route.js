import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      title,
      slug,
      description,
      price,
      oldPrice,
      stock,
      brand,
      categoryId,
      thumbnail,
      images,
      rating,
      sold,
    } = body;

    if (!title || !slug || !price || stock === undefined || !categoryId || !thumbnail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingProduct = await prisma.product.findUnique({ where: { slug } });
    if (existingProduct) {
      return NextResponse.json({ error: 'Product with this slug already exists' }, { status: 409 });
    }

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description: description || '',
        price: parseFloat(price),
        oldPrice: oldPrice ? parseFloat(oldPrice) : null,
        stock: parseInt(stock),
        brand: brand || 'Generic',
        sku: `${slug}-${Date.now()}`,
        categoryId: parseInt(categoryId),
        thumbnail,
        images: images || [],
        rating: parseFloat(rating) || 0,
        sold: parseInt(sold) || 0,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
