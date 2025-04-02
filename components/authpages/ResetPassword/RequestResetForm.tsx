"use client";

import { useState } from "react";
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
import FormErrorMessage from "@/components/authpages/FormErrorMessage";

function RequestResetForm({
  onSuccess,
}: {
  onSuccess: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/password/send-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Erreur lors de l'envoi du code.");

      toast("Un code a été envoyé à votre e-mail.");
      onSuccess(email);
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Réinitialiser le mot de passe</CardTitle>
        <CardDescription>
          Entrez votre e-mail pour recevoir un code de réinitialisation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid gap-3">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="exemple@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <FormErrorMessage message={errorMessage} />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Envoi en cours..." : "Envoyer le code"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default RequestResetForm;
