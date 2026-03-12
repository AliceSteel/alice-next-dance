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
  return (
    <input
      id={name}
      type={type}
      name={name}
      placeholder={placeholder}
      required={required}
      className="p-2 px-3 rounded-lg bg-white/15 placeholder:text-white/30 text-white focus:outline-none focus-visible:outline-2 focus-visible:outline-sky-800 w-full m-1"
    />
  );
}
