"use client";
import React from "react";

type LogoItem = {
  key: string;
  render: React.ReactNode;
};

const linkedInLogo = (
  <div className="flex items-center gap-3 text-muted-foreground">
    <div className="h-8 w-8 rounded-[6px] bg-foreground/10 flex items-center justify-center">
      <span className="font-black text-sm">in</span>
    </div>
    <span className="font-semibold tracking-tight">LinkedIn</span>
  </div>
);

const indeedLogo = (
  <div className="flex items-center gap-2 text-muted-foreground">
    <div className="h-2.5 w-2.5 rounded-full bg-foreground/30" />
    <span className="font-semibold tracking-tight">indeed</span>
  </div>
);

const glassdoorLogo = (
  <div className="flex items-center gap-1 text-muted-foreground font-semibold">
    <span className="text-xl leading-none">g</span>
    <span className="tracking-tight">glassdoor</span>
  </div>
);

const monsterLogo = (
  <div className="flex items-center gap-1 text-muted-foreground font-semibold">
    <span className="tracking-tight">Monster</span>
  </div>
);

const ziprecruiterLogo = (
  <div className="flex items-center gap-1 text-muted-foreground font-semibold">
    <span className="tracking-tight">ZipRecruiter</span>
  </div>
);


const ITEMS: LogoItem[] = [
  { key: "linkedin", render: linkedInLogo },
  { key: "indeed", render: indeedLogo },
  { key: "glassdoor", render: glassdoorLogo },
  { key: "monster", render: monsterLogo },
  { key: "ziprecruiter", render: ziprecruiterLogo },
];

export function LogoMarquee({ inline = false }: { inline?: boolean }) {
  const row = (
    <div className="flex items-center gap-10 md:gap-16">
      {ITEMS.map((it) => (
        <div key={it.key} className="opacity-80 hover:opacity-100 transition-opacity">
          {it.render}
        </div>
      ))}
    </div>
  );

  if (inline) {
    return (
      <div className="relative overflow-hidden pt-4">
        <div className="mb-2 text-center text-xs md:text-sm text-muted-foreground">Sourcing from trusted platforms</div>
        <div className="relative">
          <div className="mask-gradient pointer-events-none absolute inset-0 z-10" />
          <div className="whitespace-nowrap will-change-transform animate-marquee flex items-center gap-10 md:gap-16">
            {row}
            {row}
            {row}
          </div>
        </div>
        <style jsx>{`
          .animate-marquee { animation: marquee 28s linear infinite; }
          @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } }
          .mask-gradient { -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%); mask-image: linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%); background: transparent; }
        `}</style>
      </div>
    );
  }

  return (
    <section className="relative py-8 md:py-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid-subtle" />
      <div className="relative container mx-auto px-4">
        <div className="mb-4 text-center text-xs md:text-sm text-muted-foreground">Sourcing from trusted platforms</div>
        <div className="relative">
          <div className="mask-gradient pointer-events-none absolute inset-0 z-10" />
          <div className="whitespace-nowrap will-change-transform animate-marquee flex items-center gap-10 md:gap-16">
            {row}
            {row}
            {row}
          </div>
        </div>
      </div>
      <style jsx>{`
        .animate-marquee { animation: marquee 28s linear infinite; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } }
        .mask-gradient { -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%); mask-image: linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%); background: transparent; }
      `}</style>
    </section>
  );
}


