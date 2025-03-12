import { jsonResponse, errorHandler } from "@/lib/utils";
import { signOut } from "@/lib/auth";

export async function POST() {
  try {
    await signOut({ redirect: false });

    return jsonResponse({ message: "Logout successful!" }, 200);
  } catch (error: unknown) {
    return errorHandler(error);
  }
}
