"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spotlight } from "@/components/ui/spotlight-new";

type ProfileData = {
  firstName: string;
  lastName: string;
  headline: string;
  location: string;
  bio: string;
  resumeUrl?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    headline: "",
    location: "",
    bio: "",
  });

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const session = data.session;
      if (!session) {
        router.replace("/signin");
        return;
      }
      setEmail(session.user.email ?? null);
      setUserId(session.user.id);
      const md = session.user.user_metadata || {};
      setProfile({
        firstName: md.firstName || "",
        lastName: md.lastName || "",
        headline: md.headline || "",
        location: md.location || "",
        bio: md.bio || "",
        resumeUrl: md.resumeUrl || "",
      });
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [router]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const onSave = async () => {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        headline: profile.headline,
        location: profile.location,
        bio: profile.bio,
        resumeUrl: profile.resumeUrl || "",
      },
    });
    setSaving(false);
    if (error) {
      // noop: could show toast
      return;
    }
  };

  const onUploadResume: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setUploadErr(null);
    setUploadMsg(null);
    const maxBytes = 10 * 1024 * 1024; // 10MB
    if (file.type !== "application/pdf") {
      setUploadErr("Only PDF files are allowed.");
      return;
    }
    if (file.size > maxBytes) {
      setUploadErr("File too large. Max size is 10MB.");
      return;
    }
    setSaving(true);
    try {
      const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
      const presignResp = await fetch(`${backendBase}/storage/upload-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, contentType: file.type }),
      });
      if (!presignResp.ok) {
        const t = await presignResp.text();
        throw new Error(`Failed to get upload URL (${presignResp.status}): ${t || presignResp.statusText}`);
      }
      const { url, publicUrl } = await presignResp.json();

      const putResp = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putResp.ok) {
        const t = await putResp.text();
        throw new Error(`Upload failed (${putResp.status}): ${t || putResp.statusText}`);
      }

      setProfile((p) => ({ ...p, resumeUrl: publicUrl }));
      await supabase.auth.updateUser({ data: { resumeUrl: publicUrl } });
      setUploadMsg("Resume uploaded successfully.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed. Please try again.";
      setUploadErr(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <main className="relative min-h-dvh bg-background">
      {/* Background pattern and spotlight */}
      <div className="absolute inset-0 bg-grid-subtle" />
      <Spotlight
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(140, 85%, 70%, .10) 0, hsla(140, 70%, 45%, .04) 50%, hsla(140, 70%, 35%, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(140, 80%, 70%, .08) 0, hsla(140, 70%, 45%, .04) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(140, 80%, 70%, .06) 0, hsla(140, 70%, 35%, .03) 80%, transparent 100%)"
        fadeIn={false}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 md:py-12">
        {/* Top right pill */}
        <div className="flex items-center justify-end mb-4 md:mb-6">
          <Link href="/dashboard" className="inline-flex">
            <div className="rounded-2xl border border-border bg-background/80 px-4 py-2 text-sm text-foreground shadow-sm">
              <span className="inline-flex items-center"><ArrowLeft className="h-4 w-4 mr-2"/>Back to Dashboard</span>
            </div>
          </Link>
        </div>

        {/* Big rounded panel */}
        <div className="rounded-[24px] md:rounded-[28px] border border-border/60 bg-secondary/30 backdrop-blur-md p-5 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
          <div className="mb-4 text-center">
            <h1 className="font-heading text-2xl">Your Profile</h1>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">First name</label>
              <Input name="firstName" value={profile.firstName} onChange={onChange} className="rounded-xl" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Last name</label>
              <Input name="lastName" value={profile.lastName} onChange={onChange} className="rounded-xl" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs text-muted-foreground">Headline</label>
              <Input name="headline" value={profile.headline} onChange={onChange} className="rounded-xl" placeholder="e.g., Frontend Engineer • React, TypeScript" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs text-muted-foreground">Location</label>
              <Input name="location" value={profile.location} onChange={onChange} className="rounded-xl" placeholder="City, Country" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs text-muted-foreground">Bio</label>
              <textarea name="bio" value={profile.bio} onChange={onChange} rows={5} className="w-full rounded-xl border border-border bg-background/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs text-muted-foreground">Resume (PDF)</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={onUploadResume}
                  className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border file:border-border file:bg-background file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-background/80"
                />
                {profile.resumeUrl && (
                  <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">
                    View current resume
                  </a>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Max 10MB. Only PDF is supported.</p>
              {uploadErr && (
                <p className="mt-2 text-xs text-red-500">{uploadErr}</p>
              )}
              {uploadMsg && (
                <p className="mt-2 text-xs text-green-500">{uploadMsg}</p>
              )}
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button onClick={onSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </div>
        </div>
      </div>
    </main>
  );
}


