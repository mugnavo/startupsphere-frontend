import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LocationData, useInteractiveMap } from "~/lib/InteractiveMapContext";
import { createStartup, updateStartup } from "~/lib/actions/startups";
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

  const router = useRouter();

  const { dashboardSelection, setDashboardSelection, selectedLocation } =
    useInteractiveMap();
  const [previewingMap, setPreviewingMap] = useState(false);

  const [currentStartupLogoUrl, setCurrentStartupLogoUrl] = useState<string | undefined>(
    startup?.logoUrl ?? undefined
  );
  const [currentStartupName, setCurrentStartupName] = useState(startup?.name);
  // TODO: update schema coordinates schema to add proper types based on LocationData
  const [currentStartupLocationData, setCurrentStartupLocationData] = useState<
    LocationData | undefined
  >(startup?.coordinates ?? undefined);

  useEffect(() => {
    if (startup) {
      setCurrentStartupName(startup.name);
      setCurrentStartupLogoUrl(startup.logoUrl ?? undefined);
      setCurrentStartupLocationData(startup.coordinates ?? undefined);
    }
  }, [startup]);

  useEffect(() => {
    if (!dashboardSelection.active && previewingMap) {
      setCurrentStartupLocationData(selectedLocation);
      const modal = document.getElementById("startup_details_modal") as HTMLDialogElement;
      modal.show();
      setPreviewingMap(false);
    }
  }, [dashboardSelection, previewingMap, selectedLocation]);

  function previewMap() {
    setPreviewingMap(true);
    setDashboardSelection({ active: true, startupName: currentStartupName });
    const modal = document.getElementById("startup_details_modal") as HTMLDialogElement;
    modal.close();
  }

  async function submitForm(formData: FormData) {
    const data: Startup = {
      name: formData.get("startup_name") as string,
      websiteUrl: formData.get("startup_website_url") as string,
      industry: formData.get("startup_industry") as string,
      description: formData.get("startup_description") as string,
      logoUrl: currentStartupLogoUrl,
      founderName: formData.get("startup_foundername") as string,
      location: formData.get("startup_location") as string,
      coordinates: currentStartupLocationData,
      contactInfo: formData.get("startup_contact") as string,
      stage: formData.get("startup_stage") as string,
      foundedDate: new Date(formData.get("startup_founded") as string),
    };

    if (mode === "create") {
      await createStartup(data);
    } else {
      await updateStartup(startup?.id!, data);
    }
    const modal = document.getElementById("startup_details_modal") as HTMLDialogElement;
    modal.close();
    router.refresh();
    // TODO: loading/submitting state
  }

  return (
    <dialog id="startup_details_modal" className="modal">
      <div className="modal-box max-w-3xl">
        <h3 className="text-lg font-bold">{capitalize(mode)} startup</h3>
        <form action={submitForm} className="grid grid-cols-3 gap-x-2 gap-y-1">
          <TextInputField
            label="Startup name"
            name="startup_name"
            placeholder="Mugnavo"
            value={currentStartupName}
            onChange={setCurrentStartupName}
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
            defaultValue={startup?.description ?? undefined}
            disabled={!editable}
            textarea
          />
          <div className="form-control">
            <div className="label">
              <span className="label-text">Logo</span>
            </div>
            <Image
              src={currentStartupLogoUrl || placeholderImageUrl}
              alt="Startup logo"
              width={512}
              height={512}
              className="rounded-lg"
            />
            {editable && (
              <UploadDropzone
                className="h-1"
                config={{ mode: "auto" }}
                endpoint="imageUploader"
                onClientUploadComplete={(e) => {
                  setCurrentStartupLogoUrl(e[0].url);
                }}
              />
            )}
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
            <span className="test">{currentStartupLocationData?.name}</span>
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
            name="startup_founded"
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
  value,
  onChange,
  date,
}: {
  label: string;
  name: string;
  placeholder: string;
  defaultValue?: string;
  value?: string;
  disabled?: boolean;
  textarea?: boolean;
  date?: boolean;
  onChange?: (value: string) => void;
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
          value={value}
          disabled={disabled}
          rows={4}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          className="textarea textarea-bordered textarea-sm h-full p-2 leading-snug"
        />
      ) : (
        <input
          type={date ? "date" : "text"}
          placeholder={placeholder}
          name={name}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          className="input input-sm input-bordered w-full max-w-xs"
        />
      )}
    </label>
  );
}
