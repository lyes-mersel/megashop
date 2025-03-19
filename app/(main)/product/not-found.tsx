// TODO: A ameliorer

import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <main className="min-h-[calc(100dvh-600px)] flex flex-col items-center justify-center space-y-5">
        <h2>Not Found ( à améliorer )</h2>
        <p>The product requested doesn&apos;t exist !</p>
        <Link href="/" className="text-blue-700">
          Return Home
        </Link>
      </main>
    </>
  );
}
