"use client";
import React from "react";

type Testimonial = {
  name: string;
  title: string;
  quote: string;
  avatar?: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Kenny Mendes",
    title: "HR Leader in Tech, Chief People Officer @ Grammarly",
    quote:
      "Job seekers have had to rely on tools that are decades old, while Jobs Search leverages modern AI to offer personalized guidance through the entire job search process—making it easier and faster to land interviews.",
  },
  {
    name: "Alex Xu",
    title: "Author of System Design Interview – Amazon Bestseller",
    quote:
      "In my interactions with hundreds of interviewees, many express how confusing the job search can be. Jobs Search streamlines the process, helping candidates present their skills and land interviews more efficiently.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* shared grid background layer */}
      <div className="absolute inset-0 bg-grid-subtle" />
      {/* top gradient blend from previous section */}
      <div className="pointer-events-none absolute -top-10 left-0 right-0 h-16 bg-gradient-to-b from-background/0 to-background/0" />
      {/* localized green glow behind heading */}
      <div className="container mx-auto px-4 relative">
        <div className="rounded-[32px] md:rounded-[40px] border border-border/60 bg-secondary/20 backdrop-blur-md p-6 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
            <div className="md:col-span-5 relative">
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
              <h3 className="relative font-heading text-3xl md:text-5xl font-semibold leading-tight bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
                Trusted by
                <br className="hidden md:block" /> Industry Leaders
              </h3>
            </div>
            <div className="md:col-span-7 flex flex-col gap-6">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="rounded-3xl border border-border/60 bg-background/70 text-foreground p-5 md:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs md:text-sm text-muted-foreground">{t.title}</div>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-secondary/40 border border-border/60 overflow-hidden" />
                      <div className="font-semibold text-foreground">{t.name}</div>
                    </div>
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground">
                    {t.quote}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* bottom soften (transparent to allow continuous grid) */}
      <div className="pointer-events-none absolute -bottom-10 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-transparent" />
    </section>
  );
}


