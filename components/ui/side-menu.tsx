"use client";

import { Bookmark, ClipboardPenLine, Cog, History, LayoutDashboard, Search } from "lucide-react";
import { Fragment } from "react";

import { useSession } from "~/context/hooks";
import LoginModal from "../modals/login-modal";
import SidebarLink, { type SidebarLinkProps } from "./sidebar-link";

const size = 25;
const SIDEBAR_LINKS: SidebarLinkProps[] = [
  { href: "/search", name: "Search", icon: <Search size={size} /> },
  { href: "/recents", name: "Recent", icon: <History size={size} /> },
  { href: "/bookmarks", name: "Bookmarks", icon: <Bookmark size={size} /> },
  { href: "/reports", name: "Reports", icon: <ClipboardPenLine size={size} /> },
  { href: "/my-profiles", name: "My Entities", icon: <Cog size={size} /> },
];

export default function SideMenu() {
  const { user } = useSession();

  return (
    <div className="absolute left-0 top-0 z-50 flex h-screen w-20 flex-col items-center justify-between bg-white bg-opacity-70 p-3 pt-16 align-middle shadow-sm shadow-slate-400">
      <div className="flex flex-col items-center gap-8">
        <Logo />

        {SIDEBAR_LINKS.filter((item) =>
          ["/recents", "/bookmarks", "/reports", "/my-profiles"].includes(item.href) ? !!user : true
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
  return (
    <div className="absolute left-0 top-0 flex h-12 w-full items-center justify-center bg-yellow-600 shadow-csm">
      {/* <img
        src={"logo.png"}
        alt="startupsphere logo"
        width={100}
        height={100}
        className="h-12 w-12 select-none"
      /> */}
    </div>
  );
}
