"use client";

import { Bookmark, History, LayoutDashboard, Search } from "lucide-react";
import { Fragment } from "react";

import { useSession } from "~/context/hooks";
import LoginModal from "../modals/login-modal";
import SidebarLink, { type SidebarLinkProps } from "./sidebar-link";

const SIDEBAR_LINKS: SidebarLinkProps[] = [
  { href: "/search", name: "Search", icon: <Search size={22} /> },
  { href: "/recents", name: "Recent", icon: <History size={22} /> },
  { href: "/bookmarks", name: "Bookmarks", icon: <Bookmark size={22} /> },
  { href: "/dashboard", name: "Dashboard", icon: <LayoutDashboard size={22} /> },
];

export default function SideMenu() {
  const { user } = useSession();

  return (
    <div className="absolute left-0 top-0 z-50 flex h-screen w-20 flex-col items-center justify-between bg-white p-3 pt-16 align-middle shadow-sm shadow-slate-400">
      <div className="flex flex-col items-center gap-8">
        <Logo />

        {SIDEBAR_LINKS.filter((item) =>
          item.href === "/dashboard"
            ? user?.moderator
            : ["/recents", "/bookmarks"].includes(item.href)
              ? !!user
              : true
        ).map((item, index) => (
          <Fragment key={item.href}>
            {index === 3 && <div className="m-2 w-3 rounded-lg border border-gray-300" />}
            <SidebarLink item={item} />
          </Fragment>
        ))}
      </div>
      {!user && <LoginModal />}

      <div className="absolute bottom-0 h-2 w-full bg-yellow-400" />
    </div>
  );
}

function Logo() {
  return <div className="absolute left-0 top-0 h-12 w-full bg-red-800"></div>;
}
