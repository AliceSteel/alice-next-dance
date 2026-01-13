'use client";';
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SidemenuProps } from "./SidemenuProps";

export const Sidemenu = ({
  position,
  menuItems,
  isOpen,
  onClose,
}: SidemenuProps) => {
  const [ready, setReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const align = position === "left" ? "md:items-start" : "items-end";
  const offscreen =
    position === "left"
      ? "-translate-x-[calc(100%+3rem)]"
      : "translate-x-[calc(100%+3rem)]";
  const enterDelay = position === "right" ? "delay-150" : "delay-0";
  const motionClass = ready && isOpen ? "translate-x-0" : offscreen;

  return (
    <ul
      onTransitionEnd={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.propertyName !== "transform") return;
        if (!isOpen) onClose?.(); // finished exit → let parent unmount
      }}
      className={[
        "z-20 text-sm capitalize flex flex-col gap-0.5 list-none backdrop-blur-[2px] pl-2 pr-4 rounded-bl-4xl",
        align,
        "transform-gpu motion-safe:transition-transform duration-700 ease-out",
        motionClass,
        // apply enter delay only while opening
        ready && isOpen ? enterDelay : "delay-0",
        "motion-reduce:transition-none",
      ].join(" ")}
    >
      {menuItems?.map((item) => {
        if ("onClick" in item) {
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={item.onClick}
                className="transition-colors text-gray-300 hover:text-white"
              >
                {item.title}
              </button>
            </li>
          );
        }
        if (!item.link) return null;
        const isHash = item?.link?.includes("#");
        const basePath = (item.link?.split("#")[0] || "/").trim() || "/";
        const isActive = pathname === basePath;
        return (
          <li key={item.id}>
            {isHash ? (
              <Link
                href={item.link?.startsWith("/") ? item.link : `/${item.link}`}
                className="transition-colors text-gray-300 hover:text-white"
              >
                {item.title}
              </Link>
            ) : (
              <Link
                href={item.link}
                className={`transition-colors ${
                  isActive
                    ? "text-[#007DFF] hover:cursor-default"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.title}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default Sidemenu;
