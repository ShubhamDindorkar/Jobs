import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
  const qs = req.nextUrl.searchParams.toString();
  const url = `${backend}/jobs${qs ? `?${qs}` : ""}`;
  try {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) {
      return NextResponse.json({ error: `Upstream ${r.status}` }, { status: r.status });
    }
    const data = await r.json();
    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Proxy failed" }, { status: 500 });
  }
}


