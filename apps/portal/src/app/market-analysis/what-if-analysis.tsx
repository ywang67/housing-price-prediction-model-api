"use client";

import { useState } from "react";

import type { MarketProperty } from "./types";

export default function WhatIfAnalysis({
  properties,
}: {
  properties: MarketProperty[];
}) {
  const [selectedId, setSelectedId] = useState(
    properties[0]?.id ?? 0,
  );

  const selectedProperty = properties.find(
    (property) => property.id === selectedId,
  );

  const [squareFootage, setSquareFootage] = useState(
    String(selectedProperty?.squareFootage ?? ""),
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
    setSquareFootage(
      String(property?.squareFootage ?? ""),
    );
    setPrediction(null);
  }

  async function handleSubmit(
    event: React.SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!selectedProperty) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/market/what-if", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          square_footage: Number(squareFootage),
          bedrooms: selectedProperty.bedrooms,
          bathrooms: selectedProperty.bathrooms,
          year_built: selectedProperty.yearBuilt,
          lot_size: selectedProperty.lotSize,
          distance_to_city_center:
            selectedProperty.distanceToCityCenter,
          school_rating: selectedProperty.schoolRating,
        }),
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
        className="mt-5 grid gap-4 md:grid-cols-3"
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

        <input
          type="number"
          min="1"
          required
          value={squareFootage}
          onChange={(event) =>
            setSquareFootage(event.target.value)
          }
          aria-label="What-if square footage"
          className="rounded-lg border border-slate-300 px-3 py-2"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
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
