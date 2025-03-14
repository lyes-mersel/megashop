"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

// UI components
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Components
import FormErrorMessage from "@/components/authpages/FormErrorMessage";
import FieldErrorMessage from "@/components/authpages/FieldErrorMessage";

// Utils
import { cn } from "@/lib/utils";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Handle the form submission
  const handleSubmitForm = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setFieldErrors({});

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const responseJson = await response.json();
      if (!response.ok) {
        setErrorMessage(
          responseJson?.error || "Une erreur est survenue. Veuillez réessayer."
        );
        if (responseJson?.errors) {
          const errors: Record<string, string> = {};
          responseJson.errors.forEach(
            (err: { field: string; message: string }) => {
              errors[err.field] = err.message;
            }
          );
          setFieldErrors(errors);
        }
        return;
      }

      // update the session
      await update();
      toast(responseJson.message || "Connexion réussie.");

      // Valider l'URL de redirection (interne uniquement)
      const urlCallback = searchParams.get("urlCallback");
      const redirectUrl =
        urlCallback?.startsWith("/") && !urlCallback.startsWith("//")
          ? urlCallback
          : "/dashboard";
      router.push(redirectUrl);
      router.refresh();
    } catch {
      setErrorMessage("Erreur réseau. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Connectez-vous à votre compte</CardTitle>
          <CardDescription>
            Entrez votre e-mail ci-dessous pour vous connecter.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitForm}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                {/* email */}
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemple@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
                {fieldErrors.email && (
                  <FieldErrorMessage message={fieldErrors.email} />
                )}
              </div>

              {/* password */}
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm underline-offset-4 hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                {fieldErrors.password && (
                  <FieldErrorMessage message={fieldErrors.password} />
                )}
              </div>

              {/* submit button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>

              <FormErrorMessage message={errorMessage} />
            </div>

            {/* link to login page */}
            <div className="mt-4 text-center text-sm">
              Vous n&apos;avez pas de compte ?{" "}
              <Link
                href="/auth/register"
                className="underline underline-offset-4"
              >
                Inscrivez-vous
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
