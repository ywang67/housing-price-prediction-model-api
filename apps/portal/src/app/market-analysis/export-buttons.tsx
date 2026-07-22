"use client";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import type { MarketProperty } from "./types";

export default function ExportButtons({
  properties,
}: {
  properties: MarketProperty[];
}) {
  function exportCsv() {
    const rows = [
      [
        "ID",
        "Square Feet",
        "Bedrooms",
        "Bathrooms",
        "Year Built",
        "School Rating",
        "Price",
      ],
      ...properties.map((property) => [
        property.id,
        property.squareFootage,
        property.bedrooms,
        property.bathrooms,
        property.yearBuilt,
        property.schoolRating,
        property.price,
      ]),
    ];

    const csv = rows
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "market-properties.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  function exportPdf() {
    const document = new jsPDF({
      orientation: "landscape",
    });

    document.text("Property Market Analysis", 14, 15);

    autoTable(document, {
      startY: 22,
      head: [[
        "ID",
        "Square Feet",
        "Bedrooms",
        "Bathrooms",
        "Year Built",
        "School Rating",
        "Price",
      ]],
      body: properties.map((property) => [
        property.id,
        property.squareFootage,
        property.bedrooms,
        property.bathrooms,
        property.yearBuilt,
        property.schoolRating,
        `$${property.price.toLocaleString()}`,
      ]),
    });

    document.save("market-properties.pdf");
  }

  return (
    <div className="mb-6 flex gap-3">
      <button
        type="button"
        onClick={exportCsv}
        className="cursor-pointer rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
      >
        Export CSV
      </button>

      <button
        type="button"
        onClick={exportPdf}
        className="cursor-pointer rounded-lg bg-slate-700 px-4 py-2 font-semibold text-white hover:bg-slate-800"
      >
        Export PDF
      </button>
    </div>
  );
}
