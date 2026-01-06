export type ClassCategory = {
  id: string;
  title: string;
};

export default function ClassFilters({
  categories,
  filterItems,
  selectedId,
}: {
  categories: ClassCategory[] | undefined;
  filterItems: (categoryId: string) => void;
  selectedId?: string | null;
}) {
  return (
    <>
      {categories?.map((category: ClassCategory) => {
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
