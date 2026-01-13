"use client";
import { useState } from "react";
import type { FormEvent } from "react";
import FormInput from "@/components/formElements/FormInput";
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

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });
      const data = (await res.json()) as Result;
      setResult(data);
    } catch {
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
        label={isSubmitting ? "Sending..." : "Send"}
        disabled={isSubmitting || !!result?.ok}
        hidden={!!result?.ok}
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
