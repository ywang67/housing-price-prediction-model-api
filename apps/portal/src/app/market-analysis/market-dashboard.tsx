"use client";

import type { MarketProperty, SortKey } from "./types";
import { useMemo, useState } from "react";
import MarketCharts from "./market-charts";
import WhatIfAnalysis from "./what-if-analysis";
import ExportButtons from "./export-buttons";
import type { FeatureRanges } from "../estimator/types";

type MarketDashboardProps = {
  properties: MarketProperty[];
  featureRanges: FeatureRanges;
};

export default function MarketDashboard({
  properties,
  featureRanges,
}: MarketDashboardProps) {
    const [minimumPrice, setMinimumPrice] = useState("");
    const [maximumPrice, setMaximumPrice] = useState("");
    const [minimumBedrooms, setMinimumBedrooms] = useState("");

    const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
        return (
        (!minimumPrice ||
            property.price >= Number(minimumPrice)) &&
        (!maximumPrice ||
            property.price <= Number(maximumPrice)) &&
        (!minimumBedrooms ||
            property.bedrooms >= Number(minimumBedrooms))
        );
    });
    }, [
    properties,
    minimumPrice,
    maximumPrice,
    minimumBedrooms,
    ]);

    const [sortKey, setSortKey] = useState<SortKey>("id");
    const [sortAscending, setSortAscending] = useState(true);

    function handleSort(key: SortKey) {
        if (sortKey === key) {
            setSortAscending((current) => !current);
        } else {
            setSortKey(key);
            setSortAscending(true);
        }
    }

    const sortedProperties = useMemo(() => {
        return [...filteredProperties].sort((first, second) => {
            const difference =
            first[sortKey] - second[sortKey];

            return sortAscending ? difference : -difference;
        });
    }, [filteredProperties, sortKey, sortAscending]);

  return (
    <section className="mt-10 overflow-x-auto">
        <h2 className="mb-4 text-2xl font-bold text-slate-900">
            Market Properties
        </h2>

        <WhatIfAnalysis
          properties={properties}
          squareFootageRange={featureRanges.square_footage}
        />

        <div className="mb-6 grid gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-3">
            <input
                type="number"
                placeholder="Minimum price"
                value={minimumPrice}
                onChange={(event) => setMinimumPrice(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2"
            />

            <input
                type="number"
                placeholder="Maximum price"
                value={maximumPrice}
                onChange={(event) => setMaximumPrice(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2"
            />

            <input
                type="number"
                placeholder="Minimum bedrooms"
                value={minimumBedrooms}
                onChange={(event) =>
                setMinimumBedrooms(event.target.value)
                }
                className="rounded-lg border border-slate-300 px-3 py-2"
            />
        </div>

        <ExportButtons properties={filteredProperties} />
        <MarketCharts properties={filteredProperties} />

        <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-slate-200 text-slate-700">
                <tr>
                <th className="p-3">ID</th>
                <th className="p-3">
                    <button
                        type="button"
                        onClick={() => handleSort("squareFootage")}
                        className="cursor-pointer font-semibold"
                    >
                        Square Feet{" "}
                        {sortKey === "squareFootage"
                        ? sortAscending
                            ? "↑"
                            : "↓"
                        : ""}
                    </button>
                </th>
                <th className="p-3">Bedrooms</th>
                <th className="p-3">Bathrooms</th>
                <th className="p-3">Year Built</th>
                <th className="p-3">School Rating</th>
                <th className="p-3">
                    <button
                        type="button"
                        onClick={() => handleSort("price")}
                        className="cursor-pointer font-semibold"
                    >
                        Price{" "}
                        {sortKey === "price"
                        ? sortAscending
                            ? "↑"
                            : "↓"
                        : ""}
                    </button>
                </th>
                </tr>
            </thead>

            <tbody>
                {sortedProperties.map((property) => (
                <tr
                    key={property.id}
                    className="border-b border-slate-200 bg-white"
                >
                    <td className="p-3">{property.id}</td>
                    <td className="p-3">{property.squareFootage}</td>
                    <td className="p-3">{property.bedrooms}</td>
                    <td className="p-3">{property.bathrooms}</td>
                    <td className="p-3">{property.yearBuilt}</td>
                    <td className="p-3">{property.schoolRating}</td>
                    <td className="p-3 font-semibold">
                    {property.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                    })}
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
    </section>
  );
}
