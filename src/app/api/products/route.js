import { NextResponse } from "next/server";
import * as productService from "@/features/products/services/product.service";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const filters = {
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      search: searchParams.get("search"),
      categoryId: searchParams.get("categoryId"),
      status: searchParams.get("status"),
      featured: searchParams.get("featured") === "true" ? true : undefined,
      sort: searchParams.get("sort"),
      order: searchParams.get("order"),
    };

    const result = await productService.getAllProducts(filters);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[API GET /products]", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const product = await productService.createProduct(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("[API POST /products]", error);

    const message = error.message || "Failed to create product";

    if (message.includes("Missing required fields")) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    if (message.includes("must be greater than 0") || message.includes("must be at least 0")) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    if (message === "Category not found") {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    if (message === "Slug already exists" || message === "SKU already exists") {
      return NextResponse.json({ error: message }, { status: 409 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
