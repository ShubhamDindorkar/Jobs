"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Star, 
  Zap,
  FileText,
  Grid3X3,
  Calendar,
  Infinity,
  Smartphone,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DashboardPreview() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          {/* Dashboard Preview Container */}
          <div className="dashboard-preview p-8 relative overflow-hidden">
            {/* Left Sidebar */}
            <div className="absolute left-0 top-0 h-full w-16 bg-secondary/30 border-r border-border flex flex-col items-center py-8 space-y-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                <Infinity className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                <Grid3X3 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Main Content */}
            <div className="ml-20 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Panel - All Projects */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Infinity className="h-5 w-5 text-foreground" />
                  <h3 className="text-lg font-semibold text-foreground">All Projects</h3>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search Project"
                    className="pl-10 bg-secondary border-border"
                  />
                </div>

                {/* Project Status Tabs */}
                <div className="flex space-x-1 bg-secondary rounded-lg p-1">
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Active(07)
                  </Button>
                  <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
                    On Hold(03)
                  </Button>
                  <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
                    Closed(02)
                  </Button>
                </div>

                {/* Project List Item */}
                <div className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-foreground font-medium">ProjectFlow Pro</p>
                    <p className="text-sm text-muted-foreground">App UI Design</p>
                  </div>
                </div>
              </div>

              {/* Right Panel - CreativeSync Hub */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">CreativeSync Hub</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">WebApp/ UI Design/ Project</p>

                {/* Navigation Tabs */}
                <div className="flex space-x-1 bg-secondary rounded-lg p-1">
                  <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
                    Discussion
                  </Button>
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Tasks
                  </Button>
                  <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
                    Timelines
                  </Button>
                  <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
                    Files
                  </Button>
                  <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
                    Overview
                  </Button>
                </div>

                {/* Team Avatars */}
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 bg-primary rounded-full border-2 border-background"></div>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">+11</span>
                  <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* View Options */}
                <div className="flex space-x-2">
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Kanban
                  </Button>
                  <Button size="sm" variant="outline" className="border-border">
                    Table
                  </Button>
                  <Button size="sm" variant="outline" className="border-border">
                    List View
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    New Board
                  </Button>
                  <Button variant="outline" className="border-border">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>

                {/* Kanban Columns */}
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { title: "TO DO", count: "3" },
                    { title: "IN PROGRESS", count: "4" },
                    { title: "IN REVIEW", count: "3" },
                    { title: "COMPLETED", count: "5" }
                  ].map((column, index) => (
                    <div key={index} className="bg-secondary/30 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-sm font-medium text-foreground">{column.title}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{column.count}</span>
                      </div>
                      <Button size="sm" variant="ghost" className="w-full justify-start text-muted-foreground">
                        <Plus className="h-4 w-4 mr-2" />
                        Add task
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 right-8 space-y-4">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get 3 Free month on Pro plan
            </Button>
            <Button variant="outline" className="border-border">
              Made in Framer
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
