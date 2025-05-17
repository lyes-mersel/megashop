"use client";

import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

interface RestrictedAccessProps {
  message?: string;
}

const RestrictedAccess = ({ message }: RestrictedAccessProps) => {
  const pathname = usePathname();
  const callbackUrl = encodeURIComponent(pathname || "/");

  return (
    <div className="min-h-[calc(100dvh-125px)] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          🔒 Accès restreint
        </h1>
        <p className="text-gray-700 mt-4">
          {message ||
            "Vous devez être connecté pour accéder à cette ressource. Veuillez vous connecter pour continuer."}
        </p>
        <div className="mt-6 space-y-3">
          {message ? (
            <>
              <button
                className="block w-full bg-gray-900 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-800 transition"
                onClick={() => {
                  signOut({
                    callbackUrl: `/auth/login?callbackUrl=${callbackUrl}`,
                  });
                }}
              >
                Se connecter en tant que client
              </button>
            </>
          ) : (
            <>
              <a
                href={`/auth/login?callbackUrl=${callbackUrl}`}
                className="block w-full bg-gray-900 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-800 transition"
              >
                Se connecter
              </a>

              <a
                href={`/auth/register?callbackUrl=${callbackUrl}`}
                className="block w-full text-gray-900 font-medium py-2 px-4 border border-gray-900 rounded-lg hover:bg-gray-100 transition"
              >
                Créer un compte
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestrictedAccess;
