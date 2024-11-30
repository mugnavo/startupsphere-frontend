"use client";

import axios from "axios";
import { LogOut, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession } from "~/context/hooks";

export default function Account() {
  const { user } = useSession();
  const { setUser } = useSession();
  const router = useRouter();
  const [logout, setLogout] = useState(false);
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
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile-picture/${user?.id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          responseType: "blob",
        }
      );
      if (response.data?.size) {
        setPfp(URL.createObjectURL(response.data));
      }
    } catch (e) {
      console.log("Error while fetching user pfp: ", e);
      setPfp("sample");
    }
  }
  useEffect(() => {
    if (user) {
      fetchPfp();
    } else if(logout){
      router.replace("/");
      setPfp('sample');
    }
  }, [user, logout]);

  return (
    <>
      <div
        onClick={() => setIsShowMenu(!isShowMenu)}
        className="absolute right-3 top-3 z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[#004A98] text-xl font-normal text-white"
      >
        {user && pfp ? (
          pfp=="sample" ? user?.firstName[0] : <img src={pfp} className="h-full w-full rounded-full object-cover" />
        ) : (
           "G"
        )}
      </div>

      {/* account menu modal */}
      {isShowMenu && (
        <div
          ref={modalRef}
          className="absolute right-3 top-14 z-50 flex h-auto w-auto min-w-48 flex-col gap-1 rounded-lg bg-white px-4 py-2 text-sm shadow"
        >
          <div className="relative mb-2 flex flex-col pt-4 text-lg text-[#004A98]">
            {user ? `${user?.firstName} ${user?.lastName} ` : "Guest"}
            <span className="text-xs text-gray-400">{user?.email}</span>
          </div>
          <div
            className={`flex cursor-pointer items-center gap-2 rounded p-3 hover:bg-gray-100`}
            onClick={async () => {
              if (user) {
                localStorage.removeItem("jwt");
                setUser(null);
                setLogout(true);
              } else {
                const loginModal = document.getElementById("login_modal");
                if (loginModal instanceof HTMLDialogElement) {
                  loginModal.showModal();
                }
              }
            }}
          >
            <LogOut size={15} className="text-[#004A98]" /> {user ? "Logout" : "Login"}
          </div>
          {!user && (
            <a
              href="https://investtrack-ten.vercel.app/signup"
              className={`flex cursor-pointer items-center gap-2 rounded p-3 hover:bg-gray-100`}
            >
              <UserPlus size={15} className="text-[#004A98]" /> Register
            </a>
          )}
          <div className="m-auto my-1 block w-3 rounded-lg border border-blue-600" />
        </div>
      )}
    </>
  );
}
