import type { SectionTitleProps } from "./SectionTitleProps";

export default function SectionTitle(props: SectionTitleProps) {
  return (
    <>
      <h5 className="uppercase text-sky-400 w-full text-4xl ">{props.title}</h5>
      <p className="text-sm max-w-1/2">{props.subtitle}</p>
    </>
  );
}
