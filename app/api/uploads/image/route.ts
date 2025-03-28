import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/lib/auth";

// Liste des dossiers autorisés
const ALLOWED_FOLDERS = ["products", "profiles"];

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  [key: string]: unknown;
}

export async function POST(request: NextRequest) {
  // Authentication Check
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
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
        { erreur: "Nom de dossier invalide" },
        { status: 400 }
      );
    }

    // Convert file to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: `megashop/${folder}` },
          (error, result) => {
            if (error) {
              console.error("Cloudinary Upload Error:", error);
              reject(error);
            } else {
              resolve(result as CloudinaryUploadResult);
            }
          }
        );
        uploadStream.end(buffer);
      }
    );

    // Return response
    return NextResponse.json({ publicId: result.public_id }, { status: 200 });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      { error: "Échec du téléversement de l'image" },
      { status: 500 }
    );
  }
}
