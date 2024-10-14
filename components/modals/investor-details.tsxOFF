"use client";

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Label,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useInteractiveMap } from "~/context/hooks";
import {
  investorControllerCreate,
  investorControllerUpdate,
  userControllerGetAll,
} from "~/lib/api";
import { Investor, InvestorRequest, User } from "~/lib/schemas";
import { LocationData } from "~/lib/types";
import { capitalize, placeholderImageUrl, withAuth } from "~/lib/utils";
import { UploadDropzone } from "../uploadthing";

export default function InvestorDetailsModal({
  editable = false,
  investor,
}: {
  editable: boolean;
  investor: Investor | undefined;
}) {
  // Used for Create, View, and Edit investors
  // - create = editable with undefined investor
  // - edit = editable with investor
  // - view = not editable with investor
  const mode = editable ? (investor ? "edit" : "create") : "view";

  const router = useRouter();

  const { dashboardSelection, setDashboardSelection, selectedLocation, setSelectedLocation } =
    useInteractiveMap();
  const [previewingMap, setPreviewingMap] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [investorLogoUrl, setInvestorLogoUrl] = useState<string | undefined>();
  const [investorName, setInvestorName] = useState<string | undefined>();
  const [investorLocationData, setInvestorLocationData] = useState<LocationData | undefined>();
  //   const [investorCategories, setInvestorCategories] = useState<string[]>([]);
  const [customLocationName, setCustomLocationName] = useState<string | undefined>();
  const [query, setQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<User | null>(null);
  const [managerId, setManagerId] = useState<User | undefined>();

  useEffect(() => {
    fetchUsers();
    setInvestorName(investor?.name ?? undefined);
    setInvestorLogoUrl(investor?.logoUrl ?? undefined);
    setManagerId((investor?.managerId as unknown as User) ?? undefined);
    setInvestorLocationData(
      investor
        ? {
            latitude: investor.locationLat,
            longitude: investor.locationLng,
            name: investor.locationName,
          }
        : undefined
    );
    // setInvestorCategories(investor?.categories ?? []);
    setCustomLocationName(investor?.locationName ?? undefined);
  }, [investor]);

  useEffect(() => {
    if (!dashboardSelection.active && previewingMap) {
      if (selectedLocation) {
        setInvestorLocationData(selectedLocation);
        setCustomLocationName(selectedLocation.name);
        setSelectedLocation(undefined);
      }

      const modal = document.getElementById("investor_details_modal") as HTMLDialogElement;
      modal.show();
      setPreviewingMap(false);
    }
  }, [dashboardSelection, previewingMap, selectedLocation, setSelectedLocation]);

  function previewMap(edit = false) {
    setPreviewingMap(true);

    setDashboardSelection({
      active: true,
      entityName: investorName,
      edit: edit,
      previewLocation: edit ? undefined : investorLocationData,
    });

    const modal = document.getElementById("investor_details_modal") as HTMLDialogElement;
    modal.close();
  }

  async function fetchUsers() {
    const { data } = await userControllerGetAll(withAuth);
    setUsers(data);
  }

  const filteredPeople =
    query === ""
      ? users
      : users.filter((person) => {
          return person.firstName.toLowerCase().includes(query.toLowerCase());
        });

  async function submitForm(formData: FormData) {
    if (!editable) {
      setLoading(false);
      return;
    }

    if (!investorLocationData) {
      setLoading(false);
      setError("Please select a location from the map.");
      return;
    }

    // if (investorCategories.length === 0) {
    //   setLoading(false);
    //   setError("Please select at least one category.");
    //   return;
    // }

    const data = {
      name: formData.get("investor_name") as string,
      websiteUrl: formData.get("investor_website_url") as string,
      //   categories: investorCategories,
      description: formData.get("investor_description") as string,
      logoUrl: investorLogoUrl || placeholderImageUrl,
      //   founderName: formData.get("investor_foundername") as string,
      locationName: customLocationName || "",
      locationLat: investorLocationData?.latitude as number,
      locationLng: investorLocationData?.longitude as number,
      contactInfo: formData.get("investor_contact") as string,
      type: formData.get("investor_type") as string,
      investment_focus: formData.get("investor_investment_focus") as string,
      total_funds: parseInt(formData.get("investor_total_funds") as string),
      managerId: selectedPerson?.id,
      //   foundedDate: new Date(formData.get("investor_founded") as string).toISOString(),
    } satisfies InvestorRequest;

    if (mode === "create") {
      await investorControllerCreate(data, withAuth);
    } else {
      await investorControllerUpdate(investor!.id, data, withAuth);
    }
    setLoading(false);
    const modal = document.getElementById("investor_details_modal") as HTMLDialogElement;
    modal.close();
    // TODO: proper refetch
    window.location.reload();

    // TODO: loading/submitting state
  }

  return (
    <dialog id="investor_details_modal" className="modal">
      <div className="modal-box max-w-3xl">
        <h3 className="text-lg font-bold">{capitalize(mode)} investor</h3>
        <form
          action={(formData: FormData) => {
            setError(undefined);
            setLoading(true);
            submitForm(formData);
          }}
          className="grid grid-cols-3 gap-x-2 gap-y-1"
        >
          <TextInputField
            required
            label="Investor name"
            name="investor_name"
            placeholder="Mugnavo"
            value={investorName}
            onChange={setInvestorName}
            disabled={!editable || loading}
          />
          <TextInputField
            required
            label="Website URL"
            name="investor_website_url"
            placeholder="https://mugnavo.com"
            defaultValue={investor?.websiteUrl ?? undefined}
            disabled={!editable || loading}
          />
          <TextInputField
            required
            label="Type"
            name="investor_type"
            placeholder="Accelerator"
            defaultValue={investor?.type ?? undefined}
            disabled={!editable || loading}
          />
          {/* <div className="dropdown">
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Categories</span>
              </div>
              <input
                tabIndex={0}
                role="button"
                type="text"
                name="investor_categories"
                value={investorCategories.length ? investorCategories.join(", ") : "(select)"}
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
                    checked={investorCategories.includes(sector)}
                    onChange={(e) => {
                      if (!editable || loading) return;
                      setInvestorCategories((prev) =>
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
          </div> */}

          <TextInputField
            required
            label="Description"
            name="investor_description"
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec odio nec eros ultricies fermentum."
            defaultValue={investor?.description ?? undefined}
            disabled={!editable || loading}
            textarea
          />
          <div className="form-control">
            <div className="label">
              <span className="label-text">Logo</span>
            </div>
            <Image
              src={investorLogoUrl || placeholderImageUrl}
              alt="Investor logo"
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
                    setInvestorLogoUrl(e[0].url);
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
            label="Contact email/number"
            name="investor_contact"
            placeholder="hello@mugnavo.com"
            defaultValue={investor?.contactInfo ?? undefined}
            disabled={!editable || loading}
          />

          <TextInputField
            required
            label="Location"
            name="investor_location"
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
              {investorLocationData && (
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
                  {investorLocationData ? "Edit" : "Select"}
                </button>
              )}
            </div>
          </div>
          <TextInputField
            required
            label="Investment focus"
            name="investor_investment_focus"
            placeholder="SaaS, E-commerce, Healthtech"
            defaultValue={investor?.investment_focus ?? undefined}
            disabled={!editable || loading}
          />
          <TextInputField
            required
            label="Total funds"
            type="number"
            name="investor_total_funds"
            placeholder="150000"
            defaultValue={investor?.total_funds.toString() ?? undefined}
            disabled={!editable || loading}
          />

          <label className="form-control w-full max-w-xs">
            <Combobox
              disabled={!editable || loading}
              as="div"
              value={managerId}
              onChange={(person: User) => {
                setQuery("");
                setSelectedPerson(person);
              }}
            >
              <Label className="block text-sm font-medium leading-6 text-gray-900">
                Select Manager
              </Label>
              <div className="relative mt-2">
                <ComboboxInput
                  className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(event) => setQuery(event.target.value)}
                  onBlur={() => setQuery("")}
                  displayValue={(person: User) => person?.firstName}
                  placeholder="Select a manager"
                />
                <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </ComboboxButton>

                {filteredPeople.length > 0 && (
                  <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredPeople.map((person) => (
                      <ComboboxOption
                        key={person.id}
                        value={person}
                        className="group relative cursor-default select-none py-2 pl-8 pr-4 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                      >
                        <span className="block truncate group-data-[selected]:font-semibold">
                          {person.firstName}
                        </span>

                        <span className="absolute inset-y-0 left-0 hidden items-center pl-1.5 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      </ComboboxOption>
                    ))}
                  </ComboboxOptions>
                )}
              </div>
            </Combobox>
          </label>

          {editable && (
            <div className="modal-action col-span-full flex items-center justify-end gap-2">
              {error && <div className="text-sm text-red-500">{error}</div>}
              <button disabled={loading || uploadingImage} className="btn">
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
  type = "text",
}: {
  label: string;
  name: string;
  placeholder: string;
  defaultValue?: string;
  value?: string;
  disabled?: boolean;
  textarea?: boolean;
  type?: string;
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
          type={type}
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
