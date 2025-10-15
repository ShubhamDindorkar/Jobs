"use client";
import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spotlight } from "@/components/ui/spotlight-new";
import { LogoMarquee } from "@/components/logo-marquee";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-start justify-center bg-background pt-36 md:pt-40">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-subtle" />
      
      {/* Spotlight Effect */}
      <Spotlight
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(142, 100%, 85%, .08) 0, hsla(142, 100%, 55%, .02) 50%, hsla(142, 100%, 45%, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(142, 100%, 85%, .06) 0, hsla(142, 100%, 55%, .02) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(142, 100%, 85%, .04) 0, hsla(142, 100%, 45%, .02) 80%, transparent 100%)"
        duration={8}
        xOffset={50}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto pt-10 md:pt-6">

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-luxury text-foreground mb-6 leading-tight">
              <span className="text-foreground dreamy-text-shadow">Find Your Dream</span><br />
              <span className="text-primary dreamy-text-shadow-green">Job</span> <span className="text-foreground dreamy-text-shadow">Today</span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Discover thousands of job opportunities from top companies worldwide. Connect with employers, showcase your skills, and land your dream career with our advanced matching technology.
            </motion.p>
          </motion.div>

          {/* Sign Up Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex justify-center items-center mb-8"
          >
            <Button className="h-14 px-12 text-lg bg-primary text-primary-foreground hover:bg-primary/90 dreamy-shadow-green" asChild>
              <a href="/signup">Sign Up Now</a>
            </Button>
          </motion.div>

          {/* Decorative line to reduce empty space */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="relative mb-10"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-px w-full max-w-3xl bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            </div>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 md:mt-20 flex flex-col sm:flex-row gap-4 justify-center items-center text-sm"
          >
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-foreground">No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-foreground">7 days free trial</span>
            </div>
          </motion.div>

          {/* Inline logo marquee */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-10"
          >
            <LogoMarquee inline />
          </motion.div>
        </div>
      </div>
    </section>
  );
}