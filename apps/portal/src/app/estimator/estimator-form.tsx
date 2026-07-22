"use client";
import { useState } from "react";
import PredictionChart from "./prediction-chart";
import type { FeatureRanges, House } from "./types";
import useEstimateHistory from "./use-estimate-history";

export default function EstimatorForm({
  featureRanges,
}: {
  featureRanges: FeatureRanges;
}) {
  const { history, addEstimateHistory } = useEstimateHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const [errors, setErrors] = useState<FormErrors>({});
  const [prediction, setPrediction] = useState<number | null>(null);

  const [estimatedHouse, setEstimatedHouse] = useState<House | null>(null);

  const [selectedEstimateIds, setSelectedEstimateIds] = useState<string[]>([]);

  async function handleSubmit(
    event: React.SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const house = {
      square_footage: Number(formData.get("square_footage")),
      bedrooms: Number(formData.get("bedrooms")),
      bathrooms: Number(formData.get("bathrooms")),
      year_built: Number(formData.get("year_built")),
      lot_size: Number(formData.get("lot_size")),
      distance_to_city_center: Number(
        formData.get("distance_to_city_center"),
      ),
      school_rating: Number(formData.get("school_rating")),
    };

    const validationErrors: FormErrors = {};
    const labels: Record<keyof House, string> = {
      square_footage: "Square footage",
      bedrooms: "Bedrooms",
      bathrooms: "Bathrooms",
      year_built: "Year built",
      lot_size: "Lot size",
      distance_to_city_center: "Distance to city center",
      school_rating: "School rating",
    };

    for (const feature of Object.keys(house) as (keyof House)[]) {
      const value = house[feature];
      const range = featureRanges[feature];

      if (value < range.minimum || value > range.maximum) {
        validationErrors[feature] =
          `${labels[feature]} must be between ${range.minimum} and ${range.maximum}.`;
      }
    }
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    setRequestError(null);
    setPrediction(null);

    try {
      const response = await fetch("/api/estimates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          houses: [house],
        }),
      });

      const result: {
        predictions?: number[];
        detail?: string;
      } = await response.json();

      if (!response.ok || result.predictions === undefined) {
        throw new Error(result.detail ?? "Prediction failed.");
      }

      setPrediction(result.predictions[0]);
      setEstimatedHouse(house);
      addEstimateHistory(house, result.predictions[0]);
    } catch (error) {
      setRequestError(
        error instanceof Error
          ? error.message
          : "Prediction failed.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function toggleEstimate(id: string) {
    setSelectedEstimateIds((currentIds) => {
      if (currentIds.includes(id)) {
        return currentIds.filter(
          (currentId) => currentId !== id,
        );
      }

      if (currentIds.length >= 3) {
        return currentIds;
      }

      return [...currentIds, id];
    });
  }

  const fieldClassName = "flex flex-col gap-2";

  const inputClassName = "rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

  const selectedEstimates = history.filter((item) =>
    selectedEstimateIds.includes(item.id),
  );

  return (
    <>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-8 grid max-w-3xl grid-cols-1 gap-5 rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:grid-cols-2"
      >
        <div className={fieldClassName}>
          <label htmlFor="square_footage" className="font-medium text-slate-700">
            Square Footage
          </label>

          <input
            id="square_footage"
            name="square_footage"
            type="number"
            min={featureRanges.square_footage.minimum}
            max={featureRanges.square_footage.maximum}
            required
            className={inputClassName}
          />

          {errors.square_footage && (
            <p className="text-sm text-red-600" role="alert">
              {errors.square_footage}
            </p>
          )}
        </div>

        <div className={fieldClassName}>
          <label htmlFor="bedrooms" className="font-medium text-slate-700">
            Bedrooms
          </label>
          <input
            id="bedrooms"
            name="bedrooms"
            type="number"
            min={featureRanges.bedrooms.minimum}
            max={featureRanges.bedrooms.maximum}
            step="1"
            required
            className={inputClassName}
        />
          {errors.bedrooms && (
            <p className="text-sm text-red-600" role="alert">
              {errors.bedrooms}
            </p>
          )}
        </div>

        <div className={fieldClassName}>
          <label htmlFor="bathrooms" className="font-medium text-slate-700">
            Bathrooms
          </label>
          <input
            id="bathrooms"
            name="bathrooms"
            type="number"
            min={featureRanges.bathrooms.minimum}
            max={featureRanges.bathrooms.maximum}
            step="0.5"
            required
            className={inputClassName}
        />
          {errors.bathrooms && (
            <p className="text-sm text-red-600" role="alert">
              {errors.bathrooms}
            </p>
          )}
        </div>

        <div className={fieldClassName}>
          <label htmlFor="year_built" className="font-medium text-slate-700">
            Year Built
          </label>
          <input
            id="year_built"
            name="year_built"
            type="number"
            min={featureRanges.year_built.minimum}
            max={featureRanges.year_built.maximum}
            step="1"
            required
            className={inputClassName}
        />
          {errors.year_built && (
            <p className="text-sm text-red-600" role="alert">
              {errors.year_built}
            </p>
          )}
        </div>

        <div className={fieldClassName}>
          <label htmlFor="lot_size" className="font-medium text-slate-700">
            Lot Size
          </label>
          <input
            id="lot_size"
            name="lot_size"
            type="number"
            min={featureRanges.lot_size.minimum}
            max={featureRanges.lot_size.maximum}
            required
            className={inputClassName}
        />
          {errors.lot_size && (
            <p className="text-sm text-red-600" role="alert">
              {errors.lot_size}
            </p>
          )}
        </div>

        <div className={fieldClassName}>
          <label htmlFor="distance_to_city_center" className="font-medium text-slate-700">
            Distance to City Center
          </label>
          <input
              id="distance_to_city_center"
              name="distance_to_city_center"
              type="number"
              min={featureRanges.distance_to_city_center.minimum}
              max={featureRanges.distance_to_city_center.maximum}
              step="0.1"
              required
              className={inputClassName}
          />
          {errors.distance_to_city_center && (
            <p className="text-sm text-red-600" role="alert">
              {errors.distance_to_city_center}
            </p>
          )}
        </div>

        <div className={fieldClassName}>
          <label htmlFor="school_rating" className="font-medium text-slate-700">
            School Rating
          </label>
          <input
            id="school_rating"
            name="school_rating"
            type="number"
            min={featureRanges.school_rating.minimum}
            max={featureRanges.school_rating.maximum}
            step="0.1"
            required
            className={inputClassName}
        />
          {errors.school_rating && (
            <p className="text-sm text-red-600" role="alert">
              {errors.school_rating}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Estimating..." : "Estimate Value"}
        </button>

        {requestError && (
          <p className="text-red-600 sm:col-span-2" role="alert">
            {requestError}
          </p>
        )}

        {prediction !== null && (
          <section className="rounded-lg border border-green-200 bg-green-50 p-5 sm:col-span-2">
            <p className="text-sm font-medium text-green-700">
              Estimated Property Value
            </p>

            <p className="mt-1 text-3xl font-bold text-green-900">
              {prediction.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </p>
          </section>
        )}

        {prediction !== null && estimatedHouse !== null && (
          <div className="overflow-x-auto sm:col-span-2">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-200 text-slate-700">
                <tr>
                  <th className="p-3">Square Feet</th>
                  <th className="p-3">Bedrooms</th>
                  <th className="p-3">Bathrooms</th>
                  <th className="p-3">Year Built</th>
                  <th className="p-3">Prediction</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border border-slate-200 bg-white">
                  <td className="p-3">{estimatedHouse.square_footage}</td>
                  <td className="p-3">{estimatedHouse.bedrooms}</td>
                  <td className="p-3">{estimatedHouse.bathrooms}</td>
                  <td className="p-3">{estimatedHouse.year_built}</td>
                  <td className="p-3 font-semibold">
                    {prediction.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </form>
      {history.length > 0 && (
        <div className="sm:col-span-2">
          <PredictionChart history={history} />
        </div>
      )}

      {history.length > 0 && (
        <section className="overflow-x-auto sm:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">
            Estimate History
          </h2>

          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-slate-200 text-slate-700">
              <tr>
                <th className="p-3">Attempt</th>
                <th className="p-3">Compare</th>
                <th className="p-3">Date</th>
                <th className="p-3">Square Feet</th>
                <th className="p-3">Bedrooms</th>
                <th className="p-3">Bathrooms</th>
                <th className="p-3">Prediction</th>
              </tr>
            </thead>

            <tbody>
              {history.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-200 bg-white"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedEstimateIds.includes(item.id)}
                      disabled={
                        selectedEstimateIds.length >= 3 &&
                        !selectedEstimateIds.includes(item.id)
                      }
                      onChange={() => toggleEstimate(item.id)}
                      aria-label={`Compare estimate ${index + 1}`}
                      className="h-4 w-4 cursor-pointer"
                    />
                  </td>
                  <td className="p-3">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3">
                    {item.house.square_footage}
                  </td>
                  <td className="p-3">
                    {item.house.bedrooms}
                  </td>
                  <td className="p-3">
                    {item.house.bathrooms}
                  </td>
                  <td className="p-3 font-semibold">
                    {item.prediction.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {selectedEstimates.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-800">
            Property Comparison
          </h2>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {selectedEstimates.map((item, index) => (
              <article
                key={item.id}
                className="rounded-xl border border-blue-200 bg-blue-50 p-5"
              >
                <h3 className="mb-4 text-lg font-semibold text-blue-900">
                  Property {index + 1}
                </h3>

                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt>Square Feet</dt>
                    <dd>{item.house.square_footage}</dd>
                  </div>

                  <div className="flex justify-between">
                    <dt>Bedrooms</dt>
                    <dd>{item.house.bedrooms}</dd>
                  </div>

                  <div className="flex justify-between">
                    <dt>Bathrooms</dt>
                    <dd>{item.house.bathrooms}</dd>
                  </div>

                  <div className="flex justify-between">
                    <dt>Year Built</dt>
                    <dd>{item.house.year_built}</dd>
                  </div>

                  <div className="flex justify-between">
                    <dt>Lot Size</dt>
                    <dd>{item.house.lot_size}</dd>
                  </div>

                  <div className="flex justify-between">
                    <dt>Distance</dt>
                    <dd>{item.house.distance_to_city_center}</dd>
                  </div>

                  <div className="flex justify-between">
                    <dt>School Rating</dt>
                    <dd>{item.house.school_rating}</dd>
                  </div>
                </dl>

                <p className="mt-5 border-t border-blue-200 pt-4 text-xl font-bold text-blue-900">
                  {item.prediction.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

type FormErrors = {
  square_footage?: string;
  bedrooms?: string;
  bathrooms?: string;
  year_built?: string;
  lot_size?: string;
  distance_to_city_center?: string;
  school_rating?: string;
};
