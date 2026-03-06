"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function SuccessToast({ message }: { message: string }) {
  const router = useRouter();
  useEffect(() => {
    toast.success(message);
    router.replace("/admin/edit"); // removes ?success= from URL
  }, []);

  return null;
}
