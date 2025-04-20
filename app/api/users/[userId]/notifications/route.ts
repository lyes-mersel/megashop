// /api/users/[userId]/notifications/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import {
  formatNotificationData,
  getNotificationSelect,
} from "@/lib/helpers/notifications";
import { NotificationType } from "@prisma/client";
import {
  getPaginationParams,
  getSortingNotifsParams,
} from "@/lib/utils/params";

// Fetch All notifications for a user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }

  if (session.user.id !== userId) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN },
      { status: 403 }
    );
  }

  // Extract pagination and sorting
  const { page, pageSize, skip } = getPaginationParams(request);
  const { sortBy, sortOrder } = getSortingNotifsParams(request);

  // Extract filters
  const { searchParams } = new URL(request.url);
  const statut = searchParams.get("statut"); // "lu", "nonlu", or "tous"
  const type = searchParams.get("type"); // Enum NotificationType

  // Build where clause
  const whereClause: Record<string, unknown> = { userId };

  if (statut === "lu") {
    whereClause.estLu = true;
  } else if (statut === "nonlu") {
    whereClause.estLu = false;
  } else if (statut && statut !== "tous") {
    return NextResponse.json(
      { error: 'Paramètre "statut" invalide' },
      { status: 400 }
    );
  }

  if (type) {
    if (Object.values(NotificationType).includes(type as NotificationType)) {
      whereClause.type = type;
    } else {
      return NextResponse.json(
        { error: 'Paramètre "type" invalide' },
        { status: 400 }
      );
    }
  }

  try {
    // Fetch selected notifs & count
    const totalNotifications = await prisma.notification.count({
      where: whereClause,
    });
    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: { [sortBy]: sortOrder },
      select: getNotificationSelect(),
      skip,
      take: pageSize,
    });

    // Format notifs data
    const data = notifications.map(formatNotificationData);

    // Pagination
    const pagination = {
      totalItems: totalNotifications,
      totalPages: Math.ceil(totalNotifications / pageSize),
      currentPage: page,
      pageSize,
    };

    return NextResponse.json(
      {
        message: "Notifications récupérées avec succès",
        pagination,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [GET /api/users/[userId]/notifications]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

// Modify the read status of all notifications for a user
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }

  if (session.user.id !== userId) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { estLu } = body;

  if (typeof estLu !== "boolean") {
    return NextResponse.json(
      { error: "`estLu` doit être un booléen." },
      { status: 400 }
    );
  }

  try {
    const result = await prisma.notification.updateMany({
      where: { userId },
      data: { estLu },
    });

    return NextResponse.json(
      {
        message: `Notifications mises à jour avec succès`,
        count: result.count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "API Error [PATCH /api/users/[userId]/notifications] :",
      error
    );
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

// Delete all notifications for a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }

  if (session.user.id !== userId) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN },
      { status: 403 }
    );
  }

  try {
    // Delete all notifications for the user
    const result = await prisma.notification.deleteMany({
      where: {
        userId,
      },
    });

    return NextResponse.json(
      {
        message: `${result.count} notification(s) supprimée(s) avec succès`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "API Error [DELETE /api/users/[userId]/notifications] :",
      error
    );
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
