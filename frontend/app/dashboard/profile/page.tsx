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
  experience: Array<{
    id: string;
    title: string;
    company: string;
    start: string; // YYYY-MM
    end: string;   // YYYY-MM or "Present"
    description: string;
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    start: string; // YYYY-MM
    end: string;   // YYYY-MM or "Present"
  }>;
  skills: string[];
  links: {
    website?: string;
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
  preferences: {
    desiredRole?: string;
    desiredLocation?: string;
    remote?: boolean;
    salaryMin?: string;
    salaryMax?: string;
  };
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
    experience: [],
    education: [],
    skills: [],
    links: {},
    preferences: {},
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
        experience: Array.isArray(md.experience) ? md.experience : [],
        education: Array.isArray(md.education) ? md.education : [],
        skills: Array.isArray(md.skills) ? md.skills : [],
        links: md.links || {},
        preferences: md.preferences || {},
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

  const computeCompleteness = (p: ProfileData) => {
    let total = 0;
    let filled = 0;
    const check = (cond: boolean) => { total++; if (cond) filled++; };
    check(!!p.firstName.trim());
    check(!!p.lastName.trim());
    check(!!p.headline.trim());
    check(!!p.location.trim());
    check(!!p.bio.trim());
    check(!!p.resumeUrl);
    check(p.experience.length > 0);
    check(p.education.length > 0);
    check(p.skills.length > 2);
    check(!!p.links?.linkedin);
    check(!!p.preferences?.desiredRole);
    check(!!p.preferences?.desiredLocation || p.preferences?.remote === true);
    const pct = Math.round((filled / total) * 100);
    return isNaN(pct) ? 0 : pct;
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
        experience: profile.experience,
        education: profile.education,
        skills: profile.skills,
        links: profile.links,
        preferences: profile.preferences,
        completeness: computeCompleteness(profile),
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
      const objectPath = `${userId}/resume-${Date.now()}.pdf`;
      const { error: upErr } = await supabase.storage
        .from("resumes")
        .upload(objectPath, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;

      // Prefer signed URL (private bucket). If bucket is public, fall back to public URL.
      let accessibleUrl: string | undefined;
      const { data: signed, error: signErr } = await supabase.storage
        .from("resumes")
        .createSignedUrl(objectPath, 60 * 60); // 1 hour
      if (!signErr && signed?.signedUrl) {
        accessibleUrl = signed.signedUrl;
      } else {
        const { data: pub } = supabase.storage.from("resumes").getPublicUrl(objectPath);
        accessibleUrl = pub?.publicUrl;
      }

      setProfile((p) => ({ ...p, resumeUrl: accessibleUrl }));
      await supabase.auth.updateUser({ data: { resumeUrl: accessibleUrl } });
      setUploadMsg("Resume uploaded successfully.");

      // Parsing feature removed
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

            {/* Experience */}
            <div className="md:col-span-2 mt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Experience</label>
                <button
                  className="text-sm rounded-xl border border-border px-3 py-1 hover:bg-background/60"
                  onClick={() => setProfile(p => ({
                    ...p,
                    experience: [...p.experience, { id: String(Date.now()), title: "", company: "", start: "", end: "", description: "" }],
                  }))}
                >
                  Add
                </button>
              </div>
              <div className="space-y-3">
                {profile.experience.map((exp, idx) => (
                  <div key={exp.id} className="rounded-xl border border-border/60 bg-background/40 p-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input placeholder="Title" value={exp.title} onChange={(e) => setProfile(p => {
                        const copy = [...p.experience];
                        copy[idx] = { ...copy[idx], title: e.target.value };
                        return { ...p, experience: copy };
                      })} className="rounded-xl" />
                      <Input placeholder="Company" value={exp.company} onChange={(e) => setProfile(p => {
                        const copy = [...p.experience];
                        copy[idx] = { ...copy[idx], company: e.target.value };
                        return { ...p, experience: copy };
                      })} className="rounded-xl" />
                      <Input placeholder="Start (YYYY-MM)" value={exp.start} onChange={(e) => setProfile(p => {
                        const copy = [...p.experience];
                        copy[idx] = { ...copy[idx], start: e.target.value };
                        return { ...p, experience: copy };
                      })} className="rounded-xl" />
                      <Input placeholder="End (YYYY-MM or Present)" value={exp.end} onChange={(e) => setProfile(p => {
                        const copy = [...p.experience];
                        copy[idx] = { ...copy[idx], end: e.target.value };
                        return { ...p, experience: copy };
                      })} className="rounded-xl" />
                      <div className="md:col-span-2">
                        <textarea placeholder="Description" value={exp.description} onChange={(e) => setProfile(p => {
                          const copy = [...p.experience];
                          copy[idx] = { ...copy[idx], description: e.target.value };
                          return { ...p, experience: copy };
                        })} rows={3} className="w-full rounded-xl border border-border bg-background/50 px-3 py-2 text-sm outline-none" />
                      </div>
                      <div className="md:col-span-2 flex justify-end">
                        <button className="text-xs text-red-500 hover:underline" onClick={() => setProfile(p => ({
                          ...p,
                          experience: p.experience.filter(x => x.id !== exp.id),
                        }))}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="md:col-span-2 mt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Education</label>
                <button
                  className="text-sm rounded-xl border border-border px-3 py-1 hover:bg-background/60"
                  onClick={() => setProfile(p => ({
                    ...p,
                    education: [...p.education, { id: String(Date.now()), school: "", degree: "", start: "", end: "" }],
                  }))}
                >
                  Add
                </button>
              </div>
              <div className="space-y-3">
                {profile.education.map((ed, idx) => (
                  <div key={ed.id} className="rounded-xl border border-border/60 bg-background/40 p-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input placeholder="School" value={ed.school} onChange={(e) => setProfile(p => {
                        const copy = [...p.education];
                        copy[idx] = { ...copy[idx], school: e.target.value };
                        return { ...p, education: copy };
                      })} className="rounded-xl" />
                      <Input placeholder="Degree" value={ed.degree} onChange={(e) => setProfile(p => {
                        const copy = [...p.education];
                        copy[idx] = { ...copy[idx], degree: e.target.value };
                        return { ...p, education: copy };
                      })} className="rounded-xl" />
                      <Input placeholder="Start (YYYY-MM)" value={ed.start} onChange={(e) => setProfile(p => {
                        const copy = [...p.education];
                        copy[idx] = { ...copy[idx], start: e.target.value };
                        return { ...p, education: copy };
                      })} className="rounded-xl" />
                      <Input placeholder="End (YYYY-MM or Present)" value={ed.end} onChange={(e) => setProfile(p => {
                        const copy = [...p.education];
                        copy[idx] = { ...copy[idx], end: e.target.value };
                        return { ...p, education: copy };
                      })} className="rounded-xl" />
                      <div className="md:col-span-2 flex justify-end">
                        <button className="text-xs text-red-500 hover:underline" onClick={() => setProfile(p => ({
                          ...p,
                          education: p.education.filter(x => x.id !== ed.id),
                        }))}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="md:col-span-2 mt-2">
              <label className="block text-sm font-medium mb-2">Skills</label>
              <div className="flex gap-2 flex-wrap mb-2">
                {profile.skills.map((s, i) => (
                  <span key={`${s}-${i}`} className="px-2 py-1 rounded-xl border border-border text-xs">
                    {s}
                    <button className="ml-2 text-red-500" onClick={() => setProfile(p => ({ ...p, skills: p.skills.filter((x, idx) => idx !== i) }))}>×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input placeholder="Add a skill and press Enter" className="rounded-xl" onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = (e.target as HTMLInputElement).value.trim();
                    if (val) setProfile(p => ({ ...p, skills: Array.from(new Set([...p.skills, val])) }));
                    (e.target as HTMLInputElement).value = "";
                  }
                }} />
                <button className="rounded-xl border border-border px-3 py-2 text-sm" onClick={() => setProfile(p => ({ ...p, skills: [] }))}>Clear</button>
              </div>
            </div>

            {/* Links */}
            <div className="md:col-span-2 mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Website</label>
                <Input value={profile.links.website || ""} onChange={(e) => setProfile(p => ({ ...p, links: { ...p.links, website: e.target.value } }))} className="rounded-xl" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">LinkedIn</label>
                <Input value={profile.links.linkedin || ""} onChange={(e) => setProfile(p => ({ ...p, links: { ...p.links, linkedin: e.target.value } }))} className="rounded-xl" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">GitHub</label>
                <Input value={profile.links.github || ""} onChange={(e) => setProfile(p => ({ ...p, links: { ...p.links, github: e.target.value } }))} className="rounded-xl" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Twitter</label>
                <Input value={profile.links.twitter || ""} onChange={(e) => setProfile(p => ({ ...p, links: { ...p.links, twitter: e.target.value } }))} className="rounded-xl" />
              </div>
            </div>

            {/* Preferences */}
            <div className="md:col-span-2 mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Desired role</label>
                <Input value={profile.preferences.desiredRole || ""} onChange={(e) => setProfile(p => ({ ...p, preferences: { ...p.preferences, desiredRole: e.target.value } }))} className="rounded-xl" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Desired location</label>
                <Input value={profile.preferences.desiredLocation || ""} onChange={(e) => setProfile(p => ({ ...p, preferences: { ...p.preferences, desiredLocation: e.target.value } }))} className="rounded-xl" />
              </div>
              <div className="flex items-center gap-2">
                <input id="remote-ok" type="checkbox" checked={!!profile.preferences.remote} onChange={(e) => setProfile(p => ({ ...p, preferences: { ...p.preferences, remote: e.target.checked } }))} />
                <label htmlFor="remote-ok" className="text-sm">Open to remote</label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Salary min (e.g., 80000)" value={profile.preferences.salaryMin || ""} onChange={(e) => setProfile(p => ({ ...p, preferences: { ...p.preferences, salaryMin: e.target.value } }))} className="rounded-xl" />
                <Input placeholder="Salary max (e.g., 140000)" value={profile.preferences.salaryMax || ""} onChange={(e) => setProfile(p => ({ ...p, preferences: { ...p.preferences, salaryMax: e.target.value } }))} className="rounded-xl" />
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between gap-2">
            <div className="text-xs text-muted-foreground">
              Profile completeness: {computeCompleteness(profile)}%
            </div>
            <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button onClick={onSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
            </div>
          </div>
          {/* Parsing feature removed */}
        </div>
      </div>
    </main>
  );
}


