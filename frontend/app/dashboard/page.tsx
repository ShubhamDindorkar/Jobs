"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { JobListings } from "@/components/job-listings";
import { Spotlight } from "@/components/ui/spotlight-new";
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
    <main className="relative h-dvh overflow-hidden bg-background">
      {/* Background spotlight (green variant) */}
      <Spotlight
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(140, 85%, 70%, .10) 0, hsla(140, 70%, 45%, .04) 50%, hsla(140, 70%, 35%, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(140, 80%, 70%, .08) 0, hsla(140, 70%, 45%, .04) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(140, 80%, 70%, .06) 0, hsla(140, 70%, 35%, .03) 80%, transparent 100%)"
        fadeIn={false}
      />
      <div className="relative w-full h-full px-3 md:px-6 py-4 md:py-6 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 bg-background/60 backdrop-blur-[2px] overflow-x-hidden">
        <div className="hidden md:block md:col-span-3">
          <Sidebar onSignOut={onSignOut} />
        </div>
        {/* Scrollable content area (middle + right) */}
        <div className="md:col-span-9 h-full overflow-y-auto overflow-x-hidden pr-1 rounded-xl md:rounded-2xl border border-border/60 bg-secondary/30 backdrop-blur-md">
          <div className="pl-2 pr-3 py-3 md:pl-5 md:pr-6 md:py-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 -ml-1 md:-ml-2">
            <div className={showAssistant ? "md:col-span-8" : "md:col-span-12"}>
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <button className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-border/60" onClick={() => setDrawerOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
                <h1 className="font-heading text-xl md:text-2xl">Jobs</h1>
          <div className="hidden md:flex items-center gap-3 text-sm">
                  <Button size="sm" variant="outline" onClick={() => setShowAssistant(!showAssistant)}>
                    {showAssistant ? "Hide Assistant" : "Show Assistant"}
                  </Button>
            <span className="text-muted-foreground">{email}</span>
              <Button size="sm" variant="outline" onClick={onSignOut}>Sign out</Button>
          </div>
          </div>
            {/* Filter bar */}
            <div className="w-full flex flex-wrap gap-2 mb-3 md:mb-4 overflow-x-hidden">
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
                <div className="bg-secondary/40 border border-border/60 rounded-xl md:rounded-2xl p-3 md:p-4">
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


