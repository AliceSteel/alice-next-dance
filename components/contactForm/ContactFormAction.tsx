import { type ActionFunctionArgs } from "react-router-dom";
import emailjs from "@emailjs/browser";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const {
    name = "",
    email = "",
    message = "",
  } = Object.fromEntries(formData) as {
    name?: string;
    email?: string;
    message?: string;
  };
  console.log("formData", { name, email, message });

  if (name.trim().length <= 1)
    return { ok: false, error: "Name longer than 1 letter is required." };
  if (!email) return { ok: false, error: "Email is required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { ok: false, error: "Valid email is required." };
  if (message.trim().length < 2)
    return {
      ok: false,
      error: "Message longer than 2 characters is required.",
    };

  try {
    const res = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID!,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID!,
      { from_name: name, reply_to: email, message },
      { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY! }
    );
    if (res.status === 200) return { ok: true };
    return { ok: false, error: res.text || "Failed to send" };
  } catch (e) {
    console.error(e);
    return { ok: false, error: "Send error. Please try again later" };
  }
};
