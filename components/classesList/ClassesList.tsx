import { useState, useMemo } from "react";
import { type ClassesListProps } from "./ClassesListProps";
import { Link } from "react-router-dom";

export default function ClassesList(props: ClassesListProps) {
  const { classes } = props;
  const VISIBLE_COUNT = 3;

  const [pageIndex, setPageIndex] = useState(0);

  const totalPages = useMemo(() => {
    if (!classes || classes.length === 0) return 0;
    return Math.ceil(classes.length / VISIBLE_COUNT);
  }, [classes]);

  const canGoPrev = pageIndex > 0;
  const canGoNext = pageIndex < totalPages - 1;

  const handlePrev = () => {
    if (canGoPrev) setPageIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (canGoNext) setPageIndex((prev) => prev + 1);
  };

  if (!classes || classes.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 overflow-hidden">
      {/* Left arrow */}
      {classes.length > VISIBLE_COUNT && (
        <button
          type="button"
          onClick={handlePrev}
          disabled={!canGoPrev}
          className={`p-2 shadow ${
            canGoPrev ? "cursor-pointer" : "cursor-not-allowed opacity-0"
          }`}
        >
          <span className="block w-10 h-10 border-t-2 border-l-2 border-white rotate-[-45deg]" />
        </button>
      )}

      {/* Slider viewport */}
      <div className="relative flex-1 overflow-hidden">
        {/* Track with all cards */}
        <div
          className="flex gap-4 transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${(pageIndex / totalPages) * 100}%)`,
            width: `${(classes.length / VISIBLE_COUNT) * 100}%`,
          }}
        >
          {classes.map((classItem) => (
            <Link
              to={`/classes/${classItem.id}`}
              key={classItem.id}
              className="relative rounded-lg shadow-lg overflow-hidden"
              style={{ width: `${100 / classes.length}%` }}
            >
              <img
                src={classItem.imageUrl}
                alt={classItem.title}
                className="w-full aspect-square object-cover"
              />
              <div className="absolute top-2 right-4">
                <h2 className="capitalize text-white drop-shadow-lg">
                  {classItem.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Right arrow */}
      {classes.length > VISIBLE_COUNT && (
        <button
          type="button"
          onClick={handleNext}
          disabled={!canGoNext}
          className={`p-2 shadow ${
            canGoNext ? "cursor-pointer" : "cursor-not-allowed opacity-0"
          }`}
        >
          <span className="block w-10 h-10 border-t-2 border-r-2 border-white rotate-[45deg]" />
        </button>
      )}
    </div>
  );
}
