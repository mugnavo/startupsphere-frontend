"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MyProfileLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  const isShowProfile = !isNaN(Number(path[path.length - 1]));

  return (
    <div
      className={`${!isShowProfile ? "absolute top-0 z-10 h-screen w-full flex-col overflow-y-hidden bg-white bg-opacity-95 p-6 pl-28 shadow-xl" : "h-0"}`}
    >
      <div className="flex max-w-3xl items-center gap-8">
        <Link href="/">
          <ArrowLeft size={20} className="cursor-pointer" />
        </Link>
        Dashboard
      </div>
      {/* Content of report pages here */}
      {children}
      <div className="absolute bottom-0 left-0 h-2 w-full bg-[#004A98]" />
    </div>
  );
}
