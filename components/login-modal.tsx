"use client";
interface LoginModalProps {
  id: string;
}

export default function LoginModal({ id }: LoginModalProps) {
  return (
    <div>
      <dialog id={id} className="modal">
        <div className="modal-box">
          <h1 className="p-3 text-3xl font-bold">Login</h1>
          <div className="flex flex-col items-center justify-center gap-5 p-8">
            <label className="form-control w-[80%]">
              <div className="label">
                <span className="label-text font-semibold">Email/Username</span>
              </div>
              <input
                type="text"
                placeholder="Input your email/username"
                className="input input-bordered w-full "
              />
            </label>
            <label className="form-control w-[80%]">
              <div className="label">
                <span className="label-text font-semibold">Password</span>
              </div>
              <input
                type="password"
                placeholder="Input your password"
                className="input input-bordered w-full "
              />
              <a className="link-hover link mt-2 self-end text-xs">
                Don&apos;t have an account? Register here
              </a>
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
    </div>
  );
}
