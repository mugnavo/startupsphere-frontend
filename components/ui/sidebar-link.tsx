"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export interface SidebarLinkProps {
  href: string;
  name: string;
  icon: React.ReactNode;
}

export default function SidebarLink({ item }: { item: SidebarLinkProps }) {
  const pathname = usePathname();
  return (
    <Link
      href={item.href}
      className={`${pathname === item.href || (pathname !== "/" && pathname.startsWith(item.href)) ? "text-[#004A98]" : "text-gray-500"} flex cursor-pointer flex-col items-center text-center`}
    >
      {item.icon}
      <div className={`${pathname === item.href ? "font-bold" : "font-light"} mt-1 text-xs`}>
        {item.name}
      </div>
    </Link>
  );
}
