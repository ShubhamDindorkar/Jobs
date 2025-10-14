"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutGrid, ListChecks, Calendar, BarChart3, Users, Settings, LogOut } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: <LayoutGrid className="h-4 w-4" /> },
  { href: "/dashboard/tasks", label: "Tasks", icon: <ListChecks className="h-4 w-4" /> },
  { href: "/dashboard/calendar", label: "Calendar", icon: <Calendar className="h-4 w-4" /> },
  { href: "/dashboard/analytics", label: "Analytics", icon: <BarChart3 className="h-4 w-4" /> },
  { href: "/dashboard/team", label: "Team", icon: <Users className="h-4 w-4" /> },
  { href: "/dashboard/profile", label: "Profile", icon: <Users className="h-4 w-4" /> },
];

export function Sidebar({ onSignOut }: { onSignOut?: () => void }) {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex md:flex-col md:w-72 bg-secondary/60 border border-border/60 backdrop-blur-md p-4 sticky top-6 h-[calc(100dvh-3rem)] overflow-y-auto rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
      <div className="text-lg font-heading mb-6">JobsSearch</div>
      <nav className="flex-1 space-y-1">
        {items.map((it) => {
          const active = pathname === it.href;
          return (
            <Link key={it.href} href={it.href} className="block">
              <div className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm ${active ? "bg-primary/15 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}>
                {it.icon}
                {it.label}
              </div>
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 grid gap-2">
        <Link href="/dashboard/settings" className="block">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50">
            <Settings className="h-4 w-4" /> Settings
          </div>
        </Link>
        <Button variant="outline" size="sm" onClick={onSignOut} className="justify-start gap-2">
          <LogOut className="h-4 w-4" /> Logout
        </Button>
      </div>
    </aside>
  );
}


