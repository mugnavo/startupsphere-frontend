"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useInteractiveMap } from "~/context/hooks";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { dashboardSelection } = useInteractiveMap();

  return (
    <div
      className={
        "absolute top-0 z-10 h-screen w-full flex-col bg-white bg-opacity-95 p-6 pl-28 drop-shadow-xl" +
        (dashboardSelection.active ? " hidden" : " flex")
      }
    >
      <div className="flex max-w-md items-center gap-8">
        <Link href="/">
          <ArrowLeft size={20} className="cursor-pointer" />
        </Link>
        Dashboard
        <div role="tablist" className="tabs tabs-bordered w-full">
          <Link
            role="tab"
            href="/dashboard"
            className={"tab" + (pathname === "/dashboard" ? " tab-active" : "")}
          >
            Home
          </Link>
          <Link
            role="tab"
            href="/dashboard/analytics"
            className={
              "tab" + (pathname.startsWith("/dashboard/analytics") ? " tab-active" : "")
            }
          >
            Analytics
          </Link>
        </div>
      </div>

      {/* Content of dashboard pages here */}
      {children}
      <div className="absolute bottom-0 left-0 h-2 w-full bg-yellow-400" />
    </div>
  );
}
