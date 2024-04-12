"use client";
interface LoginModalProps {
  id: string;
}

export default function LoginModal({ id }: LoginModalProps) {
  return (
    <div>
      <dialog id={id} className="modal">
        <div className="modal-box">
          <h2 className="text-lg font-bold">Login</h2>
          <div className="flex flex-col items-center justify-center gap-5 p-8">
            <label className="max-w-ws form-control">
              <div className="label">
                <span className="label-text">Email/Username</span>
              </div>
              <input
                type="text"
                placeholder="Input your email/username"
                className="input input-bordered w-full max-w-xs"
              />
            </label>
            <label className="max-w-ws form-control ">
              <div className="label">
                <span className="label-text">Password</span>
              </div>
              <input
                type="password"
                placeholder="Input your password"
                className="input input-bordered w-full max-w-xs"
              />
            </label>
          </div>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
