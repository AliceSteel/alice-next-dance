"use client";
import { useState } from "react";

export default function TextAreaInput({
  name,
  placeholder,
  required = true,
  rows = 5,
}: {
  name: string;
  placeholder: string;
  required?: boolean;
  rows?: number;
}) {
  const [value, setValue] = useState(placeholder);
  const isDefault = value === placeholder;

  return (
    <textarea
      id={name}
      name={name}
      defaultValue={placeholder}
      required={required}
      rows={rows}
      className={`p-2 px-3 rounded-lg bg-white/15 text-white focus:outline-none focus-visible:outline-2 focus-visible:outline-sky-800 w-full m-1 ${isDefault ? " text-white/30" : " text-white"}`}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
