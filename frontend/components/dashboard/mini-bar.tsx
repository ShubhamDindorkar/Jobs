"use client";
export function MiniBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-8 h-24 rounded-md overflow-hidden bg-muted/40 flex items-end">
        <div
          className="w-full bg-primary/70"
          style={{ height: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}


