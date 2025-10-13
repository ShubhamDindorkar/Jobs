"use client";
import React from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, DollarSign, Building2, Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    type: string;
    posted: string;
    description: string;
    logo?: string;
    rating?: number;
    isRemote?: boolean;
    isFeatured?: boolean;
  };
  index: number;
}

export function JobCard({ job, index }: JobCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-primary bg-secondary/30 backdrop-blur-sm border-border hover:glow-effect">
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

        <CardContent className="pt-0">
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
            <span className="text-xs text-muted-foreground">
              Posted {job.posted}
            </span>
            <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              Apply Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
