import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { UserRole, SignalementStatut, Prisma } from "@prisma/client";
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
  // Only allow updating statut
  const statut = body.statut as SignalementStatut;
  if (!Object.values(SignalementStatut).includes(statut)) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.BAD_REQUEST_ID },
      { status: 400 }
    );
  }

  try {
    const updated = await prisma.signalement.update({
      where: { id: reportId },
      data: { statut },
      select: getReportSelect(),
    });
    return NextResponse.json(
      { message: "Statut mis à jour", data: formatReportData(updated) },
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
