import DashboardHeader from "@/components/layout/Header/DashboardHeader";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <DashboardHeader />
      <main>{children}</main>
    </>
  );
}
