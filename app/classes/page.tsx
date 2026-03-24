"use client";
import { selectClasses } from "@/store/slices/classes/classesSlice";
import PageTitle from "@/components/pageTitle/PageTitle";
import Image from "next/image";
import { usePinnedText } from "@/helpers/usePinnedText";
import { useRef } from "react";
import { useSelector } from "react-redux";
import ClassCard from "@/components/classCard/ClassCard";
import { ClassCardType } from "@/types/ClassCard";

function ClassesPage() {
  const classes = useSelector(selectClasses);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const isPinned = usePinnedText(descriptionRef, 200);

  const gridClasses = [
    "col-start-1 col-span-2 md:col-span-1 row-start-1",
    "col-start-1 md:col-start-2 row-start-2 md:row-start-1",
    "col-star-1 md:col-start-3 row-start-3 md:row-start-1 col-span-2 md:row-span-2",
    "col-start-1 row-start-4 md:row-start-2",
    "col-start-2 row-start-5 md:row-start-3",
  ];

  return (
    <>
      <section className="relative w-full h-screen">
        <Image
          src="https://uthhrhkygpwqcytwblma.supabase.co/storage/v1/object/public/images-bucket/1774014993372-black-n-white.jpg"
          alt="Classes background"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="pt-40 page-container pb-6 h-full flex flex-col">
          <div
            className={
              isPinned
                ? "fixed top-20 z-10"
                : "absolute bottom-40 sm:bottom-20 z-10"
            }
          >
            <PageTitle title="DANCE STYLES" />
          </div>
          <p ref={descriptionRef} className="text-white mt-auto pt-6 z-10">
            Explore our diverse dance styles. Whether you're a beginner or an
            experienced dancer, our classes offer something for everyone. Join
            us and find your rhythm!
          </p>
        </div>
      </section>

      <section className="page-container py-8 bg-[#222222] ">
        <div className="grid grid-cols-2 md:grid-cols-4 grid-flow-row md:grid-rows-3 gap-1 max-h-screen">
          {classes.map((classItem: ClassCardType, index: number) => (
            <div
              key={classItem.id}
              className={`${gridClasses[index] ?? ""} min-h-[30vh]`}
            >
              <ClassCard classItem={classItem} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default ClassesPage;
