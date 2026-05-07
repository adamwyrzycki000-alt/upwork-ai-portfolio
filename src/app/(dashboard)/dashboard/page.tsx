"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { Plus, FileText, Clock, TrendingUp, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">
          Welcome back, {session?.user?.name || "User"}!
        </h1>
        <p className="text-muted-foreground">
          Ready to create your next winning portfolio?
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <Link href="/generate">
          <Button size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Portfolio
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Portfolios
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Jobs Analyzed
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Getting Started
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Follow these steps to create your first portfolio:
          </p>
          <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
            <li>
              Click &quot;Create New Portfolio&quot; above
            </li>
            <li>Paste an Upwork job posting URL or text</li>
            <li>Our AI will find similar products and generate content</li>
            <li>Review and edit the generated descriptions</li>
            <li>Export your professional PDF portfolio</li>
          </ol>
          <Link href="/generate">
            <Button className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Start Now
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}