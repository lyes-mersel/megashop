import Link from "next/link";

export default function InternalServerErrorPage() {
  return (
    <main className="min-h-[100vh] flex flex-col items-center justify-center space-y-5 bg-gray-50 py-12">
      {/* Illustration ou icône */}
      <div className="text-9xl text-gray-300 animate-pulse">
        <span role="img" aria-label="Exploding head">
          💥
        </span>
      </div>

      {/* Titre */}
      <h2 className="text-4xl font-bold text-gray-900">
        Oups ! Erreur interne du serveur
      </h2>

      {/* Message d'erreur */}
      <p className="text-lg text-gray-600 text-center max-w-md">
        Une erreur inattendue s&apos;est produite de notre côté. Nous faisons
        notre possible pour la résoudre.
      </p>

      {/* Bouton pour retourner à l'accueil */}
      <Link
        href="/"
        className="mt-6 px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-300"
      >
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
