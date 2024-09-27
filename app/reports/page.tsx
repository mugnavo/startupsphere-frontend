"use client";

import { Download, Trash2, MoveLeft, MoveRight } from "lucide-react";
import { useEffect, useState } from "react";
import { reportControllerDelete, reportControllerGetAllByUserId } from "~/lib/api"; // Update the import for user-specific API
import { Report } from "~/lib/schemas"; // Report schema
import { withAuth } from "~/lib/utils";
import { useSession } from "~/context/hooks"; // Import the session context

export default function ReportsPage() {
  const { user } = useSession(); // Get the current user from session
  const userId = user ? user.id : null; // Get user ID
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = Math.ceil(reports.length / 10); // Number of records per page

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

  async function onDeleteReport(reportId: number) {
    try {
      await reportControllerDelete(reportId, withAuth);
      fetchReports(); // Re-fetch reports after deletion
    } catch (error) {
      console.error("Failed to delete report:", error);
      // Handle error (e.g., show a notification)
    }
  }

  function downloadReport(reportId: number) {
    // Add your download logic here
    console.log(`Downloading report with ID: ${reportId}`);
  }

  // Pagination logic
  const filteredReports = reports.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <div className="mx-auto flex h-full w-[70%] flex-col py-8">
      <div className="mb-4 text-3xl">Reports</div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-sm w-full">
          {/* Head */}
          <thead className="bg-warning">
            <tr>
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
                    <a
                      href={report.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {report.url}
                    </a>
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
                      onClick={() => onDeleteReport(report.id)}
                    >
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
            &nbsp; - &nbsp; {reports.length} total
          </div>
        </div>
      </div>
    </div>
  );
}
