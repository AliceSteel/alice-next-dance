import "./globals.css";
import type { Metadata } from "next";
import NavBar from "../components/navbar/NavBar";
import { Onest, BioRhyme } from "next/font/google";
import menuData from "@/data/menuData.json";
import { Providers } from "./Providers";
import { fetchClasses, fetchAllInstructors } from "@/helpers/actions";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { menuItemsLeft, menuItemsRight } = menuData;

  const [dbClasses, dbInstructors] = await Promise.all([
    fetchClasses(),
    fetchAllInstructors(),
  ]);
  const instructorsBySlug = new Map(dbInstructors.map((i) => [i.slug, i]));
  const items = dbClasses.map((c) => {
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

  const categories = items.map((c) => ({ id: c.id, title: c.title }));
  const preloadedState = {
    classes: {
      items,
      categories,
    },
  };
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning={true}>
      <body
        className={`${onest.variable} ${bioRhyme.variable} font-general relative overflow-x-hidden bg-[#181818] text-[#b6b6b6]`}
      >
        <Providers preloadedState={preloadedState}>
          <NavBar
            menuItemsLeft={menuItemsLeft}
            menuItemsRight={menuItemsRight}
          />
          <main className="min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
