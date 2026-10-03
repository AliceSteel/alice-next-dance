"use client";
import Image from "next/image";
import AnimatedRings from "@/components/animatedRings/AnimatedRings";
import backgroundImage from "@/public/images/ballet-blurred.jpg";
import { aboutUsContent } from "@/data/aboutUsData";
import SectionTitle from "@/components/sectionTitle/SectionTitle";
import ClassesSlider from "@/components/classesList/ClassesSlider";
import renderHighlighted from "@/helpers/renderHighlightedText";
import { useSelector } from "react-redux";
import { selectClasses } from "@/store/slices/classes/classesSlice";

export default function About() {
  const classes = useSelector(selectClasses);
  return (
    <div className="page-container pt-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* TEXT SECTION */}
        <div className="flex flex-col md:flex-row md:gap-8">
          <Image
            src={backgroundImage}
            loading="lazy"
            width={500}
            alt="Dancing girl"
            className="w-full max-h-[50vh] h-auto object-cover object-left-top md:overflow-hidden"
          />
        </div>

        <div className="relative md:col-start-2 md:col-span-2">
          <p className="text-3xl md:text-4xl uppercase text-white mb-2">
            {renderHighlighted(aboutUsContent.paragraph1)}
          </p>
          <p className="text-3xl md:text-4xl uppercase relative md:right-42 mb-2">
            {renderHighlighted(aboutUsContent.paragraph2)}
          </p>
          <p className="text-sm md:w-1/2">
            {renderHighlighted(aboutUsContent.paragraph3)}
          </p>
        </div>

        {/* NUMBERS SECTION */}
        <div className="md:col-start-2 md:col-span-2 mt-10 lg:mt-0">
          <SectionTitle
            title={aboutUsContent.numbers.title}
            subtitle={aboutUsContent.numbers.subtitle}
          />
        </div>
        <div className="my-8 col-span-full">
          <AnimatedRings stats={aboutUsContent.numbers.stats} />
        </div>

        {/* CLASSES LIST */}
        <div className="md:col-start-2 md:col-span-2 mt-28">
          <SectionTitle
            title={aboutUsContent.classesSection.title}
            subtitle={aboutUsContent.classesSection.subtitle}
          />
        </div>
        <div className="col-span-full mt-8 mb-28">
          <ClassesSlider classes={classes} />
        </div>
      </div>
    </div>
  );
}
