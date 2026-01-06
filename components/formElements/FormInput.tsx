export default function FormInput({
  name,
  type,
  placeholder,
  required,
}: {
  name: string;
  type: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      required={required}
      className="p-2 px-3 rounded-lg bg-white/15 placeholder:text-white/30 text-white focus-visible:outline-sky-800 focus-visible:outline-2 m-1"
    />
  );
}
