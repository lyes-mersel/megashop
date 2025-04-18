import StoreHeader from "@/components/layout/store/Header";
import AuthFooter from "@/components/layout/store/Footer";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <StoreHeader />
      {children}
      <AuthFooter />
    </>
  );
}
