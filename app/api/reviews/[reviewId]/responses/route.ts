import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import {
  formatReviewResponsesData,
  getReviewResponsesSelect,
} from "@/lib/helpers/reviews";
import { auth } from "@/lib/auth";
import { formatValidationErrors, reviewResponseSchema } from "@/lib/validations";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  const { reviewId } = await params;

  if (!reviewId || typeof reviewId !== "string") {
    return NextResponse.json(
      { error: ERROR_MESSAGES.BAD_REQUEST_ID },
      { status: 400 }
    );
  }

  try {
    // Check if the review exists
    const review = await prisma.evaluation.findUnique({
      where: { id: reviewId },
      select: { id: true },
    });

    if (!review) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND },
        { status: 404 }
      );
    }

    // Fetch responses to the review
    const responses = await prisma.reponseEvaluation.findMany({
      where: { evaluationId: reviewId },
      orderBy: { date: "asc" },
      select: getReviewResponsesSelect(),
    });

    const data = responses.map(formatReviewResponsesData);

    return NextResponse.json(
      { message: "Les réponses ont été récupérées avec succès", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [GET /api/review/[reviewId]/responses]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  const { reviewId } = await params;

  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      );
    }

    // Parse and validate the request body
    const body = await req.json();
    const parsedData = reviewResponseSchema.safeParse(body);
    if (!parsedData.success) {
      return formatValidationErrors(parsedData);
    }

    const { text } = parsedData.data;

    // Check if the review exists
    const review = await prisma.evaluation.findUnique({
      where: { id: reviewId },
      select: {
        id: true,
        produit: {
          select: {
            produitMarketplace: {
              select: { vendeurId: true },
            },
          },
        },
      },
    });

    if (!review) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND },
        { status: 404 }
      );
    }

    // Allow only admins or product vendors to respond
    const userId = session.user.id;
    const isAdmin = session.user.role === "ADMIN";
    const isVendor = review?.produit?.produitMarketplace?.vendeurId === userId;

    if (!isAdmin && !isVendor) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.FORBIDDEN },
        { status: 403 }
      );
    }

    // Create the response
    const response = await prisma.reponseEvaluation.create({
      data: {
        text,
        evaluationId: reviewId,
        userId,
      },
      select: getReviewResponsesSelect(),
    });

    const formatted = formatReviewResponsesData(response);

    return NextResponse.json(
      {
        message: "Réponse ajoutée avec succès.",
        data: formatted,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error [POST /api/review/[reviewId]/responses]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  const { reviewId } = await params;

  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      );
    }

    const user = session.user;

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: ERROR_MESSAGES.FORBIDDEN },
        { status: 403 }
      );
    }

    // Check if the review exists
    const review = await prisma.evaluation.findUnique({
      where: { id: reviewId },
      select: { id: true },
    });

    if (!review) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND },
        { status: 404 }
      );
    }

    // Delete all responses for the review
    const deleted = await prisma.reponseEvaluation.deleteMany({
      where: { evaluationId: reviewId },
    });

    return NextResponse.json(
      {
        message: "Toutes les réponses ont été supprimées avec succès.",
        count: deleted.count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "API Error [DELETE /api/review/[reviewId]/responses]:",
      error
    );
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
