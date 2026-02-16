"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Sidebar() {
  const links = [
    { name: "CMS", href: "/admin/cms" },
    { name: "Sales", href: "/admin/sales" },
  ];
  const pathname = usePathname();
  return (
    <aside className="w-full md:w-64 text-white flex flex-row md:flex-col pt-16 md:pt-24 gap-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`${
            pathname === link.href ? "text-blue-500" : "underline"
          } py-3 pr-4`}
        >
          {link.name}
        </Link>
      ))}
    </aside>
  );
}
