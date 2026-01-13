import backgroundImage from "@/images/blurred-black.jpg";
import About from "@/components/about/About";
/* import { toast } from "react-toastify";
import { useEffect } from "react";
import { useLocation } from "react-router-dom"; */
import heroLines from "@/data/heroLinesData";

const Home = () => {
  /*  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("auth") === "required") {
      toast.error("You must be logged in to access the account page");
    }
  }, [location.search]);
 */
  // Animation timings
  const lineDurationMs = 2000;
  const lineStaggerMs = 350;
  const overlayDelayMs =
    (heroLines.length - 1) * lineStaggerMs + lineDurationMs;

  return (
    <>
      <section
        className="w-full relative h-screen bg-center bg-cover bg-no-repeat pt-40 overflow-hidden"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Dark overlay: fades in AFTER text finishes */}
        <div
          className="absolute inset-0 bg-radial from-blue-800 from-30% to-black pointer-events-none hero-overlay"
          style={{ ["--overlay-delay" as string]: `${overlayDelayMs}ms` }}
        />

        {/* Hero text */}
        <div className="page-container md:w-3/4 font-['BioRhyme']">
          <h1 className="tracking-wide text-white text-5xl sm:text-6xl lg:text-8xl flex flex-col gap-3">
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
