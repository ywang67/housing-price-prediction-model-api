"use client";
import { useState } from "react";

export default function EstimatorForm() {

  const [prediction, setPrediction] = useState<number | null>(null);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
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

    const response = await fetch("/api/estimates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        houses: [house],
      }),
    });

    const result: { predictions: number[] } =
    await response.json();

    setPrediction(result.predictions[0]);
  }

  const fieldClassName = "flex flex-col gap-2";

  const inputClassName = "rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

  return (
    <form
      onSubmit={handleSubmit}
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
          min="1"
          required
          className={inputClassName}
        />
      </div>

      <div className={fieldClassName}>
        <label htmlFor="bedrooms" className="font-medium text-slate-700">
          Bedrooms
        </label>
        <input
          id="bedrooms"
          name="bedrooms"
          type="number"
          min="1"
          step="1"
          required
          className={inputClassName}
      />
      </div>

      <div className={fieldClassName}>
        <label htmlFor="bathrooms" className="font-medium text-slate-700">
          Bathrooms
        </label>
        <input
          id="bathrooms"
          name="bathrooms"
          type="number"
          min="0.5"
          step="0.5"
          required
          className={inputClassName}
      />
      </div>

      <div className={fieldClassName}>
        <label htmlFor="year_built" className="font-medium text-slate-700">
          Year Built
        </label>
        <input
          id="year_built"
          name="year_built"
          type="number"
          min="1800"
          max="2026"
          step="1"
          required
          className={inputClassName}
      />
      </div>

      <div className={fieldClassName}>
        <label htmlFor="lot_size" className="font-medium text-slate-700">
          Lot Size
        </label>
        <input
          id="lot_size"
          name="lot_size"
          type="number"
          min="1"
          required
          className={inputClassName}
      />
      </div>

      <div className={fieldClassName}>
        <label htmlFor="distance_to_city_center" className="font-medium text-slate-700">
          Distance to City Center
      </label>
      <input
          id="distance_to_city_center"
          name="distance_to_city_center"
          type="number"
          min="0"
          step="0.1"
          required
          className={inputClassName}
      />
      </div>

      <div className={fieldClassName}>
        <label htmlFor="school_rating" className="font-medium text-slate-700">
          School Rating
        </label>
        <input
          id="school_rating"
          name="school_rating"
          type="number"
          min="0"
          max="10"
          step="0.1"
          required
          className={inputClassName}
      />
      </div>

      <button type="submit" className="cursor-pointer rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
        Estimate Value
      </button>

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
    </form>
  );
}