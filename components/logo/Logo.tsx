import Link from "next/link";

function Logo({ title }: { title?: string }) {
  const titleText = (title ?? "Alice Studio").trim();
  const [firstWord, ...restWords] = titleText.split(/\s+/);
  const firstLetter = firstWord.charAt(0);
  const tail = restWords.join(" ");

  return (
    <Link
      href="/"
      className="text-xl uppercase h-full font-semibold flex justify-center items-center rounded-lg overflow-hidden transition-all duration-500 ease-in-out backdrop-blur-sm pl-6 md:pl-0"
      title="Home"
    >
      {/* Mobile/tablet: static FirstLetter.Tail (no animation) */}
      <span className="md:hidden">
        <span className="inline-block">{firstLetter}</span>
        <span aria-hidden="true" className="inline-block">
          .
        </span>
        <span className="inline-block">{tail}</span>
      </span>

      {/* Desktop (md+): animated brand */}
      <span className="hidden md:flex items-center">
        <span
          className="
        inline-block overflow-hidden whitespace-nowrap
        md:transition-[width] md:duration-500 md:ease-in
        md:w-[4.25rem]
        md:group-[.scrolled]:w-[0.875rem]
        md:group-[.scrolled]:font-bold
        md:group-[.scrolled]:opacity-50
      "
        >
          {firstWord}
        </span>
        <span
          aria-hidden="true"
          className="
        inline-block
        md:transition-opacity md:duration-300 md:ease-in-out
        md:opacity-0 md:delay-0
        md:group-[.scrolled]:opacity-50 md:group-[.scrolled]:delay-150
      "
        >
          .
        </span>
        <span className="inline-block md:group-[.scrolled]:opacity-50">
          {tail}
        </span>
      </span>
    </Link>
  );
}

export default Logo;
