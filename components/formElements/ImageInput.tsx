export default function ImageInput({
  placeholder,
  name = "image",
}: {
  placeholder: string;
  name?: string;
}) {
  return (
    <div className="flex gap-1 items-center flex-wrap">
      <input
        name={name}
        id={name}
        type="file"
        accept="image/*"
        className="p-2 px-3 rounded-lg bg-white/15 placeholder:text-white/30 text-white focus-visible:outline-sky-800 focus-visible:outline-2 m-1"
      />
      {placeholder && (
        <span className="text-xs text-gray-400 ml-1">
          Current: <span className="text-gray-300">{placeholder}</span>
        </span>
      )}
    </div>
  );
}
