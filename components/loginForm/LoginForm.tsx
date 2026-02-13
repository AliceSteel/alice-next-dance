"use client";

import { SignIn } from "@clerk/nextjs";

export default function LoginForm() {
  return (
    <section className="w-full max-w-md relative overflow-hidden">
      <SignIn
        appearance={{
          elements: {
            rootBox: "w-full max-w-full border-0",
            card: "bg-[#272727] text-white p-6 rounded-3xl w-full overflow-hidden",
            socialButtons: "flex flex-col gap-2 bg-white/20 rounded-lg",
            socialButtonsButton:
              "bg-white/20 text-black border border-gray-300 hover:bg-gray-100",
            footer: "!bg-[#272727] border-0", // footer background
            footerText: "text-gray-400", // “Don’t have an account?” text
            footerActionText: "text-sky-400 underline", // “Sign up” link
          },
        }}
        routing="virtual"
      />
    </section>
  );
}
