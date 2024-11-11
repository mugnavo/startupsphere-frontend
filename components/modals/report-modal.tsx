"use client";

import type { Report } from "~/lib/schemas";

export default function ReportModal({ report }: { report: Report | undefined }) {
  return (
    <dialog id="report_modal" className="modal">
      <div className="modal-box max-w-4xl">
        <div className="px-3">
          <h1 className="text-3xl font-bold">Report details</h1>
          <h2 className="text-xl font-medium">{report?.name}</h2>
        </div>
        {report?.content && displayCSVAsTable(report.content)}
        <form method="dialog" className="modal-action">
          <button className="btn">close</button>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>Close</button>
      </form>
    </dialog>
  );
}
function displayCSVAsTable(csvContent: string) {
  if (!csvContent) return null;

  const rows = csvContent.trim().split("\n");
  const headers = rows[0].split(",");
  const data = rows.slice(1);

  return (
    <table className="table w-full">
      <thead>
        <tr>
          {headers.map((header, i) => (
            <th key={i}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => {
          // Parse CSV considering quoted values
          const cells = [];
          let currentCell = "";
          let inQuotes = false;

          for (let char of row) {
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === "," && !inQuotes) {
              cells.push(currentCell);
              currentCell = "";
            } else {
              currentCell += char;
            }
          }
          cells.push(currentCell); // Push the last cell

          return (
            <tr key={i}>
              {cells.map((cell, j) => (
                <td key={j}>{cell.replace(/^"|"$/g, "")}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
