"use client";
import React from "react";
import { motion } from "framer-motion";
import { Filter, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/job-card";

// Mock data for demonstration
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

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="flex-1 flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              All Jobs
            </Button>
            <Button variant="ghost">Remote</Button>
            <Button variant="ghost">Full-time</Button>
            <Button variant="ghost">Part-time</Button>
            <Button variant="ghost">Contract</Button>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <SortAsc className="h-4 w-4" />
            Sort by: Latest
          </Button>
        </motion.div>

        {/* Job Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockJobs.map((job, index) => (
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
