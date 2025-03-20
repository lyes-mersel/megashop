import MainHeader from "@/components/layout/Header/MainHeader";
import Footer from "@/components/layout/Footer/MainFooter";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MainHeader />
      {children}
      <Footer />
    </>
  );
}
