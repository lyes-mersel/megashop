import MainHeader from "@/components/layout/store/Header";
import Footer from "@/components/layout/store/Footer";

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
