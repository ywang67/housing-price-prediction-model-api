"use client";

import { useState } from "react";

import type { MarketProperty } from "./types";
import type { FeatureRanges, House } from "../estimator/types";

type Scenario = Record<keyof House, string>;

const fields: {
  key: keyof House;
  label: string;
  step: string;
}[] = [
  { key: "square_footage", label: "Square Footage", step: "1" },
  { key: "bedrooms", label: "Bedrooms", step: "1" },
  { key: "bathrooms", label: "Bathrooms", step: "0.5" },
  { key: "year_built", label: "Year Built", step: "1" },
  { key: "lot_size", label: "Lot Size", step: "1" },
  {
    key: "distance_to_city_center",
    label: "Distance to City Center",
    step: "0.1",
  },
  { key: "school_rating", label: "School Rating", step: "0.1" },
];

function createScenario(property?: MarketProperty): Scenario {
  return {
    square_footage: String(property?.squareFootage ?? ""),
    bedrooms: String(property?.bedrooms ?? ""),
    bathrooms: String(property?.bathrooms ?? ""),
    year_built: String(property?.yearBuilt ?? ""),
    lot_size: String(property?.lotSize ?? ""),
    distance_to_city_center: String(
      property?.distanceToCityCenter ?? "",
    ),
    school_rating: String(property?.schoolRating ?? ""),
  };
}

export default function WhatIfAnalysis({
  properties,
  featureRanges,
}: {
  properties: MarketProperty[];
  featureRanges: FeatureRanges;
}) {
  const [selectedId, setSelectedId] = useState(
    properties[0]?.id ?? 0,
  );

  const selectedProperty = properties.find(
    (property) => property.id === selectedId,
  );

  const [scenario, setScenario] = useState<Scenario>(() =>
    createScenario(properties[0]),
  );

  const [prediction, setPrediction] =
    useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function selectProperty(id: number) {
    const property = properties.find(
      (item) => item.id === id,
    );

    setSelectedId(id);
    setScenario(createScenario(property));
    setPrediction(null);
    setError(null);
  }

  async function handleSubmit(
    event: React.SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!selectedProperty) {
      return;
    }

    const requestBody = Object.fromEntries(
      Object.entries(scenario).map(([key, value]) => [key, Number(value)]),
    ) as House;

    for (const field of fields) {
      const range = featureRanges[field.key];
      const value = requestBody[field.key];

      if (value < range.minimum || value > range.maximum) {
        setError(
          `${field.label} must be between ${range.minimum} and ${range.maximum}.`,
        );
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/market/what-if", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result: {
        predictions?: number[];
        detail?: string;
      } = await response.json();

      const predictedPrice = result.predictions?.[0];

      if (!response.ok || predictedPrice === undefined) {
        throw new Error(
          result.detail ?? "What-if prediction failed.",
        );
      }

      setPrediction(predictedPrice);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "What-if prediction failed.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="my-10 rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-2xl font-bold text-slate-900">
        What-if Analysis
      </h2>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <select
          value={selectedId}
          onChange={(event) =>
            selectProperty(Number(event.target.value))
          }
          className="rounded-lg border border-slate-300 px-3 py-2"
        >
          {properties.map((property) => (
            <option key={property.id} value={property.id}>
              Property {property.id}
            </option>
          ))}
        </select>

        {fields.map((field) => {
          const range = featureRanges[field.key];

          return (
            <label key={field.key} className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              {field.label}
              <input
                type="number"
                min={range.minimum}
                max={range.maximum}
                step={field.step}
                required
                value={scenario[field.key]}
                onChange={(event) =>
                  setScenario((current) => ({
                    ...current,
                    [field.key]: event.target.value,
                  }))
                }
                className="rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900"
              />
            </label>
          );
        })}

        <button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 lg:col-span-4"
        >
          {isLoading ? "Calculating..." : "Run What-if"}
        </button>
      </form>

      {error && (
        <p className="mt-4 text-red-600" role="alert">
          {error}
        </p>
      )}

      {prediction !== null && selectedProperty && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <p>
            Current price:{" "}
            <strong>
              ${selectedProperty.price.toLocaleString()}
            </strong>
          </p>

          <p>
            What-if prediction:{" "}
            <strong>${prediction.toLocaleString()}</strong>
          </p>
        </div>
      )}
    </section>
  );
}
