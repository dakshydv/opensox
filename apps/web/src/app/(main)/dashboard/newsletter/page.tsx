"use client";
import NewsletterList from "@/components/newsletter/newsletter-list";
import { useSubscription } from "@/hooks/useSubscription";
import { getAllNewslettersSorted } from "@/lib/newsletters";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function NewsletterPage() {
  const items = getAllNewslettersSorted();
  const { isPaidUser, isLoading } = useSubscription();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return items;
    return items.filter((it) => {
      const hay = `${it.title} ${it.excerpt ?? ""} ${it.content}`;
      return hay.includes(q);
    });
  }, [items, query]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#101010] flex items-center justify-center text-white">
        <p>loading...</p>
      </div>
    );
  }

  if (!isPaidUser) {
    return (
      <div className="p-6 min-h-screen md:h-[88vh] rounded-lg mx-1 md:mx-4 bg-ox-black-1 relative">
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">
          <div className="max-w-lg w-full mx-4 bg-ox-black-2 border border-ox-gray rounded-lg p-6 text-center">
            <h2 className="text-2xl font-semibold text-ox-white mb-2">
              Premium only
            </h2>
            <p className="text-ox-white/80 mb-4">
              Newsletters are available for premium subscribers only. Upgrade to
              access exclusive content and weekly insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-4 py-2 bg-ox-purple-2 text-black rounded-md font-medium"
              >
                Upgrade to Premium
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-4 py-2 border border-ox-gray rounded-md text-ox-white/90"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen md:h-[88vh] rounded-lg mx-1 md:mx-4 bg-ox-black-1 ">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold text-ox-purple-2">Newsletter</h1>
        <p className="text-ox-white mt-2">
          stay updated with the latest from opensox.ai
        </p>
      </header>
      <main>
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="w-full md:w-1/2">
            <label className="sr-only" htmlFor="newsletter-search">
              Search newsletters
            </label>
            <div className="relative">
              <input
                id="newsletter-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, excerpt or content..."
                className="w-full bg-[#0b0b0c] border border-[#222] rounded-md px-3 py-2 text-ox-white placeholder:opacity-60 focus:outline-none focus:ring-2 focus:ring-ox-purple"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-ox-white/70 hover:text-ox-white"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          <div className="md:flex-1 text-ox-white/80 text-sm">
            {filtered.length} result{filtered.length === 1 ? "" : "s"}
          </div>
        </div>
        <NewsletterList items={filtered} />
      </main>
    </div>
  );
}
