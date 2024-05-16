"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useInteractiveMap } from "~/context/hooks";
import { startupControllerCreate, startupControllerUpdate } from "~/lib/api";
import { Startup, StartupRequest } from "~/lib/schemas";
import { LocationData } from "~/lib/types";
import { capitalize, placeholderImageUrl, sectors, withAuth } from "~/lib/utils";
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

  const { dashboardSelection, setDashboardSelection, selectedLocation, setSelectedLocation } =
    useInteractiveMap();
  const [previewingMap, setPreviewingMap] = useState(false);

  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [startupLogoUrl, setStartupLogoUrl] = useState<string | undefined>();
  const [startupName, setStartupName] = useState<string | undefined>();
  const [startupLocationData, setStartupLocationData] = useState<LocationData | undefined>();
  const [startupCategories, setStartupCategories] = useState<string[]>([]);
  const [customLocationName, setCustomLocationName] = useState<string | undefined>();

  useEffect(() => {
    setStartupName(startup?.name ?? undefined);
    setStartupLogoUrl(startup?.logoUrl ?? undefined);
    setStartupLocationData(
      startup
        ? {
            latitude: startup.locationLat,
            longitude: startup.locationLng,
            name: startup.locationName,
          }
        : undefined
    );
    setStartupCategories(startup?.categories ?? []);
    setCustomLocationName(startup?.locationName ?? undefined);
  }, [startup]);

  useEffect(() => {
    if (!dashboardSelection.active && previewingMap) {
      if (selectedLocation) {
        setStartupLocationData(selectedLocation);
        setCustomLocationName(selectedLocation.name);
        setSelectedLocation(undefined);
      }

      const modal = document.getElementById("startup_details_modal") as HTMLDialogElement;
      modal.show();
      setPreviewingMap(false);
    }
  }, [dashboardSelection, previewingMap, selectedLocation, setSelectedLocation]);

  function previewMap(edit = false) {
    setPreviewingMap(true);

    setDashboardSelection({
      active: true,
      startupName: startupName,
      edit: edit,
      previewLocation: edit ? undefined : startupLocationData,
    });

    const modal = document.getElementById("startup_details_modal") as HTMLDialogElement;
    modal.close();
  }

  async function submitForm(formData: FormData) {
    if (!editable) return;

    if (!startupLocationData) {
      setError("Please select a location from the map.");
      return;
    }

    if (startupCategories.length === 0) {
      setError("Please select at least one category.");
      return;
    }

    const data = {
      name: formData.get("startup_name") as string,
      websiteUrl: formData.get("startup_website_url") as string,
      categories: startupCategories,
      description: formData.get("startup_description") as string,
      logoUrl: startupLogoUrl || placeholderImageUrl,
      founderName: formData.get("startup_foundername") as string,
      locationName: customLocationName || "",
      locationLat: startupLocationData?.latitude as number,
      locationLng: startupLocationData?.longitude as number,
      contactInfo: formData.get("startup_contact") as string,
      foundedDate: new Date(formData.get("startup_founded") as string).toISOString(),
    } satisfies StartupRequest;

    if (mode === "create") {
      await startupControllerCreate(data, withAuth);
    } else {
      await startupControllerUpdate(startup!.id, data, withAuth);
    }
    setLoading(false);
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
        <form
          action={(formData: FormData) => {
            setLoading(true);
            submitForm(formData);
          }}
          className="grid grid-cols-3 gap-x-2 gap-y-1"
        >
          <TextInputField
            required
            label="Startup name"
            name="startup_name"
            placeholder="Mugnavo"
            value={startupName}
            onChange={setStartupName}
            disabled={!editable || loading}
          />
          <TextInputField
            required
            label="Website URL"
            name="startup_website_url"
            placeholder="https://mugnavo.com"
            defaultValue={startup?.websiteUrl ?? undefined}
            disabled={!editable || loading}
          />
          <div className="dropdown">
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Categories</span>
              </div>
              <input
                tabIndex={0}
                role="button"
                type="text"
                name="startup_categories"
                value={startupCategories.length ? startupCategories.join(", ") : "(select)"}
                readOnly
                className="input input-sm input-bordered w-full max-w-xs"
              />
            </div>
            <div
              tabIndex={0}
              className="dropdown-content form-control z-[1] mt-1 h-56 w-full overflow-y-auto rounded-xl bg-base-200 p-2 shadow"
            >
              {sectors.map((sector) => (
                <label key={sector} className="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    checked={startupCategories.includes(sector)}
                    onChange={(e) => {
                      if (!editable || loading) return;
                      setStartupCategories((prev) =>
                        e.target.checked
                          ? [...prev, sector]
                          : prev.filter((category) => category !== sector)
                      );
                    }}
                    className="checkbox-primary checkbox"
                  />
                  <span className="label-text">{sector}</span>
                </label>
              ))}
            </div>
          </div>

          <TextInputField
            required
            label="Description"
            name="startup_description"
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec odio nec eros ultricies fermentum."
            defaultValue={startup?.description ?? undefined}
            disabled={!editable || loading}
            textarea
          />
          <div className="form-control">
            <div className="label">
              <span className="label-text">Logo</span>
            </div>
            <Image
              src={startupLogoUrl || placeholderImageUrl}
              alt="Startup logo"
              width={512}
              height={512}
              className="rounded-lg"
            />
            {editable && (
              <div className="relative">
                {uploadingImage && (
                  <div className="absolute z-50 flex h-full w-full flex-col items-center justify-center gap-1 bg-base-100 text-xs">
                    <div className="loading loading-spinner" />
                    Uploading...
                  </div>
                )}

                <UploadDropzone
                  className="h-1"
                  config={{ mode: "auto" }}
                  endpoint="imageUploader"
                  onBeforeUploadBegin={(files) => {
                    setUploadingImage(true);
                    return files;
                  }}
                  onClientUploadComplete={(e) => {
                    setStartupLogoUrl(e[0].url);
                    setError(undefined);
                    setUploadingImage(false);
                  }}
                  onUploadError={() => {
                    setError("Failed to upload image.");
                    setUploadingImage(false);
                  }}
                />
              </div>
            )}
          </div>
          <TextInputField
            required
            label="Founder name"
            name="startup_foundername"
            placeholder="John Doe"
            defaultValue={startup?.founderName ?? undefined}
            disabled={!editable || loading}
          />
          <TextInputField
            required
            label="Location"
            name="startup_location"
            placeholder="IT Park, Cebu City, Cebu"
            value={customLocationName}
            onChange={setCustomLocationName}
            disabled={!editable || loading}
          />
          <div className="form-control">
            <div className="label">
              <span className="label-text">Location from map</span>
            </div>
            <div className="flex gap-2">
              {startupLocationData && (
                <button
                  disabled={loading}
                  type="button"
                  className="btn btn-sm"
                  onClick={() => previewMap()}
                >
                  Preview
                </button>
              )}

              {editable && (
                <button
                  disabled={loading}
                  type="button"
                  className="btn btn-sm"
                  onClick={() => previewMap(true)}
                >
                  {startupLocationData ? "Edit" : "Select"}
                </button>
              )}
            </div>
          </div>
          <TextInputField
            required
            label="Contact email/number"
            name="startup_contact"
            placeholder="hello@mugnavo.com"
            defaultValue={startup?.contactInfo ?? undefined}
            disabled={!editable || loading}
          />
          <TextInputField
            required
            label="Founded date"
            name="startup_founded"
            placeholder="2024/04/24"
            defaultValue={
              startup?.foundedDate
                ? new Date(startup.foundedDate).toISOString().split("T")[0]
                : undefined
            }
            disabled={!editable || loading}
            date
          />

          {editable && (
            <div className="modal-action col-span-full flex items-center justify-end gap-2">
              {error && <div className="text-sm text-red-500">{error}</div>}
              <button disabled={loading} className="btn">
                {loading && <span className="loading loading-spinner" />}
                Save
              </button>
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
  required,
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
  required?: boolean;
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
          readOnly={disabled}
          rows={4}
          required={required}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          className="textarea textarea-bordered textarea-sm h-full p-2 leading-snug"
        />
      ) : (
        <input
          type={date ? "date" : "text"}
          placeholder={placeholder}
          name={name}
          value={value}
          required={required}
          defaultValue={defaultValue}
          readOnly={disabled}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          className="input input-sm input-bordered w-full max-w-xs"
        />
      )}
    </label>
  );
}
