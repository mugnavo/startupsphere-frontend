"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginModal() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(formData: FormData) {
    setLoading(true);

    sendRequest(formData);
  }

  async function sendRequest(formData: FormData) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });
    if (res.redirected) {
      router.refresh();
    } else {
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      }
    }
    setLoading(false);
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
            action={handleLogin}
            className="flex flex-col items-center justify-center gap-5 p-8"
          >
            <label className="form-control w-[80%]">
              <div className="label">
                <span className="label-text font-semibold">Email</span>
              </div>
              <input
                type="email"
                name="email"
                placeholder="Input your email"
                required
                className="input input-bordered w-full "
              />
            </label>
            <label className="form-control w-[80%]">
              <div className="label">
                <span className="label-text font-semibold">Password</span>
              </div>
              <input
                type="password"
                name="password"
                required
                placeholder="Input your password"
                className="input input-bordered w-full "
              />
              <button
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
                className="link-hover link mt-2 self-end text-xs"
              >
                Don&apos;t have an account? Register here
              </button>
            </label>

            <div className={"text-red-500" + (error ? "" : " opacity-0")}>
              {error || "placeholder"}
            </div>

            <div className="modal-action">
              {/* if there is a button in form, it will close the modal */}
              <button type="submit" className="btn" disabled={loading}>
                {loading && <span className="loading loading-spinner" />}
                Login
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
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignup(formData: FormData) {
    setLoading(true);

    sendRequest(formData);
  }

  async function sendRequest(formData: FormData) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.get("email"),
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        location: "Earth", // TODO: temporary
        password: formData.get("password"),
      }),
    });
    if (res.redirected) {
      router.refresh();
    } else {
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      }
    }
    setLoading(false);
  }

  return (
    <dialog id="register_modal" className="modal">
      <div className="modal-box">
        <h1 className="p-2 text-3xl font-bold">Register</h1>
        <form
          action={handleSignup}
          className="flex flex-col items-center justify-center gap-2 p-4"
        >
          <label className="form-control w-[80%]">
            <div className="label">
              <span className="label-text font-semibold">Email</span>
            </div>
            <input
              type="email"
              name="email"
              required
              placeholder="Input your email"
              className="input input-bordered w-full "
            />
          </label>
          <label className="form-control w-[80%]">
            <div className="label">
              <span className="label-text font-semibold">First name</span>
            </div>
            <input
              type="text"
              name="firstName"
              required
              placeholder="John"
              className="input input-bordered w-full "
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
              className="input input-bordered w-full "
            />
          </label>
          <label className="form-control w-[80%]">
            <div className="label">
              <span className="label-text font-semibold">Password</span>
            </div>
            <input
              type="password"
              name="password"
              required
              placeholder="Input your password"
              className="input input-bordered w-full "
            />
            <button
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

          <div className={"text-red-500" + (error ? "" : " opacity-0")}>
            {error || "placeholder"}
          </div>

          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button type="submit" className="btn" disabled={loading}>
              {loading && <span className="loading loading-spinner" />}
              Sign up
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
