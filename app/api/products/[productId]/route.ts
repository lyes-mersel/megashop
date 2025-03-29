import { prisma } from "@/lib/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

import { formatProductData, getProductSelect } from "@/lib/api/products";

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
    console.error("API Error : ", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Veuillez réessayer plus tard !" },
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
