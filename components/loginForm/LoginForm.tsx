"use client";

import { SignIn } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function LoginForm() {
  const pathname = usePathname();

  return (
    <section className="w-full max-w-md relative overflow-hidden">
      <SignIn
        fallbackRedirectUrl={pathname}
        appearance={{
          elements: {
            rootBox: "w-full max-w-full border-0",
            cardBox:
              "w-full bg-[#272727] text-white rounded-3xl overflow-hidden ",
            card: "bg-transparent px-4 py-5 sm:p-8",
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
