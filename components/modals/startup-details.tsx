import Image from "next/image";
import { useEffect, useState } from "react";
import { useInteractiveMap } from "~/lib/InteractiveMapContext";
import { Startup } from "~/lib/schema";
import { capitalize, placeholderImageUrl } from "~/lib/utils";
import { UploadDropzone } from "../uploadthing";

export default function StartupDetailsModal({
  editable = false,
  startup,
}: {
  editable: boolean;
  startup: Startup | undefined;
}) {
  // Used for Create, View, and Edit startups
  // - create = editable with undefined startup
  // - edit = editable with startup
  // - view = not editable with startup
  const mode = editable ? (startup ? "edit" : "create") : "view";

  const { hideDashboard, setHideDashboard } = useInteractiveMap();
  const [previewingMap, setPreviewingMap] = useState(false);

  useEffect(() => {
    if (!hideDashboard && previewingMap) {
      const modal = document.getElementById("startup_details_modal") as HTMLDialogElement;
      modal.show();
      setPreviewingMap(false);
    }
  }, [hideDashboard, previewingMap]);

  function previewMap() {
    setPreviewingMap(true);
    setHideDashboard(true);
    // close startup details modal
    const modal = document.getElementById("startup_details_modal") as HTMLDialogElement;
    modal.close();
  }

  return (
    <dialog id="startup_details_modal" className="modal">
      <div className="modal-box max-w-3xl">
        <h3 className="text-lg font-bold">{capitalize(mode)} startup</h3>
        <form className="grid grid-cols-3 gap-x-2 gap-y-1">
          <TextInputField
            label="Startup name"
            name="startup_name"
            placeholder="Mugnavo"
            defaultValue={startup?.name}
            disabled={!editable}
          />
          <TextInputField
            label="Website URL"
            name="startup_website_url"
            placeholder="https://mugnavo.com"
            defaultValue={startup?.websiteUrl ?? undefined}
            disabled={!editable}
          />
          <TextInputField
            label="Industry"
            name="startup_industry"
            placeholder="Software"
            defaultValue={startup?.industry}
            disabled={!editable}
          />
          <TextInputField
            label="Description"
            name="startup_description"
            placeholder="I wanna be a tutubi a twinkle star. Hao hao de carabao de batuten. Meow"
            defaultValue={startup?.name}
            disabled={!editable}
            textarea
          />
          <div className="form-control">
            <div className="label">
              <span className="label-text">Logo</span>
            </div>
            <Image
              src={startup?.logoUrl || placeholderImageUrl}
              alt="Startup logo"
              width={512}
              height={512}
              className="rounded-lg"
            />
            {editable && <UploadDropzone className="h-1" endpoint="imageUploader" />}
          </div>
          <TextInputField
            label="Founder name"
            name="startup_foundername"
            placeholder="John Doe"
            defaultValue={startup?.founderName ?? undefined}
            disabled={!editable}
          />
          <TextInputField
            label="Location"
            name="startup_location"
            placeholder="IT Park, Cebu City, Cebu"
            defaultValue={startup?.location ?? undefined}
            disabled={!editable}
          />
          <div className="form-control">
            <div className="label">
              <span className="label-text">Location from map</span>
            </div>
            <span className="test">TODO</span>
            <div className="flex gap-2">
              <button type="button" className="btn btn-xs" onClick={previewMap}>
                Preview
              </button>
              {editable && <button className="btn btn-xs">Update</button>}
            </div>
          </div>
          <TextInputField
            label="Contact email/number"
            name="startup_contact"
            placeholder="hello@mugnavo.com"
            defaultValue={startup?.contactInfo ?? undefined}
            disabled={!editable}
          />
          <TextInputField
            label="Funding stage"
            name="startup_stage"
            placeholder="Series A funding"
            defaultValue={startup?.stage ?? undefined}
            disabled={!editable}
          />
          <TextInputField
            label="Founded date"
            name="startup_revenue"
            placeholder="2024/04/24"
            defaultValue={startup?.foundedDate?.toString() ?? undefined}
            disabled={!editable}
            date
          />

          {editable && (
            <div className="modal-action col-span-full">
              <button className="btn">Save</button>
            </div>
          )}
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
// founderName, location, stage, funding, revenue, employees

function TextInputField({
  label,
  name,
  placeholder,
  defaultValue,
  disabled,
  textarea,
  date,
}: {
  label: string;
  name: string;
  placeholder: string;
  defaultValue?: string;
  disabled?: boolean;
  textarea?: boolean;
  date?: boolean;
}) {
  return (
    <label className={"form-control w-full" + (textarea ? " col-span-2" : "")}>
      <div className="label">
        <span className="label-text">{label}</span>
      </div>
      {textarea ? (
        <textarea
          placeholder={placeholder}
          name={name}
          defaultValue={defaultValue}
          disabled={disabled}
          rows={4}
          className="textarea textarea-bordered textarea-sm h-full p-2 leading-snug"
        />
      ) : (
        <input
          type={date ? "date" : "text"}
          placeholder={placeholder}
          name={name}
          defaultValue={defaultValue}
          disabled={disabled}
          className="input input-sm input-bordered w-full max-w-xs"
        />
      )}
    </label>
  );
}
