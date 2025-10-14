"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spotlight } from "@/components/ui/spotlight-new";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setErrorMsg(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;
      // Redirect on success
      if (typeof window !== "undefined") {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setErrorMsg(err instanceof Error ? err.message : "Sign in failed");
      // Optionally surface a user-friendly message
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined,
          queryParams: { prompt: "consent" },
        },
      });
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-background">
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

      <div className="relative z-10 min-h-dvh flex items-center justify-center px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4"
          >
            <Link href="/">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-4"
          >
            <h1 className="font-luxury text-4xl md:text-5xl text-foreground mb-4 dreamy-text-shadow">
              Welcome <span className="text-primary dreamy-text-shadow-green">Back</span>
            </h1>
            <p className="text-muted-foreground">
              Sign in to your JobSearch account
            </p>
          </motion.div>

          {/* Sign In Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-background/80 backdrop-blur-md border border-border rounded-3xl p-6 dreamy-shadow"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 rounded-2xl border-border bg-background/50"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 rounded-2xl border-border bg-background/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Forgot Password */}
              <div className="text-right mt-1">
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 text-lg bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl dreamy-shadow-green"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>

          {errorMsg && (
            <p className="mt-2 text-sm text-red-500">{errorMsg}</p>
          )}

          {/* Or divider */}
          <div className="text-center text-sm text-muted-foreground">or</div>

          {/* Google Sign-in */}
          <Button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full h-10 text-base rounded-2xl border border-border bg-background text-foreground hover:bg-background/80"
          >
            Continue with Google
          </Button>
            </form>
          </motion.div>

          {/* Sign Up Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-6"
          >
            <p className="text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Sign Up
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
