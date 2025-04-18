import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";

import { formatProductData, getProductSelect } from "@/lib/helpers/products";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    // Fetch product by ID
    const product = await prisma.produit.findUnique({
      where: { id: productId },
      select: getProductSelect(),
    });

    // Check if product exists
    if (!product) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      );
    }

    // Format the response
    const data = formatProductData(product);

    return NextResponse.json({ message: "OK", data }, { status: 200 });
  } catch (error) {
    console.error("API Error [GET PRODUCT BY ID] : ", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

export async function PUT(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  return NextResponse.json(
    { message: `Update product with ID: ${productId}` },
    { status: 200 }
  );
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  return NextResponse.json(
    { message: `Delete product with ID: ${productId}` },
    { status: 200 }
  );
}
