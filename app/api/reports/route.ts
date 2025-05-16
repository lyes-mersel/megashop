// File: app/api/reports/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { Prisma, UserRole } from "@prisma/client";
import {
  getPaginationParams,
  getSortingReportsParams,
} from "@/lib/utils/params";
import { getReportSelect, formatReportData } from "@/lib/helpers/reports";
import { formatValidationErrors, reportSchema } from "@/lib/validations";

// GET all reports (admin only)
export async function GET(request: NextRequest) {
  const session = await auth();

  // Authentication
  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }
  // Authorization
  if (session.user.role !== UserRole.ADMIN) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const { page, pageSize, skip } = getPaginationParams(request);
    const { sortBy, sortOrder } = getSortingReportsParams(request);

    // Construct filter
    const whereClause: Prisma.SignalementWhereInput = {
      ...(search && {
        OR: [
          { id: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { objet: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { text: { contains: search, mode: Prisma.QueryMode.insensitive } },
          {
            client: {
              user: {
                OR: [
                  {
                    nom: {
                      contains: search,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                  {
                    prenom: {
                      contains: search,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                ],
              },
            },
          },
          {
            produit: {
              nom: { contains: search, mode: Prisma.QueryMode.insensitive },
            },
          },
        ],
      }),
    };

    // Count total reports
    const totalItems = await prisma.signalement.count({ where: whereClause });

    // Fetch paginated reports
    const reports = await prisma.signalement.findMany({
      where: whereClause,
      orderBy: { [sortBy]: sortOrder },
      select: getReportSelect(),
      take: pageSize,
      skip,
    });

    const formattedData = reports.map(formatReportData);

    const pagination = {
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
      currentPage: page,
      pageSize,
    };

    return NextResponse.json(
      {
        message: "Les signalements ont été récupérés avec succès",
        pagination,
        data: formattedData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [GET /api/reports]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

// POST a new report (client only)
export async function POST(req: NextRequest) {
  const session = await auth();

  // Authentication
  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }
  // Authorization (client only)
  if (session.user.role !== UserRole.CLIENT) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN },
      { status: 403 }
    );
  }

  // Parse and validate request body
  const body = await req.json();
  const parsed = reportSchema.safeParse(body);
  if (!parsed.success) {
    return formatValidationErrors(parsed);
  }

  const { objet, text, produitId } = parsed.data;
  const userId = session.user.id;

  try {
    // Check if product exists
    const produit = await prisma.produit.findUnique({
      where: { id: produitId },
    });
    if (!produit) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND },
        { status: 404 }
      );
    }

    // Create the report
    const newReport = await prisma.signalement.create({
      data: {
        objet,
        text,
        produitId,
        clientId: userId,
      },
      select: getReportSelect(),
    });

    const data = formatReportData(newReport);
    return NextResponse.json(
      { message: "Le signalement a été bien enregistré", data },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error [POST /api/reports]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
