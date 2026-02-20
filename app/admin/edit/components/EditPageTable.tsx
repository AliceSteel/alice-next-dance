"use client";

import { SubmitBtn } from "@/components/formElements/SubmitBtn";
import { type ContentDataForEditPage } from "@/types/ContentDataForEditPage";

export default function EditPageTable({
  content,
}: {
  content: ContentDataForEditPage[keyof ContentDataForEditPage];
}) {
  return (
    <table className="table-auto">
      <thead className="border-b border-gray-500">
        <tr>
          <th className="text-left">Record Title</th>
          <th className="text-right">Actions</th>
        </tr>
      </thead>

      <tbody>
        {Array.isArray(content) ? (
          content.map((item) => {
            const displayTitle =
              "name" in item
                ? item.name
                : "title" in item
                  ? item.title
                  : "Untitled";
            return (
              <tr key={item.id}>
                <td>{displayTitle}</td>
                <td className="flex gap-5 justify-end">
                  <SubmitBtn labelType="icon" actionType="edit" />

                  <SubmitBtn labelType="icon" actionType="delete" />
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td>{content?.title as string}</td>
            <td className="flex gap-5 justify-end">
              <SubmitBtn labelType="icon" actionType="edit" />

              <SubmitBtn labelType="icon" actionType="delete" />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
