import CatalogHeader from "@/components/layout/store/CatalogHeader";
import StoreFooter from "@/components/layout/store/Footer";

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <CatalogHeader />
      {children}
      <StoreFooter />
    </>
  );
}
