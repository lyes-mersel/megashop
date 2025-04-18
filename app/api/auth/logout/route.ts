import { NextResponse } from "next/server";

import { signOut } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/lib/constants/settings";

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
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
