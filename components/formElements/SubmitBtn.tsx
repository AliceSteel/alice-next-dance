"use client";

import { useFormStatus } from "react-dom";
import Btn from "@/components/formElements/Btn";

export function SubmitBtn({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Btn
      type="submit"
      label={pending ? `${label}...` : label}
      disabled={pending}
      loading={pending}
    />
  );
}
