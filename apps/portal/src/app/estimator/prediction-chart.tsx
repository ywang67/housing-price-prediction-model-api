"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { EstimateHistoryItem } from "./types";

type PredictionChartProps = {
  history: EstimateHistoryItem[];
};

export default function PredictionChart({
  history,
}: PredictionChartProps) {
  const chartData = history
    .slice(0, 5)
    .reverse()
    .map((item, index) => ({
      name: `Estimate ${index + 1}`,
      price: item.prediction,
    }));

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="mb-4 text-lg font-semibold text-slate-800">
        Recent Estimate Comparison
      </h2>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} accessibilityLayer>
            <XAxis dataKey="name" />
            <YAxis
              tickFormatter={(value: number) =>
                `$${Math.round(value / 1000)}k`
              }
            />
            <Tooltip />
            <Bar
              dataKey="price"
              fill="#2563eb"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}