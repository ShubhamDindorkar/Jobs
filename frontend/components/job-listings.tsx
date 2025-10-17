"use client";
import React from "react";
import { motion } from "framer-motion";
// removed unused icons
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/job-card";

// Mock fallback; replaced at runtime by API
const mockJobs = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    salary: "$120k - $160k",
    type: "Full-time",
    posted: "2 days ago",
    description: "We're looking for a passionate Senior Frontend Developer to join our growing team. You'll work on cutting-edge web applications using React, TypeScript, and modern development practices.",
    rating: 4.8,
    isRemote: true,
    isFeatured: true,
  },
  {
    id: "2",
    title: "Product Manager",
    company: "InnovateLab",
    location: "New York, NY",
    salary: "$100k - $140k",
    type: "Full-time",
    posted: "1 week ago",
    description: "Join our product team to drive innovation and shape the future of our platform. Experience with agile methodologies and user research required.",
    rating: 4.6,
    isRemote: false,
    isFeatured: false,
  },
  {
    id: "3",
    title: "UX Designer",
    company: "DesignStudio",
    location: "Austin, TX",
    salary: "$80k - $110k",
    type: "Full-time",
    description: "Create beautiful and intuitive user experiences. Work with cross-functional teams to design products that users love.",
    rating: 4.7,
    isRemote: true,
    isFeatured: false,
  },
  {
    id: "4",
    title: "Backend Engineer",
    company: "DataFlow",
    location: "Seattle, WA",
    salary: "$110k - $150k",
    type: "Full-time",
    posted: "3 days ago",
    description: "Build scalable backend systems using Node.js, Python, and cloud technologies. Experience with microservices architecture preferred.",
    rating: 4.5,
    isRemote: true,
    isFeatured: true,
  },
  {
    id: "5",
    title: "Marketing Specialist",
    company: "GrowthCo",
    location: "Chicago, IL",
    salary: "$60k - $80k",
    type: "Full-time",
    posted: "5 days ago",
    description: "Drive marketing campaigns and growth initiatives. Experience with digital marketing, content creation, and analytics tools.",
    rating: 4.3,
    isRemote: false,
    isFeatured: false,
  },
  {
    id: "6",
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Denver, CO",
    salary: "$100k - $130k",
    type: "Full-time",
    posted: "1 week ago",
    description: "Manage cloud infrastructure and deployment pipelines. Experience with AWS, Docker, Kubernetes, and CI/CD required.",
    rating: 4.9,
    isRemote: true,
    isFeatured: false,
  },
];

