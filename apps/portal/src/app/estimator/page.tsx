import { connection } from "next/server";
import EstimatorForm from "./estimator-form";
import type { FeatureRanges } from "./types";

const PROPERTY_API_URL =
  process.env.PROPERTY_API_URL ?? "http://127.0.0.1:8001";

export default async function EstimatorPage() {
  await connection();

  const response = await fetch(`${PROPERTY_API_URL}/model-info`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Could not load model input ranges.");
  }

  const modelInfo: { feature_ranges: FeatureRanges } =
    await response.json();

  return (
    <main>
      <h1>Property Value Estimator</h1>
      <p>Estimate a property value with the Python backend.</p>

      <EstimatorForm featureRanges={modelInfo.feature_ranges} />
    </main>
  );
}
