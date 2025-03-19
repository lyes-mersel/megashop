import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[100dvh]">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/" className="text-blue-700">
        Return Home
      </Link>
    </main>
  );
}
