"use client";
import React from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, DollarSign, Building2, Star, MessageCircleMore } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Button } from "@/components/ui/button";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    type: string;
    posted?: string;
    description: string;
    logo?: string;
    rating?: number;
    isRemote?: boolean;
    isFeatured?: boolean;
  };
  index: number;
}

type JobWithExtras = JobCardProps["job"] & { matchPercent?: number; applyUrl?: string };

export function JobCard({ job, index }: JobCardProps) {
  const extended = job as JobWithExtras;
  const matchPercent = extended.matchPercent ?? 74;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="relative h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-primary bg-secondary/30 backdrop-blur-sm border-border">
        <GlowingEffect proximity={72} blur={8} spread={26} glow className="opacity-70" disabled={false} />
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {job.title}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {job.company}
                  </p>
                  {job.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">
                        {job.rating}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {job.isFeatured && (
              <span className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                Featured
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="relative pt-0">
          <div className="grid grid-cols-[1fr_auto] gap-4 md:gap-6 items-center">
            <div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {job.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex items-center text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  {job.location}
                  {job.isRemote && (
                    <span className="ml-1 px-1.5 py-0.5 bg-primary text-primary-foreground rounded text-xs">
                      Remote
                    </span>
                  )}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <DollarSign className="h-3 w-3 mr-1" />
                  {job.salary}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {job.type}
                </div>
              </div>

                <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Posted {job.posted ?? "Recently"}</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="hidden md:inline-flex">
                    <MessageCircleMore className="h-4 w-4 mr-1" /> Ask AI
                  </Button>
                  <Button size="sm" className="opacity-100" asChild>
                    <a href={extended.applyUrl || "#"} target="_blank" rel="noreferrer">Apply Now</a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Match panel */}
            <div className="flex flex-col items-center justify-center rounded-xl border border-border/60 bg-secondary/40 px-4 py-5 w-48">
              <div className="relative h-20 w-20 mb-2">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(var(--color-primary) ${matchPercent * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
                  }}
                />
                <div className="absolute inset-1 rounded-full bg-background/80 border border-border/60 flex items-center justify-center">
                  <span className="text-xl font-semibold text-foreground">{matchPercent}%</span>
                </div>
              </div>
              <div className="text-[10px] tracking-wide font-semibold text-foreground mb-2">GOOD MATCH</div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Growth Opportunities</li>
                <li>• H1B Sponsor Likely</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
