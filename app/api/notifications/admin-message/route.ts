import { NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { z } from "zod";
import { NotificationType, UserRole } from "@prisma/client";
import { auth } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/lib/constants/settings";

const notificationSchema = z.object({
  userId: z.string(),
  text: z.string().min(1).max(1000),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      );
    }

    // Check if the user is an admin
    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.FORBIDDEN },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedData = notificationSchema.parse(body);

    // Check if the target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: validatedData.userId },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "Target user not found" },
        { status: 404 }
      );
    }

    // Create the notification
    const notification = await prisma.notification.create({
      data: {
        userId: validatedData.userId,
        text: validatedData.text,
        objet: "Message de l'administrateur",
        type: NotificationType.MESSAGE,
      },
    });

    return NextResponse.json({
      message: "La notification a été envoyée avec succès",
      data: notification,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
