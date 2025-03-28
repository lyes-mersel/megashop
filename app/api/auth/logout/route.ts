import { signOut } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await signOut({ redirect: false });

    return NextResponse.json(
      { message: "Logout successful!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error : ", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Veuillez réessayer plus tard !" },
      { status: 500 }
    );
  }
}
