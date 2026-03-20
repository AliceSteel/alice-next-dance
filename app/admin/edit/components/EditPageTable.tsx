"use client";

import FormContainer from "@/components/formElements/FormContainer";
import { SubmitBtn } from "@/components/formElements/SubmitBtn";
import { type ContentDataForEditPage } from "@/types/ContentDataForEditPage";
import { deleteRecord, editContent } from "@/helpers/actions";
import { Lineicons } from "@lineiconshq/react-lineicons";
import { PenToSquareOutlined } from "@lineiconshq/free-icons";
import { useState } from "react";
import FormInput from "@/components/formElements/FormInput";
import TextAreaInput from "@/components/formElements/TextArea";
import ImageInput from "@/components/formElements/ImageInput";

export default function EditPageTable({
  contentTitle,
  content,
}: {
  content: ContentDataForEditPage[keyof ContentDataForEditPage];
  contentTitle: string;
}) {
  const [openId, setOpenId] = useState<number | null>(null);

  const items = Array.isArray(content) ? content : content ? [content] : [];

  return (
    <div className="w-full">
      <div className="flex justify-between border-b border-gray-500 py-3">
        <span className="font-bold">Record Title</span>
        <span className="font-bold">Actions</span>
      </div>
      <div>
        {items.map((item) => {
          const id = (item as { id: number }).id ?? 0;

          const isOpen = openId === id;
          const displayTitle =
            "name" in item
              ? item.name
              : "title" in item
                ? item.title
                : "Untitled";

          return (
            <div key={id} className="border-b border-gray-700/50">
              <div className="flex justify-between items-center px-2 hover:bg-gradient-to-r hover:from-transparent hover:to-white/10 transition-all rounded-md">
                <span>{displayTitle as string}</span>
                <div className="flex gap-5 justify-end">
                  <button
                    onClick={() => setOpenId(isOpen ? null : id)}
                    className="hover:scale-110 p-2"
                  >
                    <Lineicons icon={PenToSquareOutlined} />
                  </button>
                  <FormContainer action={deleteRecord}>
                    <input type="hidden" name="id" value={id} />
                    <input
                      type="hidden"
                      name="contentTitle"
                      value={contentTitle}
                    />
                    <SubmitBtn labelType="icon" actionType="delete" />
                  </FormContainer>
                </div>
              </div>
              {/* edit table is open on edit button click */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <FormContainer
                  action={editContent}
                  border={true}
                  onSuccess={() => setOpenId(null)} // to close the drop down after successful edit, can be removed if you want it to stay open
                >
                  <input type="hidden" name="id" value={id} />
                  <input
                    type="hidden"
                    name="contentTitle"
                    value={contentTitle}
                  />
                  {"slug" in item && (
                    <input
                      type="hidden"
                      name="slug"
                      value={(item as any).slug}
                    />
                  )}
                  {Object.entries(item)
                    .filter(([key]) => key !== "id" && key !== "slug")
                    .map(([key, value]) => (
                      <div key={key} className="flex gap-3 py-1 w-full">
                        <span className="text-gray-400 capitalize w-20">
                          {key}:
                        </span>
                        {key === "image" || key === "imageUrl" ? (
                          <ImageInput placeholder={String(value)} name={key} />
                        ) : value && typeof value === "string" ? (
                          <FormInput
                            placeholder={String(value)}
                            name={key}
                            type="text"
                          />
                        ) : typeof value === "number" ? (
                          <FormInput
                            type="number"
                            name={key}
                            placeholder={String(value)}
                          />
                        ) : (
                          <TextAreaInput
                            name={key}
                            placeholder={
                              Array.isArray(value)
                                ? (value as string[]).join("\n")
                                : JSON.stringify(value)
                            }
                          />
                        )}
                      </div>
                    ))}
                  <SubmitBtn label="Save" actionType="edit" />
                </FormContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
