"use client";

import { useEffect } from "react";


export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section
      role="alert"
      className="rounded-2xl border border-red-200 bg-red-50 p-8"
    >
      <p className="text-sm font-semibold uppercase tracking-wide text-red-700">
        Application error
      </p>

      <h1 className="mt-3 text-2xl font-semibold text-slate-950">
        Something went wrong
      </h1>

      <p className="mt-3 text-slate-600">
        The application could not complete your request. Please try again.
      </p>

      <button
        type="button"
        onClick={() => unstable_retry()}
        className="mt-6 rounded-lg bg-red-700 px-4 py-2 font-medium text-white hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
      >
        Try again
      </button>
    </section>
  );
}