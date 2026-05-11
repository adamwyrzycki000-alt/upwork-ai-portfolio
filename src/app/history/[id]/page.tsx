"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Badge } from "@/components/ui";
import { ArrowLeft, FileText, Loader2, Download, ExternalLink } from "lucide-react";

interface PortfolioData {
  id: string;
  title: string;
  createdAt: string;
  jobPost?: {
    content: string;
    analysis: string;
    products?: Array<{
      id: string;
      name: string;
      url: string;
      description: string;
      features: string;
      similarityScore: number;
    }>;
  };
}

export default function PortfolioDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPortfolio() {
      if (!id) return;
      
      try {
        const res = await fetch(`/api/portfolios/${id}`);
        if (res.ok) {
          const data = await res.json();
          setPortfolio(data);
        } else {
          setError("Portfolio not found");
        }
      } catch (err) {
        setError("Failed to load portfolio");
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen p-6 lg:p-8">
        <div className="mx-auto max-w-2xl">
          <Link href="/history" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            ← Back to History
          </Link>
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">{error || "Portfolio not found"}</h3>
              <Link href="/history">
                <Button>Go to History</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Parse analysis from JSON string
  let analysis: any = {};
  try {
    analysis = portfolio.jobPost?.analysis ? JSON.parse(portfolio.jobPost.analysis) : {};
  } catch (e) {}

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/history" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          ← Back to History
        </Link>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">{portfolio.title}</h1>
            <p className="text-muted-foreground">
              Created {new Date(portfolio.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="mb-3 text-xl font-semibold">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {analysis.techStack?.map((tech: string) => (
              <Badge key={tech} variant="outline">{tech}</Badge>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="mb-3 text-xl font-semibold">Features</h2>
          <div className="flex flex-wrap gap-2">
            {analysis.features?.map((feature: string) => (
              <Badge key={feature} variant="secondary">{feature}</Badge>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="mb-3 text-xl font-semibold">Similar Products</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {portfolio.jobPost?.products?.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-4">
                  <h3 className="mb-1 font-semibold">{product.name}</h3>
                  <p className="mb-2 text-sm text-muted-foreground">{product.description}</p>
                  <a 
                    href={product.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    Visit <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-xl font-semibold">Job Description</h2>
          <Card>
            <CardContent className="p-4">
              <pre className="whitespace-pre-wrap text-sm">{portfolio.jobPost?.content}</pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}