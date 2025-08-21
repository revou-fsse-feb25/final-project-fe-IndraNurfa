import { SignupForm } from "../../components/form/signup-form";
export default function page() {
  return (
    <>
      <div className="container mx-auto flex min-h-svh w-full items-center justify-center md:p-10">
        <div className="w-full max-w-sm">
          <SignupForm />
        </div>
      </div>
    </>
  );
}
