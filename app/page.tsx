import backgroundImage from "@/images/blurred-black.jpg";
import About from "@/components/about/About";
import { toast } from "react-toastify";
import heroLines from "@/data/heroLinesData";

const Home = () => {
  // Animation timings
  const lineDurationMs = 2000;
  const lineStaggerMs = 350;
  const overlayDelayMs =
    (heroLines.length - 1) * lineStaggerMs + lineDurationMs;

  return (
    <>
      <section
        className="w-full relative h-screen bg-center bg-cover bg-no-repeat pt-40 overflow-hidden"
        style={{ backgroundImage: `url(${backgroundImage.src})` }}
      >
        {/* Dark overlay: fades in AFTER text finishes */}
        <div
          className="absolute inset-0 pointer-events-none hero-overlay"
          style={{ ["--overlay-delay" as string]: `${overlayDelayMs}ms` }}
        />

        {/* Hero text */}
        <div className="page-container md:w-3/4">
          <h1 className="tracking-wide text-white text-5xl sm:text-6xl xl:text-8xl font-normal flex flex-col gap-3 font-special">
            {heroLines.map((line, i) => (
              <span
                key={i}
                className="hero-line"
                style={{
                  animationDelay: `${i * lineStaggerMs}ms`,
                  ["--line-duration" as string]: `${lineDurationMs}ms`,
                }}
              >
                {line}
              </span>
            ))}
          </h1>
        </div>
      </section>
      <section id="about">
        <About />
      </section>
    </>
  );
};
export default Home;
