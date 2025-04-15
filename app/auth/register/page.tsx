import { RegisterForm } from "@/components/auth/RegisterForm";

export default async function Page() {
  return (
    <main className="flex min-h-[calc(100dvh-170px)] w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </main>
  );
}
