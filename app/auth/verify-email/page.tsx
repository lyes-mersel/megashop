import { redirect } from "next/navigation";

import getAuth from "@/lib/auth/getAuth";
import VerifyEmail from "@/components/authpages/VerifyEmail";

const VerifyEmailPage = async () => {
  const session = await getAuth();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <main className="flex min-h-[calc(100dvh-170px)] w-full items-center justify-center p-6 md:p-10">
      <VerifyEmail user={session.user} />
    </main>
  );
};

export default VerifyEmailPage;
