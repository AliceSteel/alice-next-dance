import Image, { StaticImageData } from "next/image";
import PageTitle from "@/components/pageTitle/PageTitle";
import { useRef } from "react";
import { usePinnedText } from "@/helpers/usePinnedText";

export default function ClassHero({
  classItem,
}: {
  classItem: {
    title: string;
    description?: string;
    imageUrl: string | StaticImageData;
  };
}) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const { isPinned, botOff } = usePinnedText(titleRef, descriptionRef, 80);

  return (
    <section className="relative w-full h-screen">
      <Image
        src={classItem.imageUrl}
        alt={classItem.title}
        fill
        style={{ objectFit: "cover" }}
        priority
      />

      <div className="pt-40 page-container pb-6 h-full flex flex-col">
        <div
          ref={titleRef}
          className={isPinned ? "fixed top-20 z-10" : "absolute z-10"}
          style={!isPinned ? { bottom: `${botOff}px` } : undefined}
        >
          <PageTitle title={classItem.title} />
        </div>
        <p ref={descriptionRef} className="text-white mt-auto pt-6 z-10">
          {classItem.description}
        </p>
      </div>
    </section>
  );
}
