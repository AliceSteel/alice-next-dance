"use client";
import { selectClasses } from "@/store/slices/classes/classesSlice";
import { useSelector } from "react-redux";
import ClassCard from "@/components/classCard/ClassCard";
import { ClassCardType } from "@/types/ClassCard";
import ClassHero from "@/components/classHero/ClassHero";

function ClassesPage() {
  const classes = useSelector(selectClasses);

  const heroData = {
    imageUrl:
      "https://uthhrhkygpwqcytwblma.supabase.co/storage/v1/object/public/images-bucket/1774014993372-black-n-white.jpg",
    title: "DANCE STYLES",
    description:
      "Explore our diverse dance styles. For beginners or experienced dancers, our classes offer something for everyone. Join us and find your rhythm!",
  };
  const gridClasses = [
    "col-start-1 col-span-2 md:col-span-1 row-start-1",
    "col-start-1 md:col-start-2 row-start-2 md:row-start-1",
    "col-star-1 md:col-start-3 row-start-3 md:row-start-1 col-span-2 md:row-span-2",
    "col-start-1 row-start-4 md:row-start-2",
    "col-start-2 row-start-5 md:row-start-3",
  ];

  return (
    <>
      <ClassHero classItem={heroData} />

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
