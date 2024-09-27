"use client";

import { LogOut, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSession } from "~/context/hooks";
import { User } from "~/lib/schemas";

export default function Account() {
  const { user } = useSession();
  const { setUser } = useSession();
  const [isShowMenu, setIsShowMenu] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  //For the account menu modal: Close the modal if clicked outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsShowMenu(false);
      }
    };

    if (isShowMenu) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isShowMenu]);

  return (
    <>
      <div
        onClick={() => setIsShowMenu(!isShowMenu)}
        className="absolute right-3 top-3 z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-yellow-400 bg-yellow-600 text-xl font-normal text-white"
      >
        {user?.firstName[0] || "G"}
      </div>

      {/* account menu modal */}
      {isShowMenu && (
        <div
          ref={modalRef}
          className="absolute right-3 top-14 z-50 flex h-auto w-48 flex-col gap-1 rounded bg-white p-2 text-sm"
        >
          <span className="m-2">{user ? `${user?.firstName} ${user?.lastName} ` : "Guest"}</span>

          {/* guest dont need button for their account */}
          {Array.from({ length: 2 }, (_, index) => (
            <div
              key={index}
              className="flex cursor-pointer items-center gap-2 rounded p-3 hover:bg-gray-100"
              onClick={async () => {
                if (index === 1) {
                  if (user) {
                    localStorage.removeItem("jwt");
                    setUser(null);
                  } else {
                    const loginModal = document.getElementById("login_modal");
                    if (loginModal instanceof HTMLDialogElement) {
                      loginModal.showModal();
                    }
                  }
                }
              }}
            >
              {index === 0 ? (
                <>
                  <UserRound size={15} /> {user ? user.email : "Guest"}
                </>
              ) : (
                <>
                  <LogOut size={15} /> {user ? "Logout" : "Login"}
                </>
              )}
            </div>
          ))}
          <div className="m-auto mt-1 block w-3 rounded-lg border border-gray-300" />
        </div>
      )}
    </>
  );
}

function AccountMenu({ user }: { user: User | null | undefined }) {
  const { setUser } = useSession();
  const menuItems = [
    { id: 1, name: user?.email || "Guest", icon: UserRound },
    { id: 2, name: user ? "Logout" : "Login", icon: LogOut },
  ];

  return (
    <div className="absolute right-3 top-14 z-50 flex h-auto w-48 flex-col gap-1 rounded bg-white p-2 text-sm">
      <span className="m-2">{user ? `${user?.firstName} ${user?.lastName} ` : "Guest"}</span>

      {/* guest dont need button for their account */}
      {(user ? menuItems : menuItems.slice(1)).map((item, index) => (
        <div
          key={item.id}
          className="flex cursor-pointer items-center gap-2 rounded p-3 hover:bg-gray-100"
          onClick={async () => {
            if (item.id === 2) {
              if (user) {
                localStorage.removeItem("jwt");
                setUser(null);
              } else {
                const loginModal = document.getElementById("login_modal");
                if (loginModal instanceof HTMLDialogElement) {
                  loginModal.showModal();
                }
              }
            }
          }}
        >
          <item.icon size={15} />
          {item.name}
        </div>
      ))}
      <div className="m-auto mt-1 block w-3 rounded-lg border border-gray-300" />
    </div>
  );
}
