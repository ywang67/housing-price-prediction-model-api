"use client";
import { useState } from "react";

export default function EstimatorForm() {

  const [isLoading, setIsLoading] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const [errors, setErrors] = useState<FormErrors>({});
  const [prediction, setPrediction] = useState<number | null>(null);

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
    if (house.square_footage <= 0) {
      validationErrors.square_footage =
        "Square footage must be greater than 0.";
    }
    if (house.bedrooms <= 0) {
      validationErrors.bedrooms = "Bedrooms must be greater than 0.";
    }
    if (house.bathrooms <= 0) {
      validationErrors.bathrooms = "Bathrooms must be greater than 0.";
    }
    if (house.year_built < 1800 || house.year_built > 2026) {
      validationErrors.year_built = "Year built must be between 1800 and 2026.";
    }
    if (house.lot_size <= 0) {
      validationErrors.lot_size = "Lot size must be greater than 0.";
    }
    if (house.distance_to_city_center < 0) {
      validationErrors.distance_to_city_center = "Distance to city center must be a positive number.";
    }
    if (house.school_rating < 0 || house.school_rating > 10) {
      validationErrors.school_rating = "School rating must be between 0 and 10.";
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

  const fieldClassName = "flex flex-col gap-2";

  const inputClassName = "rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

  return (
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
          min="1"
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
          min="1"
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
          min="0.5"
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
          min="1800"
          max="2026"
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
          min="1"
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
            min="0"
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
          min="0"
          max="10"
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
    </form>
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
