// /api/reviews/[reviewId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { getReviewSelect, formatReviewData } from "@/lib/helpers/reviews";
import { auth } from "@/lib/auth";
import { formatValidationErrors } from "@/lib/validations";
import { updateReviewSchema } from "@/lib/validations/review";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const { reviewId } = await params;

    // Check if reviewId is provided
    if (!reviewId) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_REQUEST_ID },
        { status: 400 }
      );
    }

    // Fetch review
    const review = await prisma.evaluation.findUnique({
      where: { id: reviewId },
      select: getReviewSelect(),
    });

    if (!review) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND },
        { status: 404 }
      );
    }

    const formattedReview = formatReviewData(review);

    return NextResponse.json(
      {
        message: "L’évaluation a été récupérée avec succès",
        data: formattedReview,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [GET /api/reviews/[reviewId]]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }

  const userId = session.user.id;
  const { reviewId } = await params;
  const body = await req.json();

  const parsedData = updateReviewSchema.safeParse(body);

  if (!parsedData.success) {
    return formatValidationErrors(parsedData);
  }

  const { note, text } = parsedData.data;

  try {
    // Check if review exists and belongs to the user
    const existingReview = await prisma.evaluation.findUnique({
      where: { id: reviewId },
      select: { note: true, userId: true, produitId: true },
    });

    if (!existingReview) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND },
        { status: 404 }
      );
    }

    if (existingReview.userId !== userId) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.FORBIDDEN },
        { status: 403 }
      );
    }

    // Only recalculate average if note is being changed
    const productId = existingReview.produitId;
    if (note !== existingReview.note.toNumber()) {
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

      const currentTotal = produit.totalEvaluations ?? 0;
      const currentAverage = produit.noteMoyenne.toNumber() ?? 0;
      const oldNote = existingReview.note.toNumber();
      const newAverage =
        (currentAverage * currentTotal - oldNote + note) / currentTotal;

      await prisma.produit.update({
        where: { id: productId },
        data: { noteMoyenne: newAverage },
      });
    }

    // Update the review
    const updatedReview = await prisma.evaluation.update({
      where: { id: reviewId },
      data: { note, text },
      select: getReviewSelect(),
    });

    const data = formatReviewData(updatedReview);

    return NextResponse.json(
      { message: "L'évaluation a été mise à jour avec succès", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [PUT /api/reviews/[reviewId]]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const session = await auth();

    // Authentication check
    if (!session) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const isAdmin = session.user.role === "ADMIN";
    const { reviewId } = await params;

    // Check if the review exists
    const review = await prisma.evaluation.findUnique({
      where: { id: reviewId },
      select: {
        id: true,
        note: true,
        produitId: true,
        userId: true,
      },
    });

    if (!review) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND },
        { status: 404 }
      );
    }

    // Only admin or the owner can delete
    if (!isAdmin && review.userId !== userId) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.FORBIDDEN },
        { status: 403 }
      );
    }

    // Fetch product stats before deletion
    const produit = await prisma.produit.findUnique({
      where: { id: review.produitId },
      select: { noteMoyenne: true, totalEvaluations: true },
    });

    if (!produit) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND },
        { status: 404 }
      );
    }

    const oldNote = review.note.toNumber();
    const currentTotal = produit.totalEvaluations ?? 0;
    const currentAverage = produit.noteMoyenne.toNumber() ?? 0;

    // Recalculate average rating after deletion
    const newTotal = currentTotal - 1;
    const newAverage =
      newTotal > 0 ? (currentAverage * currentTotal - oldNote) / newTotal : 0;

    // Delete the review
    await prisma.evaluation.delete({
      where: { id: reviewId },
    });

    // Update product stats
    await prisma.produit.update({
      where: { id: review.produitId },
      data: {
        noteMoyenne: newAverage,
        totalEvaluations: newTotal,
      },
    });

    return NextResponse.json(
      { message: "L'évaluation a été supprimée avec succès." },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [DELETE /api/reviews/[reviewId]]:", error);

    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
