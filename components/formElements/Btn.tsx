import Link from "next/link";
import styles from "./submitBtn.module.css";

import type { MouseEventHandler } from "react";
import { Lineicons } from "@lineiconshq/react-lineicons";
import { Spinner3Duotone } from "@lineiconshq/free-icons";

type ButtonProps = {
  type?: "submit" | "button" | "reset";
  label: string;
  size?: "small" | "default";
  disabled?: boolean;
  hidden?: boolean;
  variant?: "primary" | "secondary";
  to?: string;
  onClick?: MouseEventHandler;
  loading?: boolean;
};

export default function Button({
  size = "default",
  type,
  label,
  disabled,
  hidden,
  variant,
  to,
  onClick,
  loading = false,
}: ButtonProps) {
  const internalDisabled = disabled || loading;

  const baseClass =
    `${size === "small" ? "p-2 text-sm " : " py-2 px-4 "} ` +
    `${variant === "secondary" ? styles.submitBtn : "bg-blue-600 hover:bg-blue-900"} ` +
    `${hidden ? "hidden" : "inline-flex"} ` +
    `${internalDisabled ? "cursor-not-allowed " : "cursor-pointer "} ` +
    "transition-colors ease-in duration-200 disabled:bg-gray-400/10 min-w-10 min-h-10 rounded-lg overflow-hidden p-3 flex justify-center uppercase text-white text-nowrap";

  // if "to" is provided, render a Link styled as a button
  if (to) {
    return (
      <Link href={to} className={baseClass} onClick={onClick}>
        {label}
      </Link>
    );
  }

  return (
    <button
      type={type || "button"}
      disabled={internalDisabled}
      className={baseClass}
      onClick={onClick}
    >
      {/* BUBles animation on hover: */}
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>

      {loading && type === "submit" ? (
        <Lineicons
          icon={Spinner3Duotone}
          size={16}
          className="animate-spin mr-2"
        />
      ) : (
        <span>{label}</span>
      )}
    </button>
  );
}
