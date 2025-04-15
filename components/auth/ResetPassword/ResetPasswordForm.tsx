"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { toast } from "sonner";
import FormErrorMessage from "@/components/auth/FormErrorMessage";
import FieldErrorMessage from "@/components/auth/FieldErrorMessage";

const ResetPasswordForm = ({ email }: { email: string }) => {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setFieldErrors({});

    try {
      const res = await fetch("/api/auth/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword: password }),
      });

      const responseJson = await res.json();
      if (!res.ok) {
        setErrorMessage(responseJson.error || "Erreur de réinitialisation.");

        if (responseJson?.data) {
          const errors: Record<string, string> = {};
          responseJson.data.forEach(
            (err: { field: string; message: string }) => {
              errors[err.field] = err.message;
            }
          );
          setFieldErrors(errors);
        }
        return;
      }

      toast("Mot de passe réinitialisé avec succès.");
      router.push("/auth/login");
    } catch {
      setErrorMessage("Erreur réseau. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrez le code de vérification</CardTitle>
        <CardDescription>
          Vérifiez votre e-mail ({email}) et entrez le code reçu ainsi
          qu&apos;un nouveau mot de passe.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid gap-3">
            <Label htmlFor="code">Code de vérification</Label>
            <Input
              id="code"
              type="text"
              placeholder="Code à 6 chiffres"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              disabled={isLoading}
            />
            {fieldErrors.code && (
              <FieldErrorMessage message={fieldErrors.code} />
            )}
          </div>
          <div className="grid gap-3">
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            {fieldErrors.newPassword && (
              <FieldErrorMessage message={fieldErrors.newPassword} />
            )}
          </div>
          <FormErrorMessage message={errorMessage} />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Réinitialisation..." : "Confirmer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordForm;
