import { LoginForm } from "@/components/form/login-form";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <div className="bg-background flex min-h-svh w-full items-center justify-center md:p-10">
        <div className="w-full max-w-sm">
          <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </>
  );
}
