"use client";
import Image from "next/image";
import PageTitle from "@/components/pageTitle/PageTitle";
import { type Class } from "@/types/ClassDescription";
import { useSelector } from "react-redux";
import { selectClassById } from "@/store/slices/classes/classesSlice";
import renderHighlighted from "@/helpers/renderHighlightedText";
import { useRef } from "react";
import { usePinnedText } from "@/helpers/usePinnedText";
import Button from "@/components/formElements/Btn";
import { Lineicons } from "@lineiconshq/react-lineicons";
import { InstagramOutlined, YoutubeOutlined } from "@lineiconshq/free-icons";

export default function Class({ params }: { params: { classId: string } }) {
  const { classId } = params;
  const classItem = useSelector(selectClassById(classId ?? ""));

  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const isPinned = usePinnedText(descriptionRef, 200);

  if (!classItem) return <p>Class not found</p>;

  const instructor = classItem.instructor;
  const { name, image, bioLines, instagram, youTube } = instructor || {};

  const socialLinks = [
    { href: instagram, icon: InstagramOutlined, key: "instagram" },
    { href: youTube, icon: YoutubeOutlined, key: "youtube" },
  ].filter((s) => s.href);

  return (
    <>
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
            className={
              isPinned
                ? "fixed top-20 z-10"
                : "absolute bottom-40 sm:bottom-20 z-10"
            }
          >
            <PageTitle title={classItem.title} />
          </div>
          <p ref={descriptionRef} className="text-white mt-auto pt-6 z-10">
            {classItem.description}
          </p>
        </div>
      </section>

      <section className="bg-[#222222] ">
        <div className="page-container flex flex-col gap-8 py-8">
          {classItem.text1 && (
            <p className="uppercase text-3xl leading-[105%]">
              {renderHighlighted(classItem.text1)}
            </p>
          )}
          {classItem.text2 && <p className=" mt-4">{classItem.text2}</p>}
        </div>
      </section>
      {instructor && (
        <section className="page-container py-8">
          <h4 className="mb-8">Instructors:</h4>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 flex flex-col justify-between gap-8">
              {" "}
              <ul className="list-none flex flex-col gap-0 leading-[105%]">
                <li className="uppercase text-sky-400 text-3xl mb-2 flex justify-end gap-1">
                  <span className="mr-auto">{name}</span>
                  {socialLinks.map(({ href, icon, key }) => (
                    <a
                      href={href ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:scale-110"
                      key={key}
                    >
                      <Lineicons
                        icon={icon}
                        size={40}
                        className="text-white/50"
                      />
                    </a>
                  ))}
                </li>
                {bioLines &&
                  bioLines.map((line: string, index: number) => (
                    <li key={index} className="mb-2">
                      {line}
                    </li>
                  ))}
              </ul>
              <Button label="Join class" to={`/schedule?filtered=${classId}`} />
            </div>
            <div className="flex-1 mt-auto">
              {" "}
              {image && (
                <Image
                  src={image}
                  alt={name ?? "Instructor image"}
                  width={900}
                  height={900}
                  loading="lazy"
                />
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
