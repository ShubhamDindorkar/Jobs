"use client";
import React from "react";

export function MissionSection() {
  return (
    <section id="mission" className="relative py-10 md:py-14 overflow-hidden">
      <div className="absolute inset-0 bg-grid-subtle" />
      <div className="container mx-auto px-4 relative">
        {/* Mission */}
        <div className="mt-8 md:mt-10 text-center">
          <h3 className="font-heading text-3xl md:text-6xl font-semibold text-foreground mb-4 md:mb-6">
            Our Mission
          </h3>
          <p className="mx-auto max-w-4xl text-sm md:text-lg text-muted-foreground leading-relaxed">
            We empower you with equal opportunities to build your dream career. Applying to numerous jobs
            without a clear strategy won&apos;t lead you to your ideal role. With Jobs Search, we connect you to
            the best, most promising possibilities and guide you each step of the way so the offer you deserve
            can come sooner.
          </p>
        </div>
      </div>
    </section>
  );
}


