"use client";

import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { KeyRound, Mail } from "lucide-react";
import { useState } from "react";
import { useSession } from "~/context/hooks";
import { usersControllerGetProfile, usersControllerLogin } from "~/lib/api";

export default function LoginModal() {
  const { setUser } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function login(formData: FormData) {
    try {
      const { data } = await usersControllerLogin({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      });
      if (typeof data.jwt === "string") {
        localStorage.setItem("jwt", data.jwt);
        const jwtData = jwtDecode(data.jwt) as any;
        if (jwtData?.userId) {
          const updatedUser = await usersControllerGetProfile({
            headers: { Authorization: `Bearer ${data.jwt}` },
          });
          if (updatedUser && updatedUser.data) setUser(updatedUser.data);
        }
      } else {
        setErrorMessage(String(data.message) || "An error occurred");
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        setErrorMessage(e.response?.data?.message || e.message);
      } else {
        setErrorMessage("An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <button
        className="btn"
        onClick={() => {
          const modal = document.getElementById("login_modal");
          if (modal instanceof HTMLDialogElement) {
            modal.showModal();
          }
        }}
      >
        Login
      </button>
      <dialog id="login_modal" className="modal">
        <div className="modal-box">
          <h1 className="p-3 text-3xl font-bold">Login</h1>
          <form
            action={(formData: FormData) => {
              setIsLoading(true);
              login(formData);
            }}
            className="flex flex-col items-center justify-center gap-2 p-4"
          >
            <label className="form-control w-[80%]">
              <div className="label">
                <span className="label-text flex items-center justify-center gap-1 font-semibold">
                  <Mail size={16} />
                  Email
                </span>
                <span>
                  {errorMessage && (
                    <span className="text-xs font-semibold text-red-400">{errorMessage}</span>
                  )}
                </span>
              </div>
              <input
                type="email"
                name="email"
                required
                placeholder="Input your email"
                className="input input-bordered w-full"
              />
            </label>
            <label className="form-control w-[80%]">
              <div className="label">
                <span className="label-text flex items-center gap-1 font-semibold">
                  <KeyRound size={16} />
                  Password
                </span>
              </div>
              <input
                type="password"
                name="password"
                required
                placeholder="Input your password"
                className="input input-bordered w-full"
              />
              <a
                href="https://investtrack-ten.vercel.app/signup"
                className="link-hover link mt-2 self-end text-xs"
              >
                Don&apos;t have an account? Register here
              </a>
            </label>

            <div className="modal-action">
              {/* if there is a button in form, it will close the modal */}
              <button type="submit" className="btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Loading
                  </>
                ) : (
                  "Log In"
                )}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
