"use client";
import React from "react";

export function GreenBand() {
  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      <div className="absolute inset-0 bg-grid-subtle" />
      <div className="container mx-auto px-4 relative">
        <div className="h-28 md:h-40 rounded-[28px] md:rounded-[36px] w-full bg-gradient-to-r from-emerald-400/40 via-emerald-400/30 to-emerald-400/40 shadow-[0_20px_60px_rgba(0,0,0,0.25)]" />
      </div>
    </section>
  );
}


