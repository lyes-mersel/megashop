import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import {
  UserRole,
  SignalementStatut,
  Prisma,
  NotificationType,
} from "@prisma/client";
import { getReportSelect, formatReportData } from "@/lib/helpers/reports";

// GET, PATCH, DELETE a report by ID (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
) {
  const session = await auth();

  if (!session)
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );

  if (session.user.role !== UserRole.ADMIN)
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN },
      { status: 403 }
    );

  const { reportId } = await params;
  try {
    const report = await prisma.signalement.findUnique({
      where: { id: reportId },
      select: getReportSelect(),
    });
    if (!report)
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND },
        { status: 404 }
      );
    return NextResponse.json(
      { message: "Signalement récupéré", data: formatReportData(report) },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [GET /api/reports/[id]]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
) {
  const session = await auth();

  if (!session)
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );

  if (session.user.role !== UserRole.ADMIN)
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN },
      { status: 403 }
    );

  const { reportId } = await params;
  const body = await request.json();
  // Allow updating statut and response independently
  const { statut, reponse } = body;

  // Validate statut if provided
  if (statut && !Object.values(SignalementStatut).includes(statut)) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.BAD_REQUEST_ID },
      { status: 400 }
    );
  }

  // Validate reponse if provided
  if (reponse && (typeof reponse !== "string" || reponse.trim().length === 0)) {
    return NextResponse.json(
      { error: "La réponse doit être un texte non vide" },
      { status: 400 }
    );
  }

  try {
    // First get the report to check if the user still exists
    const report = await prisma.signalement.findUnique({
      where: { id: reportId },
      select: {
        ...getReportSelect(),
        client: {
          select: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND },
        { status: 404 }
      );
    }

    // Update the report with provided fields
    const updated = await prisma.signalement.update({
      where: { id: reportId },
      data: {
        ...(statut && { statut }),
        ...(reponse && { reponse }),
      },
      select: getReportSelect(),
    });

    // If a response was provided and the user still exists, create a notification
    if (reponse && report.client?.user) {
      await prisma.notification.create({
        data: {
          type: NotificationType.SIGNALEMENT,
          objet: `L'administrateur a répondu à votre signalement concernant « ${
            report.produit?.nom || "un produit"
          } »`,
          text: reponse,
          userId: report.client.user.id,
          urlRedirection: `/products/${report.produit?.id}`,
        },
      });
    }

    return NextResponse.json(
      {
        message: "Mise à jour effectuée avec succès",
        data: formatReportData(updated),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [PATCH /api/reports/[id]]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
) {
  const session = await auth();

  if (!session)
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );

  if (session.user.role !== UserRole.ADMIN)
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN },
      { status: 403 }
    );

  const { reportId } = await params;
  try {
    await prisma.signalement.delete({ where: { id: reportId } });
    return NextResponse.json(
      { message: "Signalement supprimé" },
      { status: 200 }
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND },
        { status: 404 }
      );
    }

    console.error("API Error [DELETE /api/reports/[id]]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
