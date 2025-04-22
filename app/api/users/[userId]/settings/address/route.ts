import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { updateAddressSchema, formatValidationErrors } from "@/lib/validations";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();
    const { userId } = await params;

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

    const userWithAdresse = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        adresse: {
          select: {
            id: true,
            rue: true,
            ville: true,
            wilaya: true,
            codePostal: true,
          },
        },
      },
    });

    if (!userWithAdresse) {
      return NextResponse.json(
        { error: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    if (!userWithAdresse.adresse) {
      return NextResponse.json(
        { error: "Aucune adresse associée à cet utilisateur." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: userWithAdresse.adresse },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "API Error [GET /api/users/[userId]/settings/adresse]:",
      error
    );
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();
    const { userId } = await params;

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

    const body = await req.json();
    const parsedData = updateAddressSchema.safeParse(body);

    if (!parsedData.success) {
      return formatValidationErrors(parsedData);
    }

    const { rue, ville, wilaya, codePostal } = parsedData.data;

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { adresseId: true },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    let adresse;

    if (currentUser.adresseId) {
      // Adresse already exists -> update it
      adresse = await prisma.adresse.update({
        where: { id: currentUser.adresseId },
        data: { rue, ville, wilaya, codePostal },
      });
    } else {
      // No adresse -> create one and link it to user
      adresse = await prisma.adresse.create({
        data: { rue, ville, wilaya, codePostal },
      });

      await prisma.user.update({
        where: { id: userId },
        data: { adresseId: adresse.id },
      });
    }

    return NextResponse.json(
      {
        message: "Adresse mise à jour avec succès.",
        data: adresse,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "API Error [PUT /api/users/[userId]/settings/adresse]:",
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
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();
    const { userId } = await params;

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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { adresseId: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    if (!user.adresseId) {
      return NextResponse.json(
        { error: "Aucune adresse à supprimer." },
        { status: 404 }
      );
    }

    // Détacher l'adresse du user
    await prisma.user.update({
      where: { id: userId },
      data: { adresseId: null },
    });

    // Supprimer l'adresse
    await prisma.adresse.delete({
      where: { id: user.adresseId },
    });

    return NextResponse.json(
      { message: "Adresse supprimée avec succès." },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "API Error [DELETE /api/users/[userId]/settings/adresse]:",
      error
    );
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
