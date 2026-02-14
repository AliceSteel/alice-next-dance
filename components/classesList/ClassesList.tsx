import { useState, useMemo, useEffect } from "react";
import type { ClassesListProps, ClassCard } from "./ClassesListProps";
import Link from "next/link";
import Image from "next/image";
import { Lineicons } from "@lineiconshq/react-lineicons";
import { ArrowRightOutlined } from "@lineiconshq/free-icons";

export default function ClassesList(props: ClassesListProps) {
  const { classes } = props;
  const VISIBLE_COUNT_DESKTOP = 3;
  const VISIBLE_COUNT_MOBILE = 1.5;

  const [isMobile, setIsMobile] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
    }
  }, []);
  const VISIBLE_COUNT = isMobile ? VISIBLE_COUNT_MOBILE : VISIBLE_COUNT_DESKTOP;

  const [pageIndex, setPageIndex] = useState(0);

  const totalPages = useMemo(() => {
    if (!classes || classes.length === 0) return 0;

    return Math.ceil(classes.length / VISIBLE_COUNT);
  }, [classes, VISIBLE_COUNT]);

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
  // Touch handling for mobile swipe

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX == null) return;
    const diff = e.changedTouches[0].clientX - touchStartX;

    const SWIPE_THRESHOLD = 50; // px

    if (diff > SWIPE_THRESHOLD && canGoPrev) {
      handlePrev(); // swipe right → previous
    } else if (diff < -SWIPE_THRESHOLD && canGoNext) {
      handleNext(); // swipe left → next
    }

    setTouchStartX(null);
  };

  return (
    <div>
      {!isMobile && (
        <div className="flex justify-between">
          {classes.length > VISIBLE_COUNT && (
            /* Left arrow */
            <Lineicons
              icon={ArrowRightOutlined}
              size={64}
              onClick={handlePrev}
              className={`text-white/80 hover:text-white/100 transition-opacity duration-300 -ml-2 ${
                canGoPrev ? "cursor-pointer" : "cursor-not-allowed opacity-0"
              } rotate-180`}
            />
          )}
          {/* Right arrow */}
          {classes.length > VISIBLE_COUNT && (
            <Lineicons
              icon={ArrowRightOutlined}
              size={64}
              onClick={handleNext}
              className={`shadow ${
                canGoNext ? "cursor-pointer" : "cursor-not-allowed opacity-0"
              }`}
            />
          )}
        </div>
      )}

      <div className="flex items-center gap-4 overflow-hidden">
        {/* Slider cards */}
        <div
          className="relative flex-1 overflow-hidden"
          onTouchStart={isMobile ? onTouchStart : undefined}
          onTouchEnd={isMobile ? onTouchEnd : undefined}
        >
          <div
            className="flex gap-4 transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${(pageIndex / totalPages) * 100}%)`,
              width: `${(classes.length / VISIBLE_COUNT) * 100}%`,
            }}
          >
            {classes.map((classItem: ClassCard) => (
              <Link
                href={`/classes/${classItem.id}`}
                key={classItem.id}
                className="relative rounded-lg shadow-lg overflow-hidden"
                style={{ width: `${100 / classes.length}%` }}
              >
                <Image
                  src={
                    typeof classItem.imageUrl === "string"
                      ? classItem.imageUrl
                      : classItem.imageUrl?.src || ""
                  }
                  loading="lazy"
                  width={600}
                  height={600}
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
      </div>
    </div>
  );
}
