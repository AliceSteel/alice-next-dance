"use client";
import Image from "next/image";
import { type Class } from "@/types/ClassDescription";
import { useSelector } from "react-redux";
import { selectClassById } from "@/store/slices/classes/classesSlice";
import renderHighlighted from "@/helpers/renderHighlightedText";
import Button from "@/components/formElements/Btn";
import { Lineicons } from "@lineiconshq/react-lineicons";
import { InstagramOutlined, YoutubeOutlined } from "@lineiconshq/free-icons";
import ShareBtn from "@/components/shareBtn/ShareBtn";
import ClassHero from "@/components/classHero/ClassHero";

export default function Class({ params }: { params: { classId: string } }) {
  const { classId } = params;
  const classItem = useSelector(selectClassById(classId ?? ""));

  if (!classItem) return <p>Class not found</p>;

  const instructor = classItem.instructor;
  const { name, image, bioLines, instagram, youTube } = instructor || {};

  const socialLinks = [
    { href: instagram, icon: InstagramOutlined, key: "instagram" },
    { href: youTube, icon: YoutubeOutlined, key: "youtube" },
  ].filter((s) => s.href);

  return (
    <>
      <ClassHero classItem={classItem} />

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
          <div className="flex flex-col lg:flex-row gap-8 relative">
            <div className="flex-1 sticky top-20 h-fit flex flex-col gap-4">
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
              <div className="flex gap-4">
                <Button
                  label="Join class"
                  to={`/schedule?filtered=${classId}`}
                />
                <ShareBtn pageId={classId} name={name ?? ""} />
              </div>
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
