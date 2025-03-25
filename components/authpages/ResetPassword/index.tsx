"use client";

import { useState } from "react";

import RequestResetForm from "@/components/authpages/ResetPassword/RequestResetForm";
import ResetPasswordForm from "@/components/authpages/ResetPassword/ResetPasswordForm";

export default function ResetPassword() {
  const [email, setEmail] = useState<string | null>(null);

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      {email ? (
        <ResetPasswordForm email={email} />
      ) : (
        <RequestResetForm onSuccess={setEmail} />
      )}
    </div>
  );
}
