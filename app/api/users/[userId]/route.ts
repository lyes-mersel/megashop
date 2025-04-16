import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { getUserSelect, formatUserData } from "@/lib/helpers/users";
import { auth } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const session = await auth();

  // Authentication Check
  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }
  
  // Check if the user is trying to access their own data
  if (session.user.id !== userId) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN },
      { status: 403 }
    );
  }

  try {
    // Fetch user by ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: getUserSelect(),
    });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: `L'utilisateur avec l'ID ${userId} n'existe pas` },
        { status: 404 }
      );
    }

    // Format the response
    const data = formatUserData(user);

    return NextResponse.json({ message: "OK", data }, { status: 200 });
  } catch (error) {
    console.error("API Error [GET USER BY ID]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  return NextResponse.json(
    { message: `Update user with ID: ${userId}` },
    { status: 200 }
  );
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  return NextResponse.json(
    { message: `Delete user with ID: ${userId}` },
    { status: 200 }
  );
}
