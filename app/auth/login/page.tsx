import { LoginForm } from "@/components/auth/LoginForm";

export default async function Page() {
  return (
    <main className="flex min-h-[calc(100dvh-170px)] w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  );
}
