import AuthFooter from "@/components/layout/store/Footer";
import StoreHeader from "@/components/layout/store/Header";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <StoreHeader />
      <main className="flex min-h-[calc(100dvh-125px)] bg-[#ebedf0] w-full items-center justify-center p-6 md:p-10">
        {children}
      </main>
      <AuthFooter />
    </>
  );
}
