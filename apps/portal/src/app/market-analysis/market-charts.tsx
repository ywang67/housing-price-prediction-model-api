"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { MarketProperty } from "./types";

export default function MarketCharts({
  properties,
}: {
  properties: MarketProperty[];
}) {
  const priceByBedrooms = useMemo(() => {
    const groups = new Map<
      number,
      { total: number; count: number }
    >();

    for (const property of properties) {
      const group = groups.get(property.bedrooms) ?? {
        total: 0,
        count: 0,
      };

      group.total += property.price;
      group.count += 1;

      groups.set(property.bedrooms, group);
    }

    return Array.from(groups.entries())
      .map(([bedrooms, group]) => ({
        bedrooms: `${bedrooms} beds`,
        averagePrice: group.total / group.count,
      }))
      .sort((first, second) =>
        first.bedrooms.localeCompare(second.bedrooms),
      );
  }, [properties]);

  return (
    <div className="mb-10 grid gap-6 lg:grid-cols-2">
      <article className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="mb-4 font-semibold">
          Average Price by Bedrooms
        </h3>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priceByBedrooms} accessibilityLayer>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bedrooms" />
              <YAxis
                tickFormatter={(value: number) =>
                  `$${Math.round(value / 1000)}k`
                }
              />
              <Tooltip />
              <Bar dataKey="averagePrice" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="mb-4 font-semibold">
          Price vs Square Footage
        </h3>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="squareFootage"
                name="Square Feet"
              />
              <YAxis
                type="number"
                dataKey="price"
                name="Price"
                tickFormatter={(value: number) =>
                  `$${Math.round(value / 1000)}k`
                }
              />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter data={properties} fill="#16a34a" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </article>
    </div>
  );
}
