import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Property Intelligence Portal",
    template: "%s | Property Intelligence Portal",
  },
  description:
    "Property valuation and market-analysis applications powered by a shared ML model.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
    >
      <body className="min-h-screen bg-slate-50 text-slate-950">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-semibold">
              Property Intelligence
            </Link>

            <nav
              aria-label="Primary navigation"
              className="flex items-center gap-6"
            >
              <Link
                href="/estimator"
                className="text-sm font-medium text-slate-600 hover:text-slate-950"
              >
                Value Estimator
              </Link>

              <Link
                href="/market-analysis"
                className="text-sm font-medium text-slate-600 hover:text-slate-950"
              >
                Market Analysis
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-6 py-10">
          {children}
        </main>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-6 text-sm text-slate-500">
            Property Intelligence Portal
          </div>
        </footer>
      </body>
    </html>
  );
}