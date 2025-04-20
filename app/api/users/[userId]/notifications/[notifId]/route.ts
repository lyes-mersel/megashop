// /api/users/[userId]/notifications/[notifId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import {
  formatNotificationData,
  getNotificationSelect,
} from "@/lib/helpers/notifications";

// Fetch a specific notification for a user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; notifId: string }> }
) {
  const { userId, notifId } = await params;
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
    const notification = await prisma.notification.findUnique({
      where: {
        id: notifId,
      },
      select: getNotificationSelect(),
    });

    if (!notification || notification.userId !== userId) {
      return NextResponse.json(
        { error: "Notification introuvable" },
        { status: 404 }
      );
    }

    // Formatting the notification data
    const data = formatNotificationData(notification);

    // Return the response
    return NextResponse.json(
      { message: "Notification récupérée avec succès", data },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "API Error [GET /api/users/[userId]/notifications/[notifId]] :",
      error
    );
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

// Update the read status of a notification
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; notifId: string }> }
) {
  const { userId, notifId } = await params;
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
    const body = await request.json();

    if (typeof body.estLu !== "boolean") {
      return NextResponse.json(
        { error: "`estLu` doit être un booléen" },
        { status: 400 }
      );
    }

    // Check that the notification exists and belongs to the user
    const notification = await prisma.notification.findUnique({
      where: { id: notifId },
      select: { userId: true },
    });

    if (!notification || notification.userId !== userId) {
      return NextResponse.json(
        { error: "Notification introuvable" },
        { status: 404 }
      );
    }

    // Update read status
    await prisma.notification.update({
      where: { id: notifId },
      data: { estLu: body.estLu },
    });

    return NextResponse.json(
      { message: "Statut de lecture mis à jour avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "API Error [PATCH /api/users/[userId]/notifications/[notifId]] :",
      error
    );
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

// Delete a notification
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; notifId: string }> }
) {
  const { userId, notifId } = await params;
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
    // Check that the notification exists and belongs to the user
    const notification = await prisma.notification.findUnique({
      where: { id: notifId },
      select: { userId: true },
    });

    if (!notification || notification.userId !== userId) {
      return NextResponse.json(
        { error: "Notification introuvable" },
        { status: 404 }
      );
    }

    // Delete the notification
    await prisma.notification.delete({
      where: { id: notifId },
    });

    return NextResponse.json(
      { message: "Notification supprimée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "API Error [DELETE /api/users/[userId]/notifications/[notifId]] :",
      error
    );
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
