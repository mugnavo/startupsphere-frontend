"use client";

import { signup } from "~/lib/actions/auth";

export default function LoginModal() {
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
          <div className="flex flex-col items-center justify-center gap-5 p-8">
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

            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
      <RegisterModal />
    </>
  );
}

function RegisterModal() {
  return (
    <dialog id="register_modal" className="modal">
      <div className="modal-box">
        <h1 className="p-2 text-3xl font-bold">Register</h1>
        <form
          action={async (formData: FormData) => {
            const { error } = await signup({
              email: formData.get("email") as string,
              firstName: formData.get("firstName") as string,
              lastName: formData.get("lastName") as string,
              password: formData.get("password") as string,
              location: "Earth", // TODO: TEMPORARY
            });
            if (error) {
              alert(error);
            }
          }}
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

          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button type="submit" className="btn">
              Sign up
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
