import MainHeader from "@/components/layout/Header/MainHeader";
import Footer from "@/components/layout/Footer/Footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <MainHeader />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
