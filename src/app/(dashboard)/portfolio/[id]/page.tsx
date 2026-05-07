"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui";
import { Badge } from "@/components/ui";
import {
  ArrowLeft,
  Download,
  RefreshCw,
  Edit,
  Eye,
  Loader2,
  FileText,
  Image,
} from "lucide-react";

export default function PortfolioPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const portfolioId = params?.id as string;

  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolio() {
      if (!portfolioId) return;

      try {
        const res = await fetch(`/api/portfolios/${portfolioId}`);
        if (res.ok) {
          const data = await res.json();
          setPortfolio(data);
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Failed to fetch portfolio:", error);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();
  }, [portfolioId, router]);

  async function handleExport() {
    if (!portfolioId) return;

    try {
      const res = await fetch(`/api/portfolios/${portfolioId}/export`);
      if (res.ok) {
        const data = await res.json();
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Export failed:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-lg text-muted-foreground">Portfolio not found</p>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">
                {portfolio.title || "Portfolio"}
              </h1>
              <p className="text-sm text-muted-foreground">
                Created {new Date(portfolio.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </Button>
            <Button onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                    Job Analysis
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {portfolio.jobPost?.analysis?.projectType && (
                      <Badge variant="secondary">
                        {portfolio.jobPost.analysis.projectType}
                      </Badge>
                    )}
                    {portfolio.jobPost?.analysis?.industry && (
                      <Badge variant="secondary">
                        {portfolio.jobPost.analysis.industry}
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {portfolio.jobPost?.analysis?.techStack?.map(
                      (tech: string) => (
                        <Badge key={tech} variant="outline">
                          {tech}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Similar Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Similar Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {portfolio.products?.length > 0 ? (
                  portfolio.products.map(
                    (product: any, index: number) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between rounded-lg border border-border p-3"
                      >
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.url}
                          </p>
                        </div>
                        <Badge variant="success">
                          {Math.round(product.similarityScore || 0)}%
                        </Badge>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No products found yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Screenshots */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Screenshots
              </CardTitle>
            </CardHeader>
            <CardContent>
              {portfolio.screenshots?.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {portfolio.screenshots.map(
                    (screenshot: any, index: number) => (
                      <div
                        key={screenshot.id}
                        className="relative overflow-hidden rounded-lg border border-border"
                      >
                        <div className="aspect-video bg-secondary" />
                        <div className="p-2">
                          <div className="flex flex-wrap gap-1">
                            {screenshot.featureTags?.map(
                              (tag: string) => (
                                <Badge key={tag} variant="secondary">
                                  {tag}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No screenshots captured yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Experience */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generated Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {portfolio.descriptions?.length > 0 ? (
                  portfolio.descriptions.map(
                    (desc: any, index: number) => (
                      <div key={desc.id} className="space-y-2">
                        <h4 className="font-medium">Experience {index + 1}</h4>
                        <p className="text-sm text-muted-foreground">
                          {desc.mediumDescription}
                        </p>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No descriptions generated yet
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}