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
      className={`${labelType === "text" ? styles.submitBtn : "hover:scale-110"} min-h-10 min-w-10 rounded-lg p-2 flex justify-center uppercase text-white disabled:bg-gray-400/10 disabled:pointer-events-none self-center`}
    >
      {/* BUBles anumation on hover: */}
      <span className={styles.circle1}></span>
      <span className={styles.circle2}></span>
      <span className={styles.circle3}></span>
      <span className={styles.circle4}></span>
      <span className={styles.circle5}></span>

      {pending || externalLoading ? (
        <Lineicons icon={Spinner3Duotone} size={20} className="animate-spin" />
      ) : labelType === "icon" ? (
        <Lineicons icon={icon} />
      ) : (
        <span className={styles.text}>{label}</span>
      )}
    </button>
  );
}
