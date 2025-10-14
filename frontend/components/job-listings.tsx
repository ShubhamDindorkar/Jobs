"use client";
import React from "react";
import { motion } from "framer-motion";
import { Filter, SortAsc } from "lucide-react";
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

  // Search/filter state
  const [query, setQuery] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [jobType, setJobType] = React.useState<string | undefined>(undefined); // F,P,C,T,I
  const [workType, setWorkType] = React.useState<string | undefined>(undefined); // 1,2,3
  const [sortBy, setSortBy] = React.useState("DD"); // DD (date), R (relevance)

  const fetchJobs = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const base = "/api/jobs"; // Next.js API route proxy
      const params = new URLSearchParams();
      params.set("sort_by", sortBy);
      params.set("page", "1");
      if (query.trim()) params.set("field", query.trim());
      if (location.trim()) params.set("location", location.trim());
      if (jobType) params.set("job_type", jobType);
      if (workType) params.set("work_type", workType);
      const r = await fetch(`${base}?${params.toString()}`);
      if (!r.ok) throw new Error(`Fetch failed: ${r.status}`);
      const data = await r.json();
      const next = Array.isArray(data?.jobs) ? data.jobs : [];
      setJobs(next.length ? next : []);
    } catch (e: any) {
      setError(e?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [query, location, jobType, workType, sortBy]);

  React.useEffect(() => {
    fetchJobs();
  }, []); // initial load

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

        {/* Search + Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search job titles, keywords"
              className="w-full rounded-2xl border border-border bg-background/50 px-3 py-2 text-sm"
            />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location (e.g., United States)"
              className="w-full rounded-2xl border border-border bg-background/50 px-3 py-2 text-sm"
            />
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-2xl border border-border bg-background/50 px-3 py-2 text-sm"
              >
                <option value="DD">Latest</option>
                <option value="R">Relevance</option>
              </select>
              <Button onClick={fetchJobs} disabled={loading} className="rounded-2xl">
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={workType === "2" ? "default" : "outline"}
              size="sm"
              onClick={() => setWorkType(workType === "2" ? undefined : "2")}
            >
              Remote
            </Button>
            <Button
              variant={jobType === "F" ? "default" : "outline"}
              size="sm"
              onClick={() => setJobType(jobType === "F" ? undefined : "F")}
            >
              Full-time
            </Button>
            <Button
              variant={jobType === "P" ? "default" : "outline"}
              size="sm"
              onClick={() => setJobType(jobType === "P" ? undefined : "P")}
            >
              Part-time
            </Button>
            <Button
              variant={jobType === "C" ? "default" : "outline"}
              size="sm"
              onClick={() => setJobType(jobType === "C" ? undefined : "C")}
            >
              Contract
            </Button>
          </div>
        </motion.div>

        {error && (
          <div className="mb-4 text-sm text-red-500">{error}</div>
        )}

        {/* Job List (horizontal cards) */}
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {jobs.map((job, index) => (
            <JobCard key={job.id} job={job} index={index} />
          ))}
        </div>

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
