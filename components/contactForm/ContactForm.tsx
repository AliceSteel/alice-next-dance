"use client";
import { useState } from "react";
import type { FormEvent } from "react";
import FormInput from "@/components/formElements/FormInput";
import emailjs from "@emailjs/browser";
import Button from "@/components/formElements/Btn";

type Result = {
  ok: boolean;
  error?: string;
};
export default function ContactForm() {
  const [result, setResult] = useState<Result | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") || "").toString();
    const email = (formData.get("email") || "").toString();
    const message = (formData.get("message") || "").toString();

    // (Optional) same validations as before:
    if (name.trim().length <= 1) {
      setResult({ ok: false, error: "Name longer than 1 letter is required." });
      setIsSubmitting(false);
      return;
    }
    if (!email) {
      setResult({ ok: false, error: "Email is required." });
      setIsSubmitting(false);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setResult({ ok: false, error: "Valid email is required." });
      setIsSubmitting(false);
      return;
    }
    if (message.trim().length < 2) {
      setResult({
        ok: false,
        error: "Message longer than 2 characters is required.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        { from_name: name, reply_to: email, message },
        { publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY! },
      );

      if (res.status === 200) {
        setResult({ ok: true });
      } else {
        setResult({
          ok: false,
          error: res.text || "Failed to send",
        });
      }
    } catch (e) {
      console.error(e);
      setResult({ ok: false, error: "Send error. Please try again later" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-md"
    >
      <h2 className="text-4xl uppercase text-center">Any Questions?</h2>
      <FormInput name="name" type="text" placeholder="Name" required />
      <FormInput type="email" name="email" placeholder="Email" required />
      <textarea
        name="message"
        placeholder="Message"
        rows={4}
        required
        className="p-2 bg-white/10"
      ></textarea>

      {result?.error && <p className="text-red-500">{result.error}</p>}
      {result?.ok && <p className="text-blue-600">Message successfully sent</p>}
      <Button
        label="Send"
        disabled={!!result?.ok}
        hidden={!!result?.ok}
        loading={isSubmitting}
        type="submit"
      />
    </form>
  );
}
/*  const result = useActionData() as { ok: boolean; error?: string } | undefined;
  const { state } = useNavigation();
  const isSubmitting: boolean = state === "submitting";

  return (
    <Form method="POST" className="flex flex-col gap-4 w-full max-w-md">
      <h2 className="text-4xl uppercase text-center">Any Questions?</h2>
      <FormInput name="name" type="text" placeholder="Name" required />
      <FormInput type="email" name="email" placeholder="Email" required />
      <textarea
        name="message"
        placeholder="Message"
        rows={4}
        required
        className="p-2 bg-white/10"
      ></textarea>

      {result?.error && <p className="text-red-500">{result.error}</p>}
      {result?.ok && <p className="text-blue-600">Message successfully sent</p>}

      <Button
        label={isSubmitting ? "Sending..." : "Send"}
        disabled={isSubmitting || result?.ok}
        hidden={result?.ok}
        type="submit"
      />
    </Form>
  ); */
