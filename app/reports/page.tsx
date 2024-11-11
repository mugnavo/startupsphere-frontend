"use client";

import { Download, MoveLeft, MoveRight, SquareChartGantt, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import DeleteConfirmationModal from "~/components/modals/delete-modal"; // Import the modal component
import { useSession } from "~/context/hooks"; // Import the session context
import { reportControllerDelete, reportControllerGetAllByUserId } from "~/lib/api"; // Update the import for user-specific API
import { Report } from "~/lib/schemas"; // Report schema
import { withAuth } from "~/lib/utils";

export default function ReportsPage() {
  const { user } = useSession(); // Get the current user from session
  const userId = user ? user.id : null; // Get user ID
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = Math.ceil(reports.length / 10); // Number of records per page
  const [isModalOpen, setModalOpen] = useState(false); // State to manage modal visibility
  const [reportToDelete, setReportToDelete] = useState<number | null>(null); // Track which report to delete

  async function fetchReports() {
    if (!userId) {
      console.error("User not authenticated.");
      return;
    }

    setLoading(true);
    try {
      const result = await reportControllerGetAllByUserId(userId, withAuth); // Fetch reports for the current user
      if (result.data) {
        setReports(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      // Handle error (e.g., show a notification)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userId) {
      fetchReports();
    }
  }, [userId]);

  function onDeleteReport(reportId: number) {
    reportControllerDelete(reportId, withAuth);
    fetchReports();
  }

  function downloadReport(reportId: number) {
    // Add your download logic here
    console.log(`Downloading report with ID: ${reportId}`);
  }

  // Open the modal for confirmation
  const handleOpenModal = (reportId: number) => {
    setReportToDelete(reportId);
    setModalOpen(true);
  };

  // Pagination logic
  const filteredReports = reports.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <div className="mx-auto flex h-full w-[70%] flex-col py-8">
      <div className="mb-4 flex flex-col items-start">
        <h1 className="flex items-center text-2xl font-bold">
          <SquareChartGantt className="mr-2 h-6 w-6 text-[#1E1E1E]" />
          Reports
        </h1>
        <span className="text-sm text-gray-500">Total of {reports.length} reports</span>
      </div>

      {/* Table */}
      <div className="flex flex-col items-start justify-center bg-white shadow-custom">
        <table className="table table-sm w-full">
          {/* Head */}
          <thead className="bg-[#004A98]">
            <tr className="text-white">
              <th className="w-auto">URL</th>
              <th className="w-auto">Date Generated</th>
              <th className="w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={i}>
                  <td>
                    <div className="h-2 w-2/3 animate-pulse rounded-lg bg-base-300" />
                  </td>
                  <td>
                    <div className="h-2 w-2/3 animate-pulse rounded-lg bg-base-300" />
                  </td>
                  <td>
                    <div className="h-2 w-2/3 animate-pulse rounded-lg bg-base-300" />
                  </td>
                </tr>
              ))
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center">
                  No reports available.
                </td>
              </tr>
            ) : (
              filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>
                    {/* Assuming report.url is the URL you want to display */}
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => console.log("TODO OPEN MODAL")}
                    >
                      {report.name}
                    </button>
                  </td>
                  <td>{new Date(report.timestamp).toLocaleDateString()}</td>
                  <td className="flex gap-1.5">
                    <button
                      title="Download"
                      onClick={() => downloadReport(report.id)}
                      className="btn btn-square btn-ghost btn-xs text-success hover:scale-110 hover:bg-transparent"
                    >
                      <Download />
                    </button>
                    <button
                      title="Remove"
                      className="btn btn-square btn-ghost btn-xs text-error hover:scale-110 hover:bg-transparent"
                      onClick={() => handleOpenModal(report.id)} // Open the modal on click
                    >
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="m-auto mt-3 flex w-full justify-between">
        <div className="ml-3 flex items-center gap-6 italic">
          {reports.length ? (
            <>
              {currentPage > 1 && (
                <button onClick={() => setCurrentPage(currentPage - 1)}>
                  <MoveLeft />
                </button>
              )}
              {currentPage} / {pageSize}
              {currentPage < pageSize && (
                <button onClick={() => setCurrentPage(currentPage + 1)}>
                  <MoveRight />
                </button>
              )}
            </>
          ) : (
            <>{""}</>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && reportToDelete !== null && (
        <DeleteConfirmationModal
          onDelete={() => {
            onDeleteReport(reportToDelete);
            setModalOpen(false);
            setReportToDelete(null);
          }}
          onClose={() => {
            setModalOpen(false);
            setReportToDelete(null);
          }}
        />
      )}
    </div>
  );
}
