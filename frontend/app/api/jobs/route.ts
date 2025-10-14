import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const qs = req.nextUrl.searchParams;
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

    // If a live backend is configured, proxy through it
    if (backend) {
      const url = `${backend}/jobs${qs.toString() ? `?${qs.toString()}` : ""}`;
      const r = await fetch(url, { cache: "no-store" });
      if (!r.ok) return NextResponse.json({ error: `Upstream ${r.status}` }, { status: r.status });
      const data = await r.json();
      return NextResponse.json(data, { status: 200 });
    }

    // Otherwise, call Scrapingdog directly from server (requires SCRAPINGDOG_API_KEY in env)
    const apiKey = process.env.SCRAPINGDOG_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "SCRAPINGDOG_API_KEY not set" }, { status: 500 });

    // Map our query to Scrapingdog /jobs params
    const params = new URLSearchParams();
    params.set("api_key", apiKey);
    const field = qs.get("field");
    const location = qs.get("location");
    const geoid = qs.get("geoid");
    const exp = qs.get("exp_level");
    const page = qs.get("page") || "1";
    const sortRaw = (qs.get("sort_by") || "").toLowerCase();
    const sortMap: Record<string, string> = { dd: "day", day: "day", week: "week", month: "month" };
    if (field && field.trim()) params.set("field", field.trim()); else params.set("field", "jobs");
    if (location && location.trim()) params.set("location", location.trim());
    if (!location && geoid) params.set("geoid", geoid);
    if (!params.has("location") && !params.has("geoid")) params.set("geoid", "92000000");
    params.set("page", page);
    if (sortMap[sortRaw]) params.set("sort_by", sortMap[sortRaw]);
    if (exp && exp.trim()) {
      const expMap: Record<string, string> = { "1": "internship", "2": "entry_level", "3": "associate", "4": "mid_senior_level", "5": "director" };
      const mapped = exp.split(",").map(s => expMap[String(s).trim()]).filter(Boolean);
      if (mapped.length) params.set("exp_level", mapped.join(","));
    }

    const url = `https://api.scrapingdog.com/jobs?${params.toString()}`;
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) return NextResponse.json({ error: `Upstream ${r.status}` }, { status: r.status });
    const data = await r.json();

    const raw = Array.isArray(data) ? data : Array.isArray((data as any)?.jobs) ? (data as any).jobs : [];
    const jobs = raw.map((j: any, idx: number) => ({
      id: String(j.job_id || j.id || idx),
      title: j.job_position || j.title || "Job",
      company: j.company_name || j.company || "Company",
      location: j.job_location || j.location || "—",
      salary: j.salary || j.pay || "—",
      type: j.job_type || j.employment_type || "—",
      posted: j.job_posting_date || j.posted_time || "Recently",
      description: j.description || j.snippet || "",
      rating: j.rating || undefined,
      isRemote: /remote/i.test(String(j.location || j.job_location || "")) || false,
      isFeatured: false,
      matchPercent: j.match || j.score || undefined,
      applyUrl: j.job_link || j.job_url || j.url || undefined,
      logo: j.company_logo || undefined,
    }));

    return NextResponse.json({ jobs }, { status: 200 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Proxy failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


