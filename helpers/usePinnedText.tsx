import { useEffect, useState } from "react";

export function usePinnedText<T extends HTMLElement>(
  targetRef: React.RefObject<T | null>,
  offsetPx: number
) {
  const [isPinned, setIsPinned] = useState(true);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= offsetPx) {
        console.log("not pinned, rect.top is vs offsetPx:", rect.top, offsetPx);
        setIsPinned(false);
      } else {
        console.log("pinned, rect.top is vs offsetPx:", rect.top, offsetPx);

        setIsPinned(true);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [targetRef, offsetPx]);

  return isPinned;
}
