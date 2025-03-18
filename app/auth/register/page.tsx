import { redirect } from "next/navigation";

import getAuth from "@/lib/auth/getAuth";
import { RegisterForm } from "@/components/authpages/RegisterForm";

export default async function Page() {
  const session = await getAuth();
  if (session) {
    redirect("/dashboard");
  }
  return (
    <main className="flex min-h-[calc(100dvh-170px)] w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </main>
  );
}
