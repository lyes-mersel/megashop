// TODO: A ameliorer

import AuthFooter from "@/components/layout/Footer/ShortFooter/ShortFooter";
import MainHeader from "@/components/layout/Header/MainHeader";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <MainHeader />
      <main className="min-h-[calc(100dvh-170px)] flex flex-col items-center justify-center space-y-5">
        <h2>Not Found ( à améliorer )</h2>
        <p>Could not find requested resource</p>
        <Link href="/" className="text-blue-700">
          Return Home
        </Link>
      </main>
      <AuthFooter />
    </>
  );
}
