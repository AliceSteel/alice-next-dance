import type { Category } from "@/types/classesTypes";

export default function ClassFilters({
  categories,
  filterItems,
  selectedId,
}: {
  categories: Category[] | undefined;
  filterItems: (categoryId: string | number) => void;
  selectedId?: string | number | null;
}) {
  return (
    <>
      {categories?.map((category: Category) => {
        const isSelected = category.id === selectedId;
        return (
          <li key={category.id}>
            <button
              role="radio"
              aria-checked={isSelected}
              type="button"
              className={
                "uppercase border py-2 px-4 h-full " +
                (isSelected
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-white border-white")
              }
              onClick={() => filterItems(category.id)}
            >
              {category.title}
            </button>
          </li>
        );
      })}
    </>
  );
}
