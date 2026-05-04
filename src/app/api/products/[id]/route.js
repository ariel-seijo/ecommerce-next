import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { unlink } from 'fs/promises';
import path from 'path';

export async function GET(request, { params }) {
  const { id: productId } = await params;
  try {
    const id = parseInt(productId);

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id: productId } = await params;
  try {
    const id = parseInt(productId);
    const body = await request.json();

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

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

    if (slug && slug !== existingProduct.slug) {
      const slugExists = await prisma.product.findUnique({ where: { slug } });
      if (slugExists && slugExists.id !== id) {
        return NextResponse.json({ error: 'Product with this slug already exists' }, { status: 409 });
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        title,
        slug,
        description: description || '',
        price: parseFloat(price),
        oldPrice: oldPrice ? parseFloat(oldPrice) : null,
        stock: parseInt(stock),
        brand: brand || 'Generic',
        categoryId: parseInt(categoryId),
        thumbnail,
        images: images || [],
        rating: parseFloat(rating) || 0,
        sold: parseInt(sold) || 0,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id: productId } = await params;
  try {
    const id = parseInt(productId);

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    async function deleteImageFile(imagePath) {
      if (!imagePath || !imagePath.startsWith('/uploads/')) return;
      const filePath = path.join(process.cwd(), 'public', imagePath);
      try {
        await unlink(filePath);
      } catch (err) {
        console.error('Error deleting image:', imagePath);
      }
    }

    await deleteImageFile(existingProduct.thumbnail);
    if (existingProduct.images?.length) {
      for (const img of existingProduct.images) {
        await deleteImageFile(img);
      }
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
