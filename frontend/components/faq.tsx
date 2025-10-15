"use client";
import React from "react";
import { ChevronDown } from "lucide-react";

type QA = { q: string; a: React.ReactNode };

const DEFAULT_QA: QA[] = [
  {
    q: "How is Jobright different from other job platforms like LinkedIn?",
    a: (
      <>
        The most unique thing about Jobright.ai is that it accompanies you on your job search, unlike traditional job boards where you’re on your own. With Jobright, it’s like having an experienced career coach guiding you towards your next role.
      </>
    ),
  },
  {
    q: "Will Jobright share my personal information?",
    a: <>No. Your data stays private and is only used to power features you opt into.</>,
  },
  {
    q: "Is Jobright free to use?",
    a: <>Yes. Core features are free. Pro features may be offered in the future.</>,
  },
  {
    q: "Where do Jobright's job listings come from?",
    a: <>We aggregate roles from trusted sources and enrich them for relevance and quality.</>,
  },
];

export function FAQSection({ items = DEFAULT_QA }: { items?: QA[] }) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <section className="relative py-16 md:py-24 bg-secondary/30 overflow-hidden">
      {/* soft ambient glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-foreground/10 blur-3xl" />
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-12 items-start gap-8 md:gap-12">
          {/* Left title column */}
          <div className="md:col-span-5 pl-8 md:pl-20">
            <div className="font-heading font-semibold leading-none text-4xl md:text-6xl tracking-tight">
              <div className="bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">Frequently</div>
              <div className="mt-3 bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">Asked Questions</div>
            </div>
            <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-md">
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
                      className="w-full flex items-center justify-between text-left py-4 md:py-5 group"
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
                      <div className="pb-6 pl-1 text-sm md:text-base text-muted-foreground">
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


