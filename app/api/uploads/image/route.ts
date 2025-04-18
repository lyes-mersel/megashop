import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { ALLOWED_FOLDERS, ERROR_MESSAGES } from "@/lib/constants/settings";
import { uploadToCloudinary } from "@/lib/helpers/cloudinary";
import { UserRole } from "@prisma/client";

export async function POST(request: NextRequest) {
  const session = await auth();
  // Authentication Check
  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }
  // Role Check
  if (session.user.role !== UserRole.ADMIN) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN },
      { status: 403 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string | null;

    // Validate file
    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier trouvé" },
        { status: 400 }
      );
    }

    // Validate folder
    if (!folder || !ALLOWED_FOLDERS.includes(folder)) {
      return NextResponse.json(
        { error: "Nom de dossier invalide" },
        { status: 400 }
      );
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(file, folder);

    // Return response
    return NextResponse.json(
      {
        message: "Image téléversée avec succès",
        data: { publicId: result.public_id },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
