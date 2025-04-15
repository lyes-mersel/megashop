import AuthFooter from "@/components/layout/auth/Footer";
import MainHeader from "@/components/layout/store/Header";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MainHeader />
      {children}
      <AuthFooter />
    </>
  );
}
