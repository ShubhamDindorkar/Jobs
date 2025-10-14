"use client";
import { Card, CardContent } from "@/components/ui/card";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { ArrowUpRight } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  sublabel?: string;
  icon?: React.ReactNode;
};

export function StatCard({ title, value, sublabel, icon }: StatCardProps) {
  return (
    <Card className="relative bg-secondary/40 border-border/60 hover:bg-secondary/50 transition-colors">
      <GlowingEffect proximity={64} blur={6} spread={24} glow className="opacity-70" disabled={false} />
      <CardContent className="relative p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{title}</p>
            <div className="flex items-center gap-2 mt-2">
              <h3 className="text-3xl font-semibold text-foreground">{value}</h3>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            {icon}
          </div>
        </div>
        {sublabel && (
          <p className="text-xs text-muted-foreground">{sublabel}</p>
        )}
      </CardContent>
    </Card>
  );
}


