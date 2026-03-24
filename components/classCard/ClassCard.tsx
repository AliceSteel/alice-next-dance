import type { ClassCardType } from "@/types/ClassCard";
import Link from "next/link";
import Image from "next/image";

export default function ClassCard({ classItem }: { classItem: ClassCardType }) {
  return (
    <Link
      href={`/classes/${classItem.id}`}
      key={classItem.id}
      className="relative rounded-lg shadow-lg overflow-hidden hover:text-2xl transition-all duration-300 h-full block"
    >
      <Image
        src={
          typeof classItem.imageUrl === "string"
            ? classItem.imageUrl
            : classItem.imageUrl?.src || ""
        }
        loading="lazy"
        fill
        alt={classItem.title}
        className="h-full object-cover"
      />
      <div className="absolute top-2 right-2">
        <h2 className="uppercase text-white drop-shadow-lg">
          {classItem.title}
        </h2>
      </div>
    </Link>
  );
}
