
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-pulse space-y-6"
    >
      <div className="h-8 w-64 rounded bg-slate-200" />
      <div className="h-4 w-full max-w-2xl rounded bg-slate-200" />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-48 rounded-2xl bg-slate-200" />
        <div className="h-48 rounded-2xl bg-slate-200" />
      </div>

      <span className="sr-only">Loading application...</span>
    </div>
  );
}