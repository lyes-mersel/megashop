import { redirect } from "next/navigation";

import getAuth from "@/lib/auth/getAuth";

export default async function Page() {
  const session = await getAuth();
  if (session) {
    redirect("/dashboard");
  }
  return (
    <main className="flex min-h-[calc(100dvh-170px)]">
      <div className="w-full max-w-sm">Forgot Password</div>
    </main>
  );
}
