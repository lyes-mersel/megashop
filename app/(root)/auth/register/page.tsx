import { redirect } from "next/navigation";

import getAuth from "@/lib/getAuth";
import { RegisterForm } from "@/components/AuthForms/RegisterForm";

export default async function Page() {
  const session = await getAuth();
  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  );
}
