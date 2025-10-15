"use client";
import React from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface UploadResult {
  name: string;
  path: string;
  url?: string;
}

export function ResumeUploader() {
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<UploadResult | null>(null);

  const onPick: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const next = e.target.files?.[0] || null;
    setFile(next);
    setError(null);
    setResult(null);
  };

  const upload = async () => {
    try {
      setUploading(true);
      setError(null);
      setResult(null);

      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      const userId = userData.user?.id;
      if (!userId) throw new Error("Not signed in");
      if (!file) throw new Error("Choose a file first");

      const maxBytes = 10 * 1024 * 1024; // 10 MB limit
      if (file.size > maxBytes) throw new Error("File too large (max 10MB)");

      const allowed = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowed.includes(file.type)) throw new Error("Only PDF or Word files allowed");

      const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
      const objectPath = `${userId}/${Date.now()}_${safeName}`;

      const { error: upErr } = await supabase.storage
        .from("resumes")
        .upload(objectPath, file, {
          contentType: file.type,
          upsert: false,
        });
      if (upErr) throw upErr;

      // Try to create a short-lived signed URL (falls back to public URL if bucket is public)
      let publicUrl: string | undefined;
      const { data: signed, error: signErr } = await supabase.storage
        .from("resumes")
        .createSignedUrl(objectPath, 60 * 60); // 1 hour
      if (!signErr && signed?.signedUrl) {
        publicUrl = signed.signedUrl;
      } else {
        const { data: pub } = supabase.storage.from("resumes").getPublicUrl(objectPath);
        publicUrl = pub?.publicUrl;
      }

      setResult({ name: file.name, path: objectPath, url: publicUrl });
      setFile(null);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Upload failed";
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="border border-border/60 bg-secondary/40">
      <CardHeader className="pb-3">
        <h3 className="font-heading text-lg">Upload Resume</h3>
        <p className="text-xs text-muted-foreground">PDF or Word, max 10MB. Stored securely in your account.</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <input
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={onPick}
            className="w-full rounded-2xl border border-border bg-background/50 px-3 py-2 text-sm"
          />
          <Button onClick={upload} disabled={!file || uploading} className="rounded-2xl">
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
        {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
        {result && (
          <div className="mt-3 text-sm text-muted-foreground flex items-center gap-3">
            <span>Uploaded: {result.name}</span>
            {result.url && (
              <a
                className="underline hover:no-underline text-foreground"
                href={result.url}
                target="_blank"
                rel="noreferrer"
              >
                Open
              </a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


