import { connection } from "next/server";
import MarketDashboard from "./market-dashboard";
import type { MarketProperty } from "./types";

type MarketStatistics = {
  propertyCount: number;
  averagePrice: number;
  minimumPrice: number;
  maximumPrice: number;
  averageSquareFootage: number;
};

const MARKET_API_URL =
  process.env.MARKET_API_URL ?? "http://127.0.0.1:8002";

export default async function MarketAnalysisPage() {
  await connection();

  const [statisticsResponse, propertiesResponse] =
  await Promise.all([
    fetch(
      `${MARKET_API_URL}/api/market/statistics`,
      { cache: "no-store" },
    ),
    fetch(
      `${MARKET_API_URL}/api/market/properties`,
      { cache: "no-store" },
    ),
  ]);

  if (!statisticsResponse.ok || !propertiesResponse.ok) {
    throw new Error("Could not load market data.");
  }

  const statistics: MarketStatistics =
    await statisticsResponse.json();

  const properties: MarketProperty[] =
    await propertiesResponse.json();

  return (
    <section>
      <h1 className="text-3xl font-bold text-slate-900">
        Property Market Analysis
      </h1>

      <p className="mt-2 text-slate-600">
        Explore aggregate statistics from the housing market.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatisticCard
          label="Properties"
          value={statistics.propertyCount.toString()}
        />

        <StatisticCard
          label="Average Price"
          value={formatCurrency(statistics.averagePrice)}
        />

        <StatisticCard
          label="Minimum Price"
          value={formatCurrency(statistics.minimumPrice)}
        />

        <StatisticCard
          label="Maximum Price"
          value={formatCurrency(statistics.maximumPrice)}
        />
      </div>
      <MarketDashboard properties={properties} />
    </section>
  );
}

function StatisticCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </p>
    </article>
  );
}

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
