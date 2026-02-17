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
  return (
    <textarea
      id={name}
      name={name}
      placeholder={placeholder}
      required={required}
      rows={rows}
      className="p-2 px-3 rounded-lg bg-white/15 placeholder:text-white/30 text-white focus:outline-none focus-visible:outline-2 focus-visible:outline-sky-800  m-1"
    />
  );
}
