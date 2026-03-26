import { useEffect, useRef, useState } from "react";

const DESC_GAP = 24; // pt-6 padding

export function usePinnedText<T extends HTMLElement, D extends HTMLElement>(
  titleRef: React.RefObject<T | null>,
  descriptionRef: React.RefObject<D | null>,
  navH: number,
) {
  const [isPinned, setIsPinned] = useState(true);
  const [botOff, setBotOff] = useState(0);
  const h1HRef = useRef(0);
  const descHRef = useRef(0);
  const botOffRef = useRef(0);
  const isPinnedRef = useRef(true);

  useEffect(() => {
    const titleEl = titleRef.current;
    const descEl = descriptionRef.current;
    if (!titleEl || !descEl) return;

    const getFlipY = () =>
      window.innerHeight - botOffRef.current - h1HRef.current - navH;

    const handleScroll = () => {
      const flipY = getFlipY();
      if (isPinnedRef.current && window.scrollY >= flipY) {
        isPinnedRef.current = false;
        setIsPinned(false);
      } else if (!isPinnedRef.current && window.scrollY < flipY) {
        isPinnedRef.current = true;
        setIsPinned(true);
      }
    };

    const recalculate = () => {
      h1HRef.current = titleEl.offsetHeight;
      const newBotOff = descEl.offsetHeight + DESC_GAP;
      botOffRef.current = newBotOff;
      setBotOff(newBotOff);
      handleScroll();
    };

    const ro = new ResizeObserver(recalculate);
    ro.observe(titleEl);
    ro.observe(descEl);

    recalculate();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [titleRef, descriptionRef, navH]);

  return { isPinned, botOff };
}
