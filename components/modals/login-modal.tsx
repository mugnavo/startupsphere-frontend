"use client";

import { jwtDecode } from "jwt-decode";
import { CircleUserRound, KeyRound, Mail, UserRoundPen } from "lucide-react";
import { useState } from "react";
import { useSession } from "~/context/hooks";
import { usersControllerCreate, usersControllerLogin } from "~/lib/api";
import { User } from "~/lib/schemas";

export default function LoginModal() {
  const { setUser } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function login(formData: FormData) {
    const { data } = await usersControllerLogin({
      data: {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      },
    });
    if (typeof data.jwt === "string") {
      localStorage.setItem("jwt", data.jwt);
      const user = jwtDecode(data.jwt) as User;
      if (user?.email) {
        setUser(user);
      }
    } else {
      setErrorMessage(String(data.message) || "An error occurred");
    }
    setIsLoading(false);
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
              <button
                type="button"
                onClick={() => {
                  const loginModal = document.getElementById("login_modal");
                  if (loginModal instanceof HTMLDialogElement) {
                    loginModal.close();
                  }
                  const modal = document.getElementById("register_modal");
                  if (modal instanceof HTMLDialogElement) {
                    modal.showModal();
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === "NumpadEnter") {
                    event.preventDefault();
                  }
                }}
                className="link-hover link mt-2 self-end text-xs"
              >
                Don&apos;t have an account? Register here
              </button>
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
      <RegisterModal />
    </>
  );
}

function RegisterModal() {
  const { setUser } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [mismatch, setMismatch] = useState(false);

  async function register(formData: FormData) {
    const { data } = await usersControllerCreate({
      email: formData.get("email") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      password: formData.get("password") as string,
      role: formData.get("role") as string,
    } as User);
    // if (data.access_token) {
    //   localStorage.setItem("jwt", data.access_token);
    //   const user = jwtDecode(data.access_token) as User;
    //   if (user?.email) {
    //     setUser(user);
    //   }
    // } else if (data.error) {
    //   alert(data.error);
    // }
    // their register controller doesnt return anything
    setIsLoading(false);
  }

  return (
    <dialog id="register_modal" className="modal">
      <div className="modal-box flex flex-col">
        <CircleUserRound size={100} strokeWidth={1.1} className="self-center" />
        <h1 className="self-center p-2 text-3xl font-bold">Create an Account</h1>
        <form
          action={(formData: FormData) => {
            setIsLoading(true);
            register(formData);
          }}
          className="flex flex-col items-center justify-center gap-2 p-4"
        >
          <label className="form-control w-[80%]">
            <div className="label">
              <span className="label-text font-semibold">First name</span>
            </div>
            <input
              type="text"
              name="firstName"
              required
              placeholder="John"
              className="input input-bordered w-full"
            />
          </label>
          <label className="form-control w-[80%]">
            <div className="label">
              <span className="label-text font-semibold">Last name</span>
            </div>
            <input
              type="text"
              name="lastName"
              required
              placeholder="Doe"
              className="input input-bordered w-full"
            />
          </label>

          <label className="form-control w-[80%]">
            <div className="label">
              <span className="label-text flex items-center justify-center gap-1 font-semibold">
                <Mail size={16} />
                Email
              </span>
              <span>
                {emailError && (
                  <span className="text-xs font-semibold text-red-400">
                    Please enter a valid email address
                  </span>
                )}
              </span>
            </div>
            <input
              type="email"
              name="email"
              required
              placeholder="Input your email"
              className="input input-bordered w-full"
              onChange={(event) => {
                const email = event.target.value;
                if (email === "") {
                  setEmailError(false);
                } else {
                  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
                  setEmailError(!isValid);
                }
              }}
            />
          </label>
          <label className="form-control w-[80%]">
            <div className="label">
              <span className="label-text flex items-center gap-1 font-semibold">
                <KeyRound size={16} />
                Password
              </span>
              <span>
                {passwordError && (
                  <span className="text-xs font-semibold text-red-400">
                    Password needs 6+ characters
                  </span>
                )}
              </span>
            </div>
            <input
              id="password"
              type="password"
              name="password"
              required
              placeholder="Input your password"
              className="input input-bordered w-full"
              onChange={(event) => {
                const password = event.target.value;
                setPasswordError(password.length < 6 || password.length === 0);
              }}
            />
            {/* retype password */}
            <div className="label">
              <span className="label-text flex items-center gap-1 font-semibold">
                <KeyRound size={16} />
                Confirm Password
              </span>
              <span>
                {mismatch && (
                  <span className="text-xs font-semibold text-red-400">
                    Password is not matched
                  </span>
                )}
              </span>
            </div>
            <input
              type="password"
              name="retype-password"
              required
              placeholder="Confirm your password"
              className="input input-bordered w-full"
              onChange={(event) => {
                const confirmPassword = event.target.value;
                const originalPassword = document.getElementById("password") as HTMLInputElement;
                setMismatch(confirmPassword !== originalPassword.value);
              }}
            />
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text flex items-center gap-1 font-semibold">
                  <UserRoundPen size={16} />
                  Select Role
                </span>
              </div>
              <select className="select select-bordered w-full" name="role">
                <option defaultValue="member " value="member">
                  Member
                </option>
                <option value="founder">Founder</option>
                <option value="investor">Investor</option>
              </select>
            </label>
            <button
              type="button"
              onClick={() => {
                const registerModal = document.getElementById("register_modal");
                if (registerModal instanceof HTMLDialogElement) {
                  registerModal.close();
                }
                const modal = document.getElementById("login_modal");
                if (modal instanceof HTMLDialogElement) {
                  modal.showModal();
                }
              }}
              className="link-hover link mt-2 self-end text-xs"
            >
              Already have an account? Login
            </button>
          </label>

          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button
              type="submit"
              className="btn"
              disabled={isLoading || emailError || passwordError || mismatch}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Loading
                </>
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </div>
    </dialog>
  );
}
