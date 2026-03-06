"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function SuccessToast({ message }: { message: string }) {
  const router = useRouter();
  const shown = useRef(false);

  useEffect(() => {
    if (shown.current) return;
    shown.current = true;
    toast.success(message);
    router.replace("/admin/edit");
  }, [message, router]);

  return null;
}
