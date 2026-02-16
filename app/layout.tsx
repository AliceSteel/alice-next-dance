import "./globals.css";
import type { Metadata } from "next";
import NavBar from "../components/navbar/NavBar";
import { Onest, BioRhyme } from "next/font/google";
import { Providers } from "./Providers";
import { fetchClasses, fetchAllInstructors } from "@/helpers/actions";
import type { Class } from "@/types/ClassDescription";
import type { Category } from "@/store/slices/classes/classesTypes";
import { ClerkProvider } from "@clerk/nextjs";
import ClerkAuthSync from "@/components/ClerkAuthSync";

const onest = Onest({
  subsets: ["latin"],
  weight: ["200", "400"],
  variable: "--font-onest",
});
const bioRhyme = BioRhyme({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-biorhyme",
});

export const metadata: Metadata = {
  title: "Alice Dance Studio",
  description: "A dance studio website built with Next.js and Tailwind CSS",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let items: Class[] = [];
  let categories: Category[] = [];

  try {
    const [dbClasses, dbInstructors] = await Promise.all([
      fetchClasses(),
      fetchAllInstructors(),
    ]);

    const instructorsBySlug = new Map(dbInstructors.map((i) => [i.slug, i]));

    items = dbClasses.map((c) => {
      const i = instructorsBySlug.get(c.slug);
      return {
        id: c.slug,
        title: c.title,
        imageUrl: `/images/${c.imageUrl}`, // filenames you seeded
        description: c.description,
        text1: c.text1 ?? undefined,
        text2: c.text2 ?? undefined,
        instructor: i
          ? {
              id: i.slug,
              name: i.name,
              image: `/images/${i.image}`, // filenames from instructorsData.json
              instagram: i.instagram,
              youTube: i.youTube,
              bioLines: i.bioLines,
            }
          : undefined,
      };
    });

    categories = items.map((c) => ({ id: c.id, title: c.title }));
  } catch (err) {
    console.error("Failed to load classes/instructors from DB", err);
    // items/categories stay empty; app still renders
  }

  const clerkAppearance = {
    variables: {
      colorPrimary: "#2563eb", // blue-600 (your primary button)
      colorBorder: "#2563eb",
      colorForeground: "#ffffff", // text color on clerk component
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 500,
        bold: 500,
      },
      colorInput: "#181818",
      colorMuted: "transparent",
      /*  colorPrimaryForeground: "#ffffff",
      colorBackground: "#272727", // modal card bg
      colorForeground: "#b6b6b6", // page text
      colorMuted: "#181818", // page background
      colorMutedForeground: "#9ca3af",
      colorNeutral: "#4b5563",
      colorInput: "#181818",
      colorInputForeground: "#ffffff",
      colorDanger: "#ef4444",
      colorSuccess: "#22c55e",
      colorWarning: "#eab308",
      colorShimmer: "#374151",
      colorRing: "#60a5fa",
      colorShadow: "rgba(37, 99, 235, 0.5)",

      
      colorModalBackdrop: "rgba(0, 0, 0, 0.4)",

      fontFamily: "var(--font-onest), system-ui, sans-serif",
      fontFamilyButtons: "var(--font-biorhyme), system-ui, sans-serif",

      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        md: "0.9375rem",
        lg: "1rem",
        xl: "1.125rem",
      },

      
 */
      spacing: "1rem",
    },
  };

  const preloadedState = {
    classes: {
      items,
      categories,
    },
  };
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en" className="scroll-smooth" suppressHydrationWarning={true}>
        <body
          className={`${onest.variable} ${bioRhyme.variable} font-general relative overflow-x-hidden bg-[#181818] text-[#b6b6b6]`}
        >
          <Providers preloadedState={preloadedState}>
            <ClerkAuthSync />
            <NavBar title="Alice Studio" />
            <main className="min-h-screen">{children}</main>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
