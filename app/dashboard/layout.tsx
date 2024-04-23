"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="absolute top-0 z-10 flex h-screen w-full flex-col bg-white bg-opacity-95 p-6 pl-28 drop-shadow-xl">
      <div className="flex max-w-md items-center gap-8">
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
    </div>
  );
}
