/* import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons"; */
import Link from "next/link";
import type { MouseEventHandler } from "react";

type ButtonProps = {
  type?: "submit" | "button" | "reset";
  label: string;
  size?: "small" | "default";
  disabled?: boolean;
  hidden?: boolean;
  variant?: "primary" | "secondary";
  to?: string;
  onClick?: MouseEventHandler;
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
}: ButtonProps) {
  //const navigation = useNavigation();
  const internalDisabled = disabled; /* || navigation.state === "submitting"; */

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
      {/*  {navigation.state === "submitting" && type === "submit" ? (
        <span>Submitting...</span>
      ) : (
        label
      )} */}
      {label}
    </button>
  );
}
