import AuthFooter from "@/components/layout/Footer/ShortFooter/ShortFooter";
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