export function JobListings() {
  const [jobs, setJobs] = React.useState(mockJobs);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [lastCount, setLastCount] = React.useState<number | null>(null);
  const [lastRanAt, setLastRanAt] = React.useState<string | null>(null);

  // Search fields
  const [title, setTitle] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [level, setLevel] = React.useState<string | undefined>(undefined); // 1..5
  const [showTitleSuggestions, setShowTitleSuggestions] = React.useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = React.useState(false);

  const rolePresets = React.useMemo(
    () => [
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "React Developer",
      "Next.js Developer",
      "Node.js Engineer",
      "Data Scientist",
      "Machine Learning Engineer",
      "Product Manager",
      "UX Designer",
      "UI Designer",
      "DevOps Engineer",
      "Mobile Developer",
      "QA Engineer",
      "Security Engineer",
    ],
    []
  );

  const filteredRolePresets = React.useMemo(() => {
    const q = title.trim().toLowerCase();
    if (!q) return rolePresets;
    return rolePresets.filter((r) => r.toLowerCase().includes(q)).slice(0, 8);
  }, [title, rolePresets]);

  const locationPresets = React.useMemo(
    () => [
      "Remote",
      "Worldwide",
      "United States",
      "United Kingdom",
      "Canada",
      "European Union",
      "Germany",
      "India",
      "Australia",
      "Singapore",
      "San Francisco, CA",
      "New York, NY",
      "London, UK",
      "Berlin, DE",
    ],
    []
  );

  const filteredLocationPresets = React.useMemo(() => {
    const q = location.trim().toLowerCase();
    if (!q) return locationPresets;
    return locationPresets.filter((r) => r.toLowerCase().includes(q)).slice(0, 8);
  }, [location, locationPresets]);

  const fetchJobs = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const base = "/api/jobs"; // Next.js API route proxy
      const params = new URLSearchParams();
      params.set("sort_by", "DD");
      params.set("page", "1");
      if (location.trim()) params.set("location", location.trim());
      // Title → field (fallback to generic if empty)
      if (title.trim()) params.set("field", title.trim());
      else params.set("field", "jobs");
      // Job level (maps in backend to exp_level words)
      if (level) params.set("exp_level", level);
      const r = await fetch(`${base}?${params.toString()}`);
      if (!r.ok) throw new Error(`Fetch failed: ${r.status}`);
      const data = await r.json();
      const next = Array.isArray(data?.jobs) ? data.jobs : [] as unknown[];
      setJobs(next.length ? next : []);
      setLastCount(next.length);
      setLastRanAt(new Date().toLocaleTimeString());
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load jobs";
      setError(msg);
      setLastCount(0);
      setLastRanAt(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  }, [title, location, level]);

  // Initial load only
  React.useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <section id="jobs" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-elegant-thin text-4xl md:text-5xl text-foreground mb-4">
            Latest Job Opportunities
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover your next career move with our curated selection of top jobs from leading companies.
          </p>
        </motion.div>

        {/* Search: title, location, level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
            <div className="relative">
              <input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setShowTitleSuggestions(true);
                }}
                onFocus={() => setShowTitleSuggestions(true)}
                onBlur={() => setTimeout(() => setShowTitleSuggestions(false), 120)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    fetchJobs();
                    setShowTitleSuggestions(false);
                  }
                }}
                placeholder="Job title (e.g., React, Data)"
                className="w-full rounded-2xl border border-border bg-background/50 px-3 py-2 text-sm"
                aria-autocomplete="list"
                aria-controls="title-suggestions"
              />
              {showTitleSuggestions && (
                <div
                  id="title-suggestions"
                  className="absolute left-0 right-0 mt-1 z-20 rounded-2xl border border-border/60 bg-secondary/90 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.25)] max-h-64 overflow-y-auto"
                  role="listbox"
                >
                  {filteredRolePresets.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">No suggestions</div>
                  ) : (
                    filteredRolePresets.map((option) => (
                      <button
                        key={option}
                        type="button"
                        role="option"
                        aria-selected={false}
                        className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary/60 rounded-xl"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setTitle(option);
                          setShowTitleSuggestions(false);
                          fetchJobs();
                        }}
                      >
                        {option}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            <div className="relative">
              <input
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setShowLocationSuggestions(true);
                }}
                onFocus={() => setShowLocationSuggestions(true)}
                onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 120)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    fetchJobs();
                    setShowLocationSuggestions(false);
                  }
                }}
                placeholder="Location (e.g., United States)"
                className="w-full rounded-2xl border border-border bg-background/50 px-3 py-2 text-sm"
                aria-autocomplete="list"
                aria-controls="location-suggestions"
              />
              {showLocationSuggestions && (
                <div
                  id="location-suggestions"
                  className="absolute left-0 right-0 mt-1 z-20 rounded-2xl border border-border/60 bg-secondary/90 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.25)] max-h-64 overflow-y-auto"
                  role="listbox"
                >
                  {filteredLocationPresets.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">No suggestions</div>
                  ) : (
                    filteredLocationPresets.map((option) => (
                      <button
                        key={option}
                        type="button"
                        role="option"
                        aria-selected={false}
                        className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary/60 rounded-xl"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setLocation(option);
                          setShowLocationSuggestions(false);
                          fetchJobs();
                        }}
                      >
                        {option}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            <div className="flex items-stretch gap-3">
              <select
                value={level ?? ""}
                onChange={(e) => setLevel(e.target.value || undefined)}
                className="rounded-2xl border border-border bg-background/50 px-3 text-sm"
              >
                <option value="">Job level</option>
                <option value="1">Internship</option>
                <option value="2">Entry level</option>
                <option value="3">Associate</option>
                <option value="4">Mid-Senior</option>
                <option value="5">Director</option>
              </select>
              <Button onClick={fetchJobs} disabled={loading} className="rounded-2xl justify-center">
              {loading ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>
          {/* Live query status */}
          <div className="md:ml-4 text-xs text-muted-foreground flex items-center">
            {loading ? (
              <span>Searching…</span>
            ) : lastCount !== null ? (
              <span>
                {lastCount} result{lastCount === 1 ? "" : "s"}
                {lastRanAt ? ` • ${lastRanAt}` : ""}
              </span>
            ) : null}
          </div>
        </motion.div>

        {error && (
          <div className="mb-4 text-sm text-red-500">{error}</div>
        )}

        {/* Job List (horizontal cards) */}
        {jobs.length === 0 && !loading ? (
          <div className="rounded-2xl border border-border/60 bg-secondary/40 p-4 text-sm text-muted-foreground">
            No results. Try a broader title or a different location.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:gap-6">
            {jobs.map((job, index) => (
              <JobCard key={job.id} job={job} index={index} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button size="lg" variant="outline">
            Load More Jobs
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
