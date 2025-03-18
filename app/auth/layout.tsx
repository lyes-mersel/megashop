import AuthFooter from "@/components/layout/Footer/AuthFooter";
import MainHeader from "@/components/layout/Header/MainHeader";

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
