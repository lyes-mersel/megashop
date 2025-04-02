import { NextResponse } from "next/server";

import { signOut } from "@/lib/auth";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants/settings";

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
      { error: INTERNAL_ERROR_MESSAGE },
      { status: 500 }
    );
  }
}
