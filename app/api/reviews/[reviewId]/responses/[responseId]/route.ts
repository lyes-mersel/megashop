import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import {
  formatReviewResponsesData,
  getReviewResponsesSelect,
} from "@/lib/helpers/reviews";
import { auth } from "@/lib/auth";
import {
  formatValidationErrors,
  reviewResponseSchema,
} from "@/lib/validations";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ reviewId: string; responseId: string }> }
) {
  const { reviewId } = await params;
  const { responseId } = await params;

  if (
    !reviewId ||
    !responseId ||
    typeof reviewId !== "string" ||
    typeof responseId !== "string"
  ) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.BAD_REQUEST_ID },
      { status: 400 }
    );
  }

  try {
    const response = await prisma.reponseEvaluation.findUnique({
      where: { id: responseId, evaluationId: reviewId },
      select: getReviewResponsesSelect(),
    });

    if (!response) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND },
        { status: 404 }
      );
    }

    const data = formatReviewResponsesData(response);

    return NextResponse.json(
      { message: "Réponse récupérée avec succès", data },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "API Error [GET /api/review/[reviewId]/responses/[responseId]]:",
      error
    );
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ reviewId: string; responseId: string }> }
) {
  const { reviewId } = await params;
  const { responseId } = await params;

  if (
    !reviewId ||
    !responseId ||
    typeof reviewId !== "string" ||
    typeof responseId !== "string"
  ) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.BAD_REQUEST_ID },
      { status: 400 }
    );
  }

  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      );
    }

    // Validate request body
    const body = await req.json();
    const parsedData = reviewResponseSchema.safeParse(body);

    if (!parsedData.success) {
      return formatValidationErrors(parsedData);
    }

    const { text } = parsedData.data;

    // Check if the response exists
    const existingResponse = await prisma.reponseEvaluation.findUnique({
      where: { id: responseId, evaluationId: reviewId },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!existingResponse) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND },
        { status: 404 }
      );
    }

    // Ensure only the response owner can update
    if (existingResponse.userId !== session.user.id) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.FORBIDDEN },
        { status: 403 }
      );
    }

    // Update the response
    const updatedResponse = await prisma.reponseEvaluation.update({
      where: { id: responseId },
      data: { text },
      select: getReviewResponsesSelect(),
    });

    const formatted = formatReviewResponsesData(updatedResponse);

    return NextResponse.json(
      {
        message: "Réponse mise à jour avec succès.",
        data: formatted,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "API Error [PUT /api/reviews/[reviewId]/responses/[responseId]]:",
      error
    );
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ reviewId: string; responseId: string }> }
) {
  const { reviewId } = await params;
  const { responseId } = await params;

  if (
    !reviewId ||
    !responseId ||
    typeof reviewId !== "string" ||
    typeof responseId !== "string"
  ) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.BAD_REQUEST_ID },
      { status: 400 }
    );
  }

  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      );
    }

    const user = session.user;

    // Check if the response exists
    const response = await prisma.reponseEvaluation.findUnique({
      where: { id: responseId, evaluationId: reviewId },
      select: { id: true, userId: true },
    });

    if (!response) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND },
        { status: 404 }
      );
    }

    // Allow only the concerned user or an admin to delete
    const isOwner = response.userId === user.id;
    const isAdmin = user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.FORBIDDEN },
        { status: 403 }
      );
    }

    await prisma.reponseEvaluation.delete({
      where: { id: responseId },
    });

    return NextResponse.json(
      { message: "Réponse supprimée avec succès." },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "API Error [DELETE /api/reviews/[reviewId]/responses/[responseId]]:",
      error
    );
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
