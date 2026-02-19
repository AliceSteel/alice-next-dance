"use client";

import { SubmitBtn } from "@/components/formElements/SubmitBtn";

export default function EditPageTable({
  content,
}: {
  content: any[] | { title: string };
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
          content.map((item) => (
            <tr key={item.id}>
              <td>{item.name || item.title}</td>
              <td className="flex gap-5 justify-end">
                <SubmitBtn labelType="icon" actionType="edit" />

                <SubmitBtn labelType="icon" actionType="delete" />
              </td>
            </tr>
          ))
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
