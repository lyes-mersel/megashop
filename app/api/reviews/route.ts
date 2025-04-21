// /api/products/[productId]/reviews/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { formatReviewData, getReviewSelect } from "@/lib/helpers/reviews";
import { reviewSchema, formatValidationErrors } from "@/lib/validations";
import { Prisma } from "@prisma/client";
import {
  getPaginationParams,
  getSortingReviewsParams,
} from "@/lib/utils/params";

// GET all reviews for a product
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const { page, pageSize, skip } = getPaginationParams(req);
    const { sortBy, sortOrder } = getSortingReviewsParams(req);

    // Check if productId is provided
    if (!productId) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_REQUEST_ID },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.produit.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND },
        { status: 404 }
      );
    }

    // Fetch all reviews and count
    const totalEvaluations = await prisma.evaluation.count({
      where: { produitId: productId },
    });
    const evaluations = await prisma.evaluation.findMany({
      where: { produitId: productId },
      orderBy: { [sortBy]: sortOrder },
      select: getReviewSelect(),
      take: pageSize,
      skip,
    });

    // Pagination
    const pagination = {
      totalItems: totalEvaluations,
      totalPages: Math.ceil(totalEvaluations / pageSize),
      currentPage: page,
      pageSize,
    };

    return NextResponse.json(
      {
        message: "Les évaluations ont été récupérées avec succès",
        pagination,
        data: evaluations,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [GET /api/products/[productId]/reviews]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();

  // Authentication Check
  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }

  // Parse and validate the request body
  const userId = session.user.id;
  const body = await req.json();
  const parsedData = reviewSchema.safeParse(body);

  if (!parsedData.success) {
    return formatValidationErrors(parsedData);
  }

  const { note, text, productId } = parsedData.data;

  try {
    // Check if product exists
    const produit = await prisma.produit.findUnique({
      where: { id: productId },
      select: { noteMoyenne: true, totalEvaluations: true },
    });

    if (!produit) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND },
        { status: 404 }
      );
    }

    // Update the average rating and total evaluations
    const currentAverage = produit.noteMoyenne.toNumber() ?? 0;
    const currentTotal = produit.totalEvaluations ?? 0;
    const newAverage =
      (currentAverage * currentTotal + note) / (currentTotal + 1);

    await prisma.produit.update({
      where: { id: productId },
      data: {
        noteMoyenne: newAverage,
        totalEvaluations: {
          increment: 1,
        },
      },
    });

    // Create the review
    const newReview = await prisma.evaluation.create({
      data: {
        note,
        text,
        produitId: productId,
        userId,
      },
      select: getReviewSelect(),
    });

    // Format the response data
    const data = formatReviewData(newReview);

    return NextResponse.json(
      { message: "L'évaluation a été bien enregistrée", data },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "API Error [POST /api/products/[productId]/reviews] :",
      error
    );

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_REQUEST_ID },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();

    // Authentication check
    if (!session) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      );
    }

    // Authorization check: only admins can delete all reviews
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: ERROR_MESSAGES.FORBIDDEN },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    // Check if productId is provided
    if (!productId) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_REQUEST_ID },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.produit.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND },
        { status: 404 }
      );
    }

    // Delete all evaluations for this product
    const deleted = await prisma.evaluation.deleteMany({
      where: { produitId: productId },
    });

    // Reset product stats
    await prisma.produit.update({
      where: { id: productId },
      data: {
        noteMoyenne: 0,
        totalEvaluations: 0,
      },
    });

    return NextResponse.json(
      {
        message: "Toutes les évaluations ont été supprimées avec succès.",
        count: deleted.count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [DELETE /api/reviews]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
