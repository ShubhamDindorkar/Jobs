"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { JobListings } from "@/components/job-listings";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false); // finished initial check
  const [email, setEmail] = useState<string | null>(null); // user identity
  const [waiting, setWaiting] = useState(true); // grace period for session hydration
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let redirectTimer: ReturnType<typeof setTimeout> | null = null;

    // Initial session check
    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      const currentEmail = data.session?.user?.email ?? null;
      setEmail(currentEmail);
      setChecked(true);
      // Start grace period; only redirect if still unauthenticated after it
      setWaiting(true);
      redirectTimer = setTimeout(() => {
        setWaiting(false);
        if (!currentEmail) router.replace("/signin");
      }, 1200);
    });

    // Subscribe for future changes (e.g., immediately after OAuth/sign-in)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentEmail = session?.user?.email ?? null;
      setEmail(currentEmail);
      // If session arrives during grace period, cancel redirect
      if (currentEmail && redirectTimer) {
        clearTimeout(redirectTimer);
        redirectTimer = null;
        setWaiting(false);
      }
      if (!currentEmail && !waiting) {
        router.replace("/signin");
      }
    });

    return () => {
      isMounted = false;
      if (redirectTimer) clearTimeout(redirectTimer);
      sub.subscription.unsubscribe();
    };
  }, [router]);

  if (!checked) return null; // still loading initial check
  if (waiting && !email) return null; // within grace period
  if (!email) return null; // unauthenticated after grace: redirected

  const onSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/signin");
  };

  return (
    <main className="h-dvh overflow-hidden bg-background">
      <div className="w-full h-full px-4 md:px-6 py-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-background">
        <div className="md:col-span-3">
          <Sidebar onSignOut={onSignOut} />
        </div>
        {/* Scrollable content area (middle + right) */}
        <div className="md:col-span-9 h-full overflow-y-auto pr-1 rounded-2xl border border-border/60 bg-secondary/30 backdrop-blur-md">
          <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className={showAssistant ? "md:col-span-8" : "md:col-span-12"}>
          <div className="flex items-center justify-between mb-6">
            <button className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-border/60" onClick={() => setDrawerOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
                <h1 className="font-heading text-2xl">Jobs</h1>
          <div className="flex items-center gap-3 text-sm">
                  <Button size="sm" variant="outline" onClick={() => setShowAssistant(!showAssistant)}>
                    {showAssistant ? "Hide Assistant" : "Show Assistant"}
                  </Button>
            <span className="text-muted-foreground">{email}</span>
              <Button size="sm" variant="outline" onClick={onSignOut}>Sign out</Button>
          </div>
          </div>
            {/* Filter bar */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Button variant="outline" size="sm">Remote</Button>
              <Button variant="outline" size="sm">Hybrid</Button>
              <Button variant="outline" size="sm">Full-time</Button>
              <Button variant="outline" size="sm">Intern</Button>
              <Button variant="outline" size="sm">Entry</Button>
            </div>

            {/* Jobs Feed */}
            <JobListings />
            </div>
            {showAssistant && (
              <div className="md:col-span-4 space-y-4">
                <div className="bg-secondary/40 border border-border/60 rounded-2xl p-4">
                  <h3 className="font-heading text-lg mb-2">Assistant</h3>
                  <p className="text-sm text-muted-foreground">Tips and quick actions will appear here.</p>
                </div>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 p-2">
            <div className="h-full">
              <Sidebar onSignOut={onSignOut} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


