// /api/users/[userId]/settings/vendor-status/route.ts
// This route is used to handle the vendor status of a user.
// It allows a user to become a vendor by providing their shop name, bank name, and RIB.

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import {
  becomeVendorSchema,
  formatValidationErrors,
  updateVendorSchema,
} from "@/lib/validations";
import { UserRole } from "@prisma/client";

export async function GET(
  _request: NextRequest,
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
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        client: {
          select: {
            vendeur: {
              select: {
                nomBoutique: true,
                description: true,
                nomBanque: true,
                rib: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.client?.vendeur) {
      return NextResponse.json(
        { error: "Vous n'êtes pas encore vendeur." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Données du vendeur récupérées avec succès",
        data: user.client.vendeur,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "API Error [GET /api/users/[userId]/settings/vendor-status] :",
      error
    );
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

export async function POST(
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
    const body = await request.json();
    const parsed = becomeVendorSchema.safeParse(body);

    if (!parsed.success) {
      return formatValidationErrors(parsed);
    }

    const { nomBoutique, description, nomBanque, rib } = parsed.data;

    // Check user exists and is a client
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        client: {
          select: {
            vendeur: true,
          },
        },
      },
    });

    if (!user || !user.client) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé ou non client" },
        { status: 404 }
      );
    }

    // Check if user is already a vendor
    if (user.client.vendeur) {
      return NextResponse.json(
        { error: "Vous êtes déjà vendeur" },
        { status: 400 }
      );
    }

    // Create Vendeur and update User role
    await prisma.user.update({
      where: { id: userId },
      data: {
        role: UserRole.VENDEUR,
        client: {
          update: {
            vendeur: {
              create: {
                nomBoutique,
                description,
                nomBanque,
                rib,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Statut vendeur attribué avec succès" },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "API Error [POST /api/users/[userId]/settings/vendor-status] :",
      error
    );
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

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

  try {
    const body = await request.json();
    const parsed = updateVendorSchema.safeParse(body);

    if (!parsed.success) {
      return formatValidationErrors(parsed);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        client: {
          select: {
            vendeur: true,
          },
        },
      },
    });

    if (!user || !user.client?.vendeur) {
      return NextResponse.json(
        { error: "Vous n'êtes pas encore vendeur." },
        { status: 404 }
      );
    }

    const updatedVendor = await prisma.vendeur.update({
      where: { id: userId },
      data: parsed.data,
      select: {
        nomBoutique: true,
        description: true,
        nomBanque: true,
        rib: true,
      },
    });

    if (!updatedVendor) {
      return NextResponse.json(
        { error: "Erreur lors de la mise à jour du profil vendeur" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Profil vendeur mis à jour avec succès",
        data: updatedVendor,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "API Error [PATCH /api/users/[userId]/settings/vendor-status] :",
      error
    );
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
