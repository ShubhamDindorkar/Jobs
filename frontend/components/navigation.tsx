"use client";
import React from "react";
import { motion } from "framer-motion";
import { X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-6xl bg-background/80 backdrop-blur-md border-[0.5px] border-border rounded-3xl dreamy-shadow"
    >
      <div className="px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">X</span>
            </div>
            <span className="font-elegant-thin text-xl text-foreground">
              JobSearch
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="flex items-center space-x-8">
            <a
              href="#jobs"
              className="text-sm font-medium text-primary transition-colors"
            >
              Find Jobs
            </a>
            <a
              href="#companies"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Companies
            </a>
            <a
              href="#salaries"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Salaries
            </a>
            <a
              href="#careers"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Career Advice
            </a>
          </div>

              {/* Desktop Actions */}
              <div className="flex items-center space-x-4">
                <Button variant="outline" className="border-border" asChild>
                  <a href="/signin">Sign In</a>
                </Button>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                  <a href="/signup">Sign Up</a>
                </Button>
              </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border mt-4 pt-4"
          >
            <div className="py-4 space-y-4">
              <a
                href="#jobs"
                className="block text-sm font-medium text-primary transition-colors"
              >
                Find Jobs
              </a>
              <a
                href="#companies"
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Companies
              </a>
              <a
                href="#salaries"
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Salaries
              </a>
              <a
                href="#careers"
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Career Advice
              </a>
                  <div className="pt-4 space-y-2">
                    <Button variant="outline" className="w-full border-border" asChild>
                      <a href="/signin">Sign In</a>
                    </Button>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                      <a href="/signup">Sign Up</a>
                    </Button>
                  </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
