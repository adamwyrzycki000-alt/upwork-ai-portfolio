"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Card, CardContent } from "@/components/ui";
import { Badge } from "@/components/ui";
import {
  FileText,
  Clock,
  TrendingUp,
  Loader2,
  Eye,
  Download,
  Trash2,
} from "lucide-react";

export default function HistoryPage() {
  const { data: session } = useSession();
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolios() {
      try {
        const res = await fetch("/api/portfolios");
        if (res.ok) {
          const data = await res.json();
          setPortfolios(data);
        }
      } catch (error) {
        console.error("Failed to fetch portfolios:", error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchPortfolios();
    }
  }, [session]);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this portfolio?")) return;

    try {
      const res = await fetch(`/api/portfolios/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPortfolios(portfolios.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Portfolio History</h1>
        <p className="text-muted-foreground">
          View and manage your generated portfolios
        </p>
      </div>

      {portfolios.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No portfolios yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Create your first portfolio to get started
            </p>
            <Link href="/generate">
              <Button>Create Portfolio</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {portfolios.map((portfolio) => (
            <Card key={portfolio.id} className="group">
              <CardContent className="p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="mb-1 font-semibold">
                      {portfolio.title || "Untitled Portfolio"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(portfolio.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary">{portfolio.template}</Badge>
                </div>
                <div className="mb-3 flex flex-wrap gap-2">
                  {portfolio.jobPost?.analysis?.techStack?.slice(0, 3)?.map(
                    (tech: string) => (
                      <Badge key={tech} variant="outline">
                        {tech}
                      </Badge>
                    )
                  )}
                </div>
                <div className="flex gap-2">
                  <Link href={`/portfolio/${portfolio.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(portfolio.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}