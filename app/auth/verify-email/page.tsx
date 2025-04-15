import { redirect } from "next/navigation";

import getAuth from "@/lib/auth/getAuth";
import VerifyEmail from "@/components/auth/VerifyEmail";

const VerifyEmailPage = async () => {
  const session = await getAuth();

  if (!session) {
    redirect("/auth/login");
  }

  return <VerifyEmail user={session.user} />;
};

export default VerifyEmailPage;
