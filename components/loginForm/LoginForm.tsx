"use client";

import { useState } from "react";
import { createUser } from "@/actions/userActions";
import FormInput from "@/components/formElements/FormInput";
import Button from "@/components/formElements/Btn";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/user/userSlice";
import { closeModal } from "@/store/slices/modal/modalSlice";
import type { User } from "@/types/User";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formType, setFormType] = useState<"login" | "register">("login");
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    // call the server action
    const result = await createUser(formData);

    if (!result?.ok) {
      setError(result?.error ?? "Login failed");
      setIsSubmitting(false);
      return;
    }
    dispatch(
      setUser({
        id: formData.get("email")?.toString() ?? "guest",
        name: formData.get("name")?.toString() ?? "Mock User",
        email: formData.get("email")?.toString() ?? "mock@example.com",
      } as User),
    );
    setIsSubmitting(false);
    dispatch(closeModal());
  };

  return (
    <section className="w-full max-w-md relative overflow-hidden">
      <div
        className={[
          "flex w-[200%] transform-gpu",
          "motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-in-out",
          formType === "register" ? "-translate-x-1/2" : "translate-x-0",
        ].join(" ")}
      >
        <form
          autoComplete="off"
          className="flex flex-col justify-between w-full max-w-md text-white/70"
          onSubmit={handleLogin}
        >
          <h2 className="text-4xl uppercase text-center">Login</h2>

          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

          <FormInput name="email" type="email" placeholder="Email" required />
          <FormInput
            name="password"
            type="password"
            placeholder="Password"
            required
          />
          <Button label="Login" type="submit" loading={isSubmitting} />
          <Button type="button" label="Login as a guest" variant="secondary" />
          <p>
            Don&apos;t have an account?{" "}
            <button
              className="cursor-pointer underline-offset-1 underline"
              onClick={() => setFormType("register")}
            >
              Register here
            </button>
          </p>
        </form>
        {/* REGISTER FORM: */}
        <form
          className="w-1/2 shrink-0 flex flex-col gap-4 px-2 bg-transparent"
          aria-hidden={formType !== "register"}
          onSubmit={handleLogin}
        >
          <h2 className="text-4xl uppercase text-center">Register</h2>
          <FormInput name="name" type="text" placeholder="Full name" required />
          <FormInput name="email" type="email" placeholder="Email" required />
          <FormInput
            name="password"
            type="password"
            placeholder="Password"
            required
          />
          <FormInput
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            required
          />
          <Button label="Create account" type="submit" loading={isSubmitting} />
          <p className="text-sm">
            Already have an account?{" "}
            <button
              type="button"
              className="cursor-pointer underline underline-offset-2"
              onClick={() => setFormType("login")}
            >
              Back to login
            </button>
          </p>
        </form>
      </div>
    </section>
  );
}
