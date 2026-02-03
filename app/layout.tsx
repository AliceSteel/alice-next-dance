import "./globals.css";
import type { Metadata } from "next";
import NavBar from "../components/navbar/NavBar";
import { Onest, BioRhyme } from "next/font/google";
import menuData from "@/data/menuData.json";
import { Providers } from "./Providers";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { menuItemsLeft, menuItemsRight } = menuData;

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning={true}>
      <body
        className={`${onest.variable} ${bioRhyme.variable} font-general relative overflow-x-hidden bg-[#181818] text-[#b6b6b6]`}
      >
        <Providers>
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
