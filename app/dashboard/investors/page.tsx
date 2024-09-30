"use client";

import { Expand, MoveLeft, MoveRight, Search, SquarePen, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InvestorDetailsModal from "~/components/modals/investor-details";

import { investorControllerDelete, investorControllerGetAll } from "~/lib/api";
import { Investor } from "~/lib/schemas";
import { withAuth } from "~/lib/utils";

export default function InvestorsCrud() {
  const router = useRouter();
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = Math.ceil(investors.length / 10); // Number of records per page
  const [searchValue, setSearchValue] = useState<string>("");

  async function fetchInvestors() {
    const result = await investorControllerGetAll();
    if (result.data) {
      setInvestors(result.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    fetchInvestors();
  }, []);

  // modal controls
  const [selectedInvestor, setSelectedInvestor] = useState<number>();
  const [editing, setEditing] = useState<boolean>(false);

  function openCreateInvestor() {
    setSelectedInvestor(undefined);
    setEditing(true);
    openModal();
  }

  function openEditInvestor(index: number) {
    setSelectedInvestor(index);
    setEditing(true);
    openModal();
  }

  function openViewInvestor(index: number) {
    setSelectedInvestor(index);
    setEditing(false);
    openModal();
  }

  function onDeleteInvestor(investorId: number) {
    investorControllerDelete(investorId, withAuth);
    fetchInvestors();
  }

  function openModal() {
    const modal = document.getElementById("investor_details_modal");
    if (modal instanceof HTMLDialogElement) {
      modal.showModal();
    }
  }

  function nextPage() {
    if (currentPage < pageSize) {
      setCurrentPage(currentPage + 1);
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  // sort first by id, then filter by name, then paginate
  const filteredInvestors = investors
    .sort((a, b) => a.id - b.id)
    .filter((investor) => investor.name.toLowerCase().includes(searchValue.toLowerCase()))
    .slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <div className="mx-auto flex h-full w-[70%] flex-col py-8">
      <InvestorDetailsModal
        editable={editing}
        investor={selectedInvestor !== undefined ? investors[selectedInvestor] : undefined}
      />
      <div className="text-3xl">Welcome</div>
      <div className="relative mt-2 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
          <Search size={15} className="text-gray-500" />
        </div>
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          type="search"
          name="search-investor"
          id="search-investor"
          className="block w-full rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
          placeholder="Search Investors"
        />
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="table table-sm">
          {/* head */}
          <thead className="bg-warning">
            <tr>
              {/* <th>ID</th> */}
              <th className="w-64">Investor Name</th>
              <th className="w-auto">Location</th>
              <th className="w-auto">Categories</th>
              <th className="w-20">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={i}>
                  <td>
                    <div className="flex h-6 w-full items-center">
                      <div className="h-2 w-2/3 animate-pulse rounded-lg bg-base-300" />
                    </div>
                  </td>
                  <td>
                    <div className="flex h-6 w-full items-center">
                      <div className="h-2 w-2/3 animate-pulse rounded-lg bg-base-300" />
                    </div>
                  </td>
                  <td>
                    <div className="flex h-6 w-full items-center">
                      <div className="h-2 w-2/3 animate-pulse rounded-lg bg-base-300" />
                    </div>
                  </td>
                  <td>
                    <div className="flex h-6 w-full items-center">
                      <div className="h-2 w-2/3 animate-pulse rounded-lg bg-base-300" />
                    </div>
                  </td>
                </tr>
              ))}
            {filteredInvestors.map((investor, index) => (
              <tr key={index}>
                <td>{investor.name}</td>
                <td className="max-w-xs truncate">{investor.locationName}</td>
                <td className="max-w-xs truncate">{investor.type}</td>
                <td className="flex gap-1.5">
                  <button
                    title="View more details"
                    onClick={() => openViewInvestor(index)}
                    className="btn btn-square btn-ghost btn-xs hover:scale-110 hover:bg-transparent"
                  >
                    <Expand />
                  </button>
                  <button
                    title="Edit"
                    onClick={() => openEditInvestor(index)}
                    className="btn btn-square btn-ghost btn-xs text-warning hover:scale-110 hover:bg-transparent"
                  >
                    <SquarePen />
                  </button>
                  <button
                    title="Delete"
                    className="btn btn-square btn-ghost btn-xs text-error hover:scale-110 hover:bg-transparent"
                    onClick={() => onDeleteInvestor(investor.id)}
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
            {!loading &&
              Array.from({ length: 10 - filteredInvestors.length }).map((_, i) => (
                <tr key={i}>
                  <td>
                    <div className="flex h-6 w-full items-center"></div>
                  </td>
                  <td>
                    <div className="flex h-6 w-full items-center"></div>
                  </td>
                  <td>
                    <div className="flex h-6 w-full items-center"></div>
                  </td>
                  <td>
                    <div className="flex h-6 w-full items-center"></div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="m-auto mt-3 flex w-full justify-between">
          <div className="ml-3 flex items-center gap-6 italic">
            {investors.length ? (
              <>
                {currentPage !== 1 && (
                  <button onClick={prevPage}>
                    <MoveLeft />
                  </button>
                )}
                {currentPage} / {pageSize}
                {currentPage !== pageSize && (
                  <button onClick={nextPage}>
                    <MoveRight />
                  </button>
                )}
              </>
            ) : (
              <>{""}</>
            )}
            &nbsp; - &nbsp; {investors.length} total
          </div>
          <button onClick={openCreateInvestor} className="btn bg-yellow-600 font-bold text-white">
            Add Investor
          </button>
        </div>
      </div>
    </div>
  );
}
