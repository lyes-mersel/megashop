import MainHeader from "@/components/layout/Header/MainHeader";
import ShortFooter from "@/components/layout/Footer/ShortFooter";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MainHeader />
      {children}
      <ShortFooter />
    </>
  );
}
