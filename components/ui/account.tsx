"use client";

import axios from "axios";
import { LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSession } from "~/context/hooks";

export default function Account() {
  const { user } = useSession();
  const { setUser } = useSession();
  const [isShowMenu, setIsShowMenu] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [pfp, setPfp] = useState<string>("");
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

  async function fetchPfp() {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile-picture/${user?.id}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        responseType: "blob",
      }
    );
    setPfp(URL.createObjectURL(response.data));
  }
  useEffect(() => {
    if (user) {
      fetchPfp();
    }
  }, [user]);

  return (
    <>
      <div
        onClick={() => setIsShowMenu(!isShowMenu)}
        className="absolute right-3 top-3 z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-yellow-400 bg-yellow-600 text-xl font-normal text-white"
      >
        {pfp ? (
          <img src={pfp} className="h-full w-full rounded-full object-cover" />
        ) : (
          user?.firstName[0] || "G"
        )}
      </div>

      {/* account menu modal */}
      {isShowMenu && (
        <div
          ref={modalRef}
          className="absolute right-3 top-14 z-50 flex h-auto w-48 flex-col gap-1 rounded bg-white p-2 text-sm shadow-custom"
        >
          <div className="txt-lg relative mb-2 flex py-4">
            {user ? `${user?.firstName} ${user?.lastName} ` : "Guest"}
            <span className="absolute bottom-0 left-0 text-xs text-gray-400">{user?.email}</span>
          </div>

          <div
            className={`flex cursor-pointer items-center gap-2 rounded p-3 hover:bg-gray-100`}
            onClick={async () => {
              if (user) {
                localStorage.removeItem("jwt");
                setUser(null);
              } else {
                const loginModal = document.getElementById("login_modal");
                if (loginModal instanceof HTMLDialogElement) {
                  loginModal.showModal();
                }
              }
            }}
          >
            <>
              <LogOut size={15} /> {user ? "Logout" : "Login"}
            </>
          </div>

          <div className="m-auto mt-1 block w-3 rounded-lg border border-gray-300" />
        </div>
      )}
    </>
  );
}
