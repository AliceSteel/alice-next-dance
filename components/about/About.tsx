import backgroundImage from "@/assets/images/ballet-blurred.jpg";
import { aboutUsContent } from "@/assets/data/aboutUsData";
import { useMemo, useEffect, useRef, useState } from "react";
import SectionTitle from "@/components/sectionTitle/SectionTitle";
import ClassesList from "@/components/classesList/ClassesList";
import renderHighlighted from "@/helpers/renderHighlitedText";
import { useSelector } from "react-redux";
import { selectClasses } from "@/store/slices/classes/classesSlice";

export default function About() {
  const classes = useSelector(selectClasses);
  const startAngles = useMemo(
    () =>
      aboutUsContent.numbers.stats.map(() => Math.floor(Math.random() * 360)),
    []
  );
  const statsRef = useRef<HTMLUListElement | null>(null);
  const [animateRings, setAnimateRings] = useState(false);
  const [counts, setCounts] = useState<number[]>(() =>
    aboutUsContent.numbers.stats.map(() => 1)
  );

  useEffect(() => {
    if (!animateRings) return;
    const targets = aboutUsContent.numbers.stats.map((s) =>
      typeof s.value === "number" ? s.value : parseInt(String(s.value), 10)
    );
    const duration = 1600; // match ring animation
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCounts(
        targets.map((v) => {
          const val = Math.floor(v * progress);
          return progress < 1 ? Math.max(1, val) : v;
        })
      );
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [animateRings]);
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimateRings(true); // run once
          io.disconnect();
        }
      },
      { threshold: 0.25 } // adjust sensitivity if needed
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="page-container pt-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* TEXT SECTION */}
        <div className="flex flex-col md:flex-row md:gap-8">
          <h4>About</h4>
          <img
            src={backgroundImage}
            alt="Dancing girl"
            className="w-full max-h-[50vh] h-auto object-cover object-left-top md:overflow-hidden"
          />
        </div>

        <div className="relative md:col-start-2 md:col-span-2">
          <p className="text-3xl md:text-4xl uppercase text-white mb-2">
            {renderHighlighted(aboutUsContent.paragraph1)}
          </p>
          <p className="text-3xl md:text-4xl uppercase relative md:right-42 mb-2">
            {renderHighlighted(aboutUsContent.paragraph2)}
          </p>
          <p className="text-sm md:w-1/2">
            {renderHighlighted(aboutUsContent.paragraph3)}
          </p>
        </div>

        {/* NUMBERS SECTION */}
        <div className="md:col-start-2 md:col-span-2 mt-10 lg:mt-0">
          <SectionTitle
            title={aboutUsContent.numbers.title}
            subtitle={aboutUsContent.numbers.subtitle}
          />
        </div>
        <ul
          ref={statsRef}
          className="col-span-full flex justify-evenly list-none my-8"
        >
          {aboutUsContent.numbers.stats.map((stat, index) => (
            <li
              key={index}
              className="relative flex flex-col gap-1 sm:gap-2 items-center justify-center w-1/4 max-w-72 aspect-square"
            >
              {/* CENTERED RING SPINNER*/}
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] aspect-square">
                <div className="absolute inset-0 rounded-full border-[0.5px] border-sky-400" />
                <div
                  className="absolute inset-0"
                  style={{ transform: `rotate(${startAngles[index]}deg)` }}
                >
                  <div
                    className={[
                      "absolute inset-0 [will-change:transform] motion-reduce:animate-none",
                      animateRings
                        ? "motion-safe:animate-[spin-quarter_1600ms_ease-out_1_forwards]"
                        : "",
                    ].join(" ")}
                  >
                    <span className="absolute left-1/2 -translate-x-1/2 top-0 w-2 h-2 rounded-full bg-sky-400" />
                  </div>
                </div>
              </div>
              {/* NUMBERS VALUE */}
              <span className="font-special font-semibold text-5xl md:text-7xl text-white">
                {counts[index]}
              </span>
              <span className="block text-sm mb-4 text-center">
                {stat.label}
              </span>
            </li>
          ))}
        </ul>

        {/* CLASSES LIST */}
        <div className="md:col-start-2 md:col-span-2 mt-28">
          <SectionTitle
            title={aboutUsContent.classesSection.title}
            subtitle={aboutUsContent.classesSection.subtitle}
          />
        </div>
        <div className="col-span-full mt-8 mb-28">
          <ClassesList classes={classes} />
        </div>
      </div>
    </div>
  );
}
