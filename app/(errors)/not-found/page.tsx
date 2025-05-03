import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <main className="min-h-[100vh] flex flex-col items-center justify-center space-y-5 bg-gray-50 py-12">
        {/* Illustration ou icône */}
        <div className="text-9xl text-gray-300 animate-bounce">
          <span role="img" aria-label="Sad face">
            😞
          </span>
        </div>

        {/* Titre */}
        <h2 className="text-4xl font-bold text-gray-900">
          Oups ! Page non trouvée
        </h2>

        {/* Message d'erreur */}
        <p className="text-lg text-gray-600">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>

        {/* Bouton pour retourner à l'accueil */}
        <Link
          href="/"
          className="mt-6 px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-300"
        >
          Retour à l&apos;accueil
        </Link>
      </main>
    </>
  );
}
