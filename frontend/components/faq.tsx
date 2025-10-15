"use client";
import React from "react";
import { ChevronDown } from "lucide-react";

type QA = { q: string; a: React.ReactNode };

const DEFAULT_QA: QA[] = [
  {
    q: "How is Jobs Search different from other job platforms like LinkedIn?",
    a: (
      <>
        The most unique thing about Jobs Search is that it accompanies you on your job search, unlike traditional job boards where you’re on your own. With Jobs Search, it’s like having an experienced career coach guiding you towards your next role.
      </>
    ),
  },
  {
    q: "Will Jobs Search share my personal information?",
    a: <>No. Your data stays private and is only used to power features you opt into.</>,
  },
  {
    q: "Is Jobs Search free to use?",
    a: <>Yes. Core features are free. Pro features may be offered in the future.</>,
  },
  {
    q: "Where do Jobs Search's job listings come from?",
    a: <>We aggregate roles from trusted sources and enrich them for relevance and quality.</>,
  },
];

export function FAQSection({ items = DEFAULT_QA }: { items?: QA[] }) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* shared grid background so sections feel continuous */}
      <div className="absolute inset-0 bg-grid-subtle" />
      {/* top gradient (transparent to transparent) to avoid hard edges */}
      <div className="pointer-events-none absolute -top-10 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-transparent" />
      {/* localized glow handled near the title; corner glows removed */}
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-12 items-start gap-8 md:gap-12">
          {/* Left title column */}
          <div className="md:col-span-5 pl-8 md:pl-20 relative">
            <div className="pointer-events-none absolute left-24 top-8 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
            <div className="relative font-heading font-semibold leading-none text-4xl md:text-6xl tracking-tight">
              <div className="bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">Frequently</div>
              <div className="mt-3 bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">Asked Questions</div>
            </div>
            <p className="relative mt-4 text-sm md:text-base text-muted-foreground max-w-md">
              Everything you need to know about getting started and making the most of your search.
            </p>
          </div>

          {/* Right accordion column */}
          <div className="md:col-span-7">
            <div className="mx-auto max-w-3xl divide-y divide-border/60">
              {items.map((qa, idx) => {
                const open = openIndex === idx;
                return (
                  <div key={qa.q}>
                    <button
                      className="w-full flex items-center justify-between text-left py-4 md:py-5 px-2 group"
                      onClick={() => setOpenIndex(open ? null : idx)}
                      aria-expanded={open}
                    >
                      <span className="font-medium text-base md:text-lg text-foreground group-hover:text-primary transition-colors">
                        {qa.q}
                      </span>
                      <span className="h-8 w-8 rounded-full border border-border/60 bg-background/60 flex items-center justify-center group-hover:border-primary/60 group-hover:bg-primary/10 transition-colors">
                        <ChevronDown
                          className={`h-4 w-4 transition-transform text-foreground ${open ? "rotate-180" : ""}`}
                        />
                      </span>
                    </button>
                    {open && (
                      <div className="pb-6 pl-3 pr-2 text-sm md:text-base text-muted-foreground">
                        {qa.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


