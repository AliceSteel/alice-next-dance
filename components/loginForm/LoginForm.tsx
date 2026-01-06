/* import FormInput from "@/components/formElements/FormInput";
import Button from "../formElements/Btn";
import { Form } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/user/userSlice";
import { closeModal } from "@/store/slices/modal/modalSlice";
import type { User } from "@/types/User";
 */
export default function LoginForm() {
  /* 
  const [formType, setFormType] = useState<"login" | "register">("login");
  const dispatch = useDispatch();

  const handleMockLogin = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(
      setUser({
        id: "mock-user-1",
        name: "Mock User",
        email: "mock@example.com",
      } as User)
    );
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
        <Form
          autoComplete="off"
          className="flex flex-col justify-between w-full max-w-md text-white/70"
          onSubmit={handleMockLogin}
        >
          <h2 className="text-4xl uppercase text-center">Login</h2>
          <FormInput name="email" type="email" placeholder="Email" required />
          <FormInput
            name="password"
            type="password"
            placeholder="Password"
            required
          />
          <Button label="Login" type="submit" />
          <Button type="button" label="Login as a guest" variant="secondary" />
          <p>
            Don't have an account?{" "}
            <button
              className="cursor-pointer underline-offset-1 underline"
              onClick={() => setFormType("register")}
            >
              Register here
            </button>
          </p>
        </Form>

        <Form
          className="w-1/2 shrink-0 flex flex-col gap-4 px-2 bg-transparent"
          aria-hidden={formType !== "register"}
          onSubmit={handleMockLogin}
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
          <Button label="Create account" type="submit" />
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
        </Form>
      </div>
    </section>
  ); */
  return <div>Login Form Component</div>;
}
