"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormEvent, useEffect, useState } from "react";
import { User } from "next-auth";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function VerifyEmail({ user }: { user: User }) {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [emailSent, setEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Countdown for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle verification form submission
  const handleSubmitForm = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent duplicate submissions

    setErrorMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const verificationCode = formData.get("verification-code") as string;

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, code: verificationCode }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Une erreur inconnue est survenue.");
      }

      const { message } = await response.json();
      await update({ ...session });
      toast(message || "Vérification réussie");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error verifying email:", error);
      setErrorMessage(
        (error as Error).message || "Erreur réseau. Veuillez réessayer."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle resending the verification code
  const handleResendCode = async () => {
    if (countdown > 0) return; // Prevent multiple requests

    try {
      const response = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      if (!response.ok)
        throw new Error("Impossible d'envoyer l'email. Veuillez réessayer.");

      setEmailSent(true);
      setCountdown(60);
      setErrorMessage(null);
      toast("Un code a été envoyé à votre adresse e-mail.");
    } catch (error) {
      console.error("Error sending verification code:", error);
      setErrorMessage("Impossible d'envoyer l'email. Veuillez réessayer.");
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6 py-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Vérifiez votre adresse e-mail</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {emailSent
            ? `Entrez le code de vérification envoyé à `
            : "Cliquez ci-dessous pour recevoir un code de vérification à "}
          <strong>{user.email}</strong>.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmitForm}>
        <div>
          <Label htmlFor="verification-code">Code de vérification</Label>
          <Input
            id="verification-code"
            name="verification-code"
            type="text"
            placeholder="Entrez le code à 6 chiffres"
            maxLength={6}
            required
            className="mt-2"
            disabled={isSubmitting}
          />
        </div>
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Vérification..." : "Vérifier l'e-mail"}
        </Button>
      </form>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleResendCode}
        disabled={countdown > 0}
      >
        {countdown > 0
          ? `Renvoyer le code (${countdown}s)`
          : emailSent
          ? "Renvoyer le code"
          : "Envoyer le code"}
      </Button>
    </div>
  );
}
