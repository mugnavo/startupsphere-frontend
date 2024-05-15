"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useInteractiveMap } from "~/context/hooks";
import { startupControllerCreate, startupControllerUpdate } from "~/lib/api";
import { Startup, StartupRequest } from "~/lib/schemas";
import { LocationData } from "~/lib/types";
import { capitalize, placeholderImageUrl, withAuth } from "~/lib/utils";
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
  >(
    startup
      ? {
          latitude: startup.locationLat,
          longitude: startup.locationLat,
          name: startup.locationName,
        }
      : undefined
  );

  useEffect(() => {
    setCurrentStartupName(startup?.name ?? undefined);
    setCurrentStartupLogoUrl(startup?.logoUrl ?? undefined);
    setCurrentStartupLocationData(
      startup
        ? {
            latitude: startup.locationLat,
            longitude: startup.locationLat,
            name: startup.locationName,
          }
        : undefined
    );
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
    const data = {
      name: formData.get("startup_name") as string,
      websiteUrl: formData.get("startup_website_url") as string,
      categories: [formData.get("startup_categories") as string],
      description: formData.get("startup_description") as string,
      logoUrl: currentStartupLogoUrl || "",
      founderName: formData.get("startup_foundername") as string,
      locationName: formData.get("startup_location") as string,
      locationLat: currentStartupLocationData?.latitude as number,
      locationLng: currentStartupLocationData?.longitude as number,
      contactInfo: formData.get("startup_contact") as string,
      foundedDate: new Date(formData.get("startup_founded") as string).toISOString(),
    } satisfies StartupRequest;

    if (mode === "create") {
      await startupControllerCreate(data, withAuth);
    } else {
      await startupControllerUpdate(startup!.id, data, withAuth);
    }
    const modal = document.getElementById("startup_details_modal") as HTMLDialogElement;
    modal.close();
    // TODO: proper refetch
    window.location.reload();

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
            label="Category"
            name="startup_categories"
            placeholder="Software"
            defaultValue={startup?.categories[0] ?? undefined}
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
            defaultValue={startup?.locationName ?? undefined}
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
            label="Founded date"
            name="startup_founded"
            placeholder="2024/04/24"
            defaultValue={
              startup?.foundedDate
                ? new Date(startup.foundedDate).toISOString().split("T")[0]
                : undefined
            }
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
