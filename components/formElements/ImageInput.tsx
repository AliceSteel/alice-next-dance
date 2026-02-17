export default function ImageInput({ placeholder }: { placeholder: string }) {
  return (
    <input
      name="image"
      id="image"
      type="file"
      placeholder={placeholder}
      accept="image/*"
      className="p-2 px-3 rounded-lg bg-white/15 placeholder:text-white/30 text-white focus-visible:outline-sky-800 focus-visible:outline-2 m-1"
    />
  );
}
