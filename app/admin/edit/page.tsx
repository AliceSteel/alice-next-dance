import { fetchAdminContentToEdit } from "@/helpers/actions";
import EditPageTable from "./components/EditPageTable";
import type { ContentDataForEditPage } from "@/types/ContentDataForEditPage";
import SuccessToast from "./components/SuccessToast";
export default async function EditPage({
  searchParams,
}: {
  searchParams: { success?: string };
}) {
  const content = await fetchAdminContentToEdit();
  const { success } = searchParams;
  const successMessages: Record<string, string> = {
    productcreated: "Product created successfully!",
    instructorcreated: "Instructor created successfully!",
    recorddeleted: "Record deleted successfully!",
  };
  const successMessage = success ? successMessages[success] : null;

  const titles = Object.keys(content as ContentDataForEditPage);
  const sections = titles.map((title: string) => {
    return {
      key: title,
      label: (title.charAt(0).toUpperCase() + title.slice(1)).replace(
        /([a-z])([A-Z])/g,
        "$1 $2",
      ),
    };
  });

  return (
    <section className="page-container py-8 flex flex-col gap-10">
      {successMessage && <SuccessToast message={successMessage} />}
      {sections.map(({ key, label }) => (
        <div
          key={key}
          className="flex flex-col gap-2  max-w-[700px] w-full mx-auto"
        >
          <h1 className="text-xl text-center">Edit Content for: {label}</h1>
          <EditPageTable
            content={content[key as keyof ContentDataForEditPage]}
            contentTitle={key}
          />
        </div>
      ))}
    </section>
  );
}
