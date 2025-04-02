"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormErrorMessage from "@/components/authpages/FormErrorMessage";

interface VerifyEmailProps {
  user: User;
}

export default function VerifyEmail({ user }: VerifyEmailProps) {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const verificationCode = formData.get("verification-code") as string;

    try {
      const response = await fetch("/api/auth/email/verify", {
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

  const handleResendCode = async () => {
    if (countdown > 0) return;

    try {
      const response = await fetch("/api/auth/email/send-verification-code", {
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
    <Card>
      <CardHeader>
        <CardTitle>Vérifiez votre adresse e-mail</CardTitle>
        <CardDescription>
          {emailSent
            ? `Entrez le code de vérification envoyé à `
            : "Cliquez ci-dessous pour recevoir un code de vérification à "}
          <strong>{user.email}</strong>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitForm} className="flex flex-col gap-6">
          <div className="grid gap-3">
            <Label htmlFor="verification-code">Code de vérification</Label>
            <Input
              id="verification-code"
              name="verification-code"
              type="text"
              placeholder="Entrez le code à 6 chiffres"
              maxLength={6}
              required
              disabled={isSubmitting}
            />
          </div>
          <FormErrorMessage message={errorMessage} />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Vérification..." : "Vérifier l'e-mail"}
          </Button>
        </form>

        <Button
          type="button"
          variant="outline"
          className="w-full mt-4"
          onClick={handleResendCode}
          disabled={countdown > 0}
        >
          {countdown > 0
            ? `Renvoyer le code (${countdown}s)`
            : emailSent
            ? "Renvoyer le code"
            : "Envoyer le code"}
        </Button>
      </CardContent>
    </Card>
  );
}
