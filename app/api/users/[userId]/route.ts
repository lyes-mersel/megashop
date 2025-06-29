import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { deleteFromCloudinary } from "@/lib/helpers/cloudinary";
import { getUserSelect, formatUserData } from "@/lib/helpers/users";
import { triggerEmailVerification } from "@/lib/helpers/emailService";
import { formatValidationErrors, updateUserSchema } from "@/lib/validations";

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

    return NextResponse.json(
      { message: "L’utilisateur a été récupéré avec succès", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [GET /api/users/[userId]]:", error);
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
  const { userId } = await params;
  const session = await auth();

  // Authentication Check
  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }

  // Authorization Check
  if (session.user.role !== "ADMIN" && session.user.id !== userId) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN },
      { status: 403 }
    );
  }

  try {
    // Get user info first
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        imagePublicId: true,
        client: {
          select: {
            vendeur: {
              select: {
                produitMarketplace: {
                  select: {
                    produitId: true,
                    produit: {
                      select: {
                        images: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: `L'utilisateur avec l'ID ${userId} n'existe pas.` },
        { status: 404 }
      );
    }

    // Delete profile image from Cloudinary if exists
    if (user.imagePublicId) {
      await deleteFromCloudinary(user.imagePublicId);
    }

    // If the user is a vendor & has products

    // Uncomment the following lines if you want to delete images from Cloudinary
    // Keep it commented for now to avoid accidental deletions
    // const produits = user?.client?.vendeur?.produitMarketplace || [];
    // if (produits.length > 0) {
    //   // Delete all his product images from Cloudinary
    //   await Promise.all(
    //     produits.flatMap((pm) =>
    //       (pm.produit?.images || []).map((img) =>
    //         deleteFromCloudinary(img.imagePublicId)
    //       )
    //     )
    //   );
    //   // Delete all his products from the database
    //   const productIds = produits.map((p) => p.produitId);
    //   await prisma.produit.deleteMany({
    //     where: { id: { in: productIds } },
    //   });
    // }

    // Delete user
    await prisma.user.delete({
      where: { id: userId },
    });

    // Delete the session
    await signOut({ redirect: false });

    return NextResponse.json(
      { message: `L'utilisateur avec l'ID ${userId} a été supprimé.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [DELETE /api/users/[userId]]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();
    const { userId } = await params;

    // Authentication Check
    if (!session) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      );
    }

    // Only allow users to update their own data
    if (session.user.id !== userId) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.FORBIDDEN },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const parsedData = updateUserSchema.safeParse(body);

    if (!parsedData.success) {
      return formatValidationErrors(
        parsedData,
        "Certains champs fournis sont incorrects"
      );
    }

    const { email, nom, prenom, tel, newPassword, currentPassword } =
      parsedData.data;

    // Fetch current user to compare emails
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, password: true },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    // Check if the new email is not already taken
    if (email && email !== currentUser.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return NextResponse.json(
          { error: "Cette adresse e-mail est déjà utilisée." },
          { status: 409 }
        );
      }
    }

    // Verify current password if asked to change the password
    if (newPassword && currentPassword) {
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        currentUser.password
      );
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Mot de passe actuel incorrect." },
          { status: 401 }
        );
      }
    }

    // Hash password if provided
    let hashedPassword: string | undefined = undefined;
    if (newPassword) {
      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    const updateData: Partial<{
      nom: string;
      prenom: string;
      tel: string;
      password: string;
      emailEnAttente: string;
      emailVerifie: boolean;
    }> = {
      nom,
      prenom,
      tel,
      ...(hashedPassword && { password: hashedPassword }),
    };

    // Handle email update safely via emailEnAttente
    if (email && email !== currentUser.email) {
      updateData.emailEnAttente = email;
      await triggerEmailVerification(userId, email, true);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: getUserSelect(),
    });

    // Format the response
    const data = formatUserData(updatedUser);

    return NextResponse.json(
      {
        message:
          email && email !== currentUser.email
            ? "Mise à jour réussie. Veuillez vérifier votre nouvelle adresse e-mail."
            : "Utilisateur mis à jour avec succès",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [PATCH /api/users/[userId]]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
