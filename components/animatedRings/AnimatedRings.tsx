"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./rings.module.css";

export type RingStat = {
  label?: string;
  value?: number | string;
};

export default function StatsRings({ stats }: { stats: RingStat[] }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [animate, setAnimate] = useState(false);
  const [counts, setCounts] = useState(() => stats.map(() => 1));

  useEffect(() => {
    const element = listRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!animate) return;

    const targets = stats.map((stat) =>
      typeof stat.value === "number"
        ? stat.value
        : Number.parseInt(String(stat.value), 10),
    );
    const duration = 1600;
    const start = performance.now();
    let frameId = 0;

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCounts(targets.map((target) => Math.floor(target * progress)));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [animate, stats]);

  return (
    <ul ref={listRef} className="flex list-none justify-evenly ">
      {stats.map((stat, index) => {
        const startAngle = (index * 137) % 360;

        return (
          <li
            key={stat.label ?? index}
            style={{ width: `${100 / stats.length}%` }}
            className="relative flex aspect-square max-w-72 flex-col items-center justify-center gap-1 sm:gap-2"
          >
            <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[115%] -translate-x-1/2 -translate-y-1/2">
              <div className="absolute inset-0 rounded-full border-[0.5px] border-sky-400" />
              <div
                className="absolute inset-0"
                style={{ transform: `rotate(${startAngle}deg)` }}
              >
                <div
                  className={`absolute inset-0 [will-change:transform] motion-reduce:animate-none ${
                    animate ? styles.animateRing : ""
                  }`}
                >
                  <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-sky-400" />
                </div>
              </div>
            </div>
            {stat.value && (
              <span className="font-special text-5xl font-semibold text-white md:text-7xl">
                {counts[index] ?? 0}
              </span>
            )}

            {stat.label && (
              <span
                className={`block text-center ${!stat.value ? "text-base" : "text-sm"}`}
              >
                {stat.label}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
