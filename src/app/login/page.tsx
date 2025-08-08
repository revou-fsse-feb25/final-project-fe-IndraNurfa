import { LoginForm } from "@/components/form/login-form";

export default function Page() {
  return (
    <>
      <div className="bg-background flex min-h-svh w-full items-center justify-center md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </>
  );
}
