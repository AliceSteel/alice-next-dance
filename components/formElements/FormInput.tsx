"use client";
import { useState } from "react";

export default function FormInput({
  name,
  type,
  placeholder,
  required = true,
}: {
  name: string;
  type: string;
  placeholder: string;
  required?: boolean;
}) {
  const [value, setValue] = useState(placeholder);
  const isDefault = value === placeholder;

  return (
    <input
      id={name}
      type={type}
      name={name}
      defaultValue={placeholder}
      onChange={(e) => setValue(e.target.value)}
      required={required}
      className={`p-2 px-3 rounded-lg bg-white/15 text-white focus:outline-none focus-visible:outline-2 focus-visible:outline-sky-800 w-full m-1 ${
        isDefault ? "text-white/30" : "text-white"
      }`}
    />
  );
}
