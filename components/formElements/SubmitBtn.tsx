"use client";
import { Lineicons } from "@lineiconshq/react-lineicons";
import {
  PenToSquareOutlined,
  Spinner3Duotone,
  FileXmarkOutlined,
} from "@lineiconshq/free-icons";
import { useFormStatus } from "react-dom";

export function SubmitBtn({
  labelType = "text",
  actionType,
  label,
}: {
  labelType?: "text" | "icon";
  label?: string;
  actionType?: "edit" | "delete";
}) {
  const { pending } = useFormStatus();
  const icon = actionType === "edit" ? PenToSquareOutlined : FileXmarkOutlined;
  return (
    <button
      type="submit"
      disabled={pending}
      className="py-2 px-4 min-h-10 bg-blue-600 inline-flex  items-center justify-center  hover:bg-blue-900 rounded-2xl transition-colors ease-in duration-200 uppercase text-white disabled:bg-gray-400 disabled:pointer-events-none"
    >
      {pending ? (
        <Lineicons
          icon={Spinner3Duotone}
          size={16}
          className="animate-spin mr-2"
        />
      ) : labelType === "icon" ? (
        <Lineicons icon={icon} />
      ) : (
        label
      )}
    </button>
  );
}
