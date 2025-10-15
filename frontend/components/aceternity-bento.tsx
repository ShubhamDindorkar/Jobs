"use client";
import React from "react";
import { Sparkles, Search, ShieldCheck, Rocket, Users2, LineChart } from "lucide-react";

type Item = { title: string; desc: string; icon: React.ReactNode };

const ITEMS: Item[] = [
  { title: "Smart Search", desc: "Find roles faster with curated filters.", icon: <Search className="h-5 w-5" /> },
  { title: "Trusted Sources", desc: "Aggregated from top job platforms.", icon: <ShieldCheck className="h-5 w-5" /> },
  { title: "Faster Apply", desc: "Jump straight to application pages.", icon: <Rocket className="h-5 w-5" /> },
  { title: "Profile First", desc: "Tell your story with a rich profile.", icon: <Users2 className="h-5 w-5" /> },
  { title: "Insights", desc: "Stay on top of market signals.", icon: <LineChart className="h-5 w-5" /> },
  { title: "Delightful UI", desc: "A calm, modern experience.", icon: <Sparkles className="h-5 w-5" /> },
];

export function AceternityBento() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-grid-subtle" />
      <div className="container mx-auto px-4 relative">
        <div className="mx-auto max-w-5xl text-center mb-10">
          <h3 className="font-heading text-2xl md:text-4xl text-foreground">Why Jobs Search</h3>
          <p className="mt-2 text-sm md:text-base text-muted-foreground">A small, elegant bento inspired by Aceternity UI.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {ITEMS.map((it, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background/60 backdrop-blur-md p-4 md:p-5 transition-transform duration-300 hover:-translate-y-1"
            >
              {/* subtle aurora glow */}
              <div className="pointer-events-none absolute -inset-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                background:
                  "radial-gradient(120px 120px at 20% 20%, hsla(142,90%,60%,.12), transparent 40%), radial-gradient(160px 120px at 80% 40%, hsla(160,90%,60%,.10), transparent 45%)",
              }} />
              <div className="relative flex items-center gap-3 mb-2">
                <div className="h-9 w-9 rounded-xl border border-border/60 bg-secondary/40 flex items-center justify-center text-foreground">
                  {it.icon}
                </div>
                <h4 className="font-medium text-foreground">{it.title}</h4>
              </div>
              <p className="relative text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


