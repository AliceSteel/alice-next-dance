"use client";
import styles from "./submitBtn.module.css";
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
  externalLoading = false,
}: {
  labelType?: "text" | "icon";
  label?: string;
  actionType?: "edit" | "delete";
  externalLoading?: boolean;
}) {
  const { pending } = useFormStatus();
  //const pending = true;

  const icon = actionType === "edit" ? PenToSquareOutlined : FileXmarkOutlined;
  return (
    <button
      type="submit"
      disabled={pending || externalLoading}
      className={`${labelType === "text" ? styles.submitBtn : "hover:scale-110"} mx-auto disabled:bg-gray-400/10 disabled:pointer-events-none min-w-10 min-h-10 rounded-lg overflow-hidden p-3 flex justify-center uppercase text-white text-nowrap`}
    >
      {/* BUBles animation on hover: */}
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>

      {pending || externalLoading ? (
        <Lineicons icon={Spinner3Duotone} size={20} className="animate-spin" />
      ) : labelType === "icon" ? (
        <Lineicons icon={icon} />
      ) : (
        <span>{label}</span>
      )}
    </button>
  );
}
