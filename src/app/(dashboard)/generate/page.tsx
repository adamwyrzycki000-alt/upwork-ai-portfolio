"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Textarea } from "@/components/ui";
import { Label } from "@/components/ui";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui";
import { Progress } from "@/components/ui";
import { Badge } from "@/components/ui";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  Link as LinkIcon,
  FileText,
  Image,
  FileCheck,
  Download,
  RefreshCw,
} from "lucide-react";

type Stage = "input" | "analyzing" | "searching" | "capturing" | "generating" | "composing" | "complete" | "error";

const stages: { key: Stage; label: string; progress: number }[] = [
  { key: "input", label: "Input", progress: 0 },
  { key: "analyzing", label: "Analyzing job", progress: 15 },
  { key: "searching", label: "Finding similar products", progress: 30 },
  { key: "capturing", label: "Capturing screenshots", progress: 50 },
  { key: "generating", label: "Generating descriptions", progress: 70 },
  { key: "composing", label: "Composing portfolio", progress: 90 },
  { key: "complete", label: "Complete", progress: 100 },
];

export default function GeneratePage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [inputMode, setInputMode] = useState<"url" | "text">("url");
  const [jobUrl, setJobUrl] = useState("");
  const [jobText, setJobText] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState<Stage>("input");
  const [error, setError] = useState("");

  const currentStageData = stages.find(s => s.key === currentStage);

  async function handleGenerate() {
    const inputContent = inputMode === "url" ? jobUrl : jobText;
    if (!inputContent.trim()) {
      setError("Please provide a job posting");
      return;
    }

    setLoading(true);
    setError("");
    setCurrentStage("analyzing");

    try {
      // Stage 1: Analyze the job
      setCurrentStage("analyzing");
      
      const analysisRes = await fetch("/api/portfolios/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: inputContent,
          url: inputMode === "url" ? jobUrl : null,
        }),
      });

      if (!analysisRes.ok) {
        throw new Error("Failed to analyze job posting");
      }

      const { portfolioId } = await analysisRes.json();

      // Stage 2: Search for similar products
      setCurrentStage("searching");
      
      const searchRes = await fetch(`/api/products/find?portfolioId=${portfolioId}`, {
        method: "POST",
      });

      if (!searchRes.ok) {
        throw new Error("Failed to find similar products");
      }

      // Stage 3: Capture screenshots
      setCurrentStage("capturing");
      
      const captureRes = await fetch(`/api/screenshots/capture?portfolioId=${portfolioId}`, {
        method: "POST",
      });

      if (!captureRes.ok) {
        throw new Error("Failed to capture screenshots");
      }

      // Stage 4: Generate descriptions
      setCurrentStage("generating");
      
      const generateRes = await fetch(`/api/descriptions/generate?portfolioId=${portfolioId}`, {
        method: "POST",
      });

      if (!generateRes.ok) {
        throw new Error("Failed to generate descriptions");
      }

      // Stage 5: Compose PDF
      setCurrentStage("composing");
      
      const composeRes = await fetch(`/api/portfolios/${portfolioId}/compose`, {
        method: "POST",
      });

      if (!composeRes.ok) {
        throw new Error("Failed to compose PDF");
      }

      // Complete!
      setCurrentStage("complete");
      setLoading(false);
      
      // Redirect to portfolio view
      router.push(`/portfolio/${portfolioId}`);
      
    } catch (err) {
      console.error("Generation error:", err);
      setCurrentStage("error");
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Create Portfolio</h1>
          <p className="text-muted-foreground">
            Paste an Upwork job posting and we&apos;ll generate a professional portfolio
          </p>
        </div>

        {/* Progress */}
        {loading && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">
                  {currentStageData?.progress}%
                </span>
              </div>
              <Progress value={currentStageData?.progress || 0} className="mb-4" />
              <div className="flex flex-wrap gap-2">
                {stages.map((stage, index) => {
                  const isActive = stage.key === currentStage;
                  const isPast = stages.findIndex(s => s.key === currentStage) > index;
                  return (
                    <Badge
                      key={stage.key}
                      variant={isActive ? "default" : isPast ? "success" : "secondary"}
                    >
                      {isActive && stage.key !== "complete" && (
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      )}
                      {isPast && <CheckCircle className="mr-1 h-3 w-3" />}
                      {stage.label}
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Input Card */}
        <Card>
          <CardHeader>
            <CardTitle>Job Posting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Input Mode Toggle */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant={inputMode === "url" ? "default" : "outline"}
                size="sm"
                onClick={() => setInputMode("url")}
                className="gap-2"
              >
                <LinkIcon className="h-4 w-4" />
                URL
              </Button>
              <Button
                type="button"
                variant={inputMode === "text" ? "default" : "outline"}
                size="sm"
                onClick={() => setInputMode("text")}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                Text
              </Button>
            </div>

            {/* URL Input */}
            {inputMode === "url" && (
              <div className="space-y-2">
                <Label htmlFor="jobUrl">Upwork Job URL</Label>
                <Input
                  id="jobUrl"
                  placeholder="https://www.upwork.com/ab/jobs/..."
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                />
              </div>
            )}

            {/* Text Input */}
            {inputMode === "text" && (
              <div className="space-y-2">
                <Label htmlFor="jobText">Job Description</Label>
                <Textarea
                  id="jobText"
                  placeholder="Paste the job description here..."
                  value={jobText}
                  onChange={(e) => setJobText(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Link href="/dashboard">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button onClick={handleGenerate} disabled={loading} className="gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Portfolio
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Tips */}
        <Card className="mt-6 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <h3 className="mb-2 font-semibold">Tips for best results:</h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Use full job descriptions for better analysis</li>
              <li>Include technical requirements in the job</li>
              <li>Jobs with specific features get better matches</li>
              <li>You can edit generated content before export</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}