import { Startup } from "~/lib/schema";

export default function StartupDetailsModal({
  editable = false,
  startup,
}: {
  editable: boolean;
  startup: Startup | undefined;
}) {
  return (
    <dialog id="startup_details_modal" className="modal">
      <div className="modal-box">
        <h3 className="text-lg font-bold">Hello!</h3>
        <form>
          <label>
            <span>Startup Name</span>
            <input
              type="text"
              name="startup_name"
              value={startup?.name}
              disabled={!editable}
            />
          </label>
          <label>
            <span>Location</span>
            <input
              type="text"
              name="startup_location"
              value={startup?.location}
              disabled={!editable}
            />
          </label>
          <label>
            <span>Industry</span>
            <input
              type="text"
              name="startup_industry"
              value={startup?.industry}
              disabled={!editable}
            />
          </label>
          <button>Save</button>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
