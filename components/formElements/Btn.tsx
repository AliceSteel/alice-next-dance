import Link from "next/link";
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
  //const navigation = useNavigation();
  const internalDisabled = disabled || loading;

  const baseClass =
    `${size === "small" ? "p-2 text-sm" : " py-2 px-4 "} ` +
    `${
      variant === "secondary"
        ? "bg-black/80 border-white/80 border"
        : "bg-blue-600"
    } ` +
    `${hidden ? "hidden" : "inline-flex"} ` +
    `${internalDisabled ? "cursor-not-allowed " : "cursor-pointer "} ` +
    "items-center justify-center  hover:bg-blue-900rounded-2xl " +
    "transition-colors ease-in duration-200 uppercase text-white disabled:bg-gray-400 disabled:pointer-events-none";

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
      {loading && type === "submit" ? (
        <Lineicons
          icon={Spinner3Duotone}
          size={16}
          className="animate-spin mr-2"
        />
      ) : (
        label
      )}
    </button>
  );
}
