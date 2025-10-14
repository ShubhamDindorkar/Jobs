"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    // Wait for Supabase to hydrate session after OAuth callback
    const waitForSession = async () => {
      const start = Date.now();
      // Fast path: subscribe as well, in case the session arrives asynchronously
      const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
        if (!cancelled && session) {
          sub.subscription.unsubscribe();
          router.replace("/dashboard");
        }
      });

      while (!cancelled && Date.now() - start < 4000) {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          sub.subscription.unsubscribe();
          router.replace("/dashboard");
          return;
        }
        await new Promise((r) => setTimeout(r, 150));
      }
      sub.subscription.unsubscribe();
      if (!cancelled) router.replace("/signin");
    };

    waitForSession();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return null;
}


