type PageTitleProps = {
  title: string;
};
export default function PageTitle(props: PageTitleProps) {
  return (
    <h1 className="font-special text-[12vw] md:text-[10vw] whitespace-nowrap leading-[0.8] text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.7)]">
      {props.title.toLowerCase()}
    </h1>
  );
}
