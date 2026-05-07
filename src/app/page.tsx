"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import {
  Sparkles,
  Search,
  FileText,
  Download,
  Globe,
  Palette,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Smart Job Analysis",
    description:
      "AI analyzes Upwork job postings to extract tech stack, features, and requirements.",
  },
  {
    icon: Globe,
    title: "Similar Product Discovery",
    description:
      "Finds live similar products and SaaS tools that match the job requirements.",
  },
  {
    icon: FileText,
    title: "Auto Screenshot Capture",
    description:
      "Captures beautiful screenshots of similar products for your portfolio.",
  },
  {
    icon: Sparkles,
    title: "AI Experience Writing",
    description:
      "Generates professional case studies that sound like senior engineer-written content.",
  },
  {
    icon: Download,
    title: "PDF Export",
    description:
      "Creates beautifully designed PDF portfolios ready to send to clients.",
  },
  {
    icon: Palette,
    title: "Customizable Templates",
    description:
      "Multiple themes and templates to match your personal brand.",
  },
];

const steps = [
  { number: "01", title: "Paste Job Posting", description: "Copy the Upwork job posting URL or paste the job description directly." },
  { number: "02", title: "AI Processing", description: "Our AI analyzes requirements, finds similar products, and captures screenshots." },
  { number: "03", title: "Review & Edit", description: "Review generated content, make edits, and customize your portfolio." },
  { number: "04", title: "Export PDF", description: "Download your professional PDF portfolio and apply with confidence." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Upfolio AI</span>
          </Link>
          <Link href="/generate">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 translate-y-[-50%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[100px]" />
        </div>
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>AI-Powered Portfolio Generator</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              Turn Upwork Jobs into
              <br />
              <span className="gradient-text">Professional Portfolios</span>
            </h1>
            <p className="mx-auto mb-10 text-xl text-muted-foreground">
              Paste an Upwork job posting, get a tailored PDF portfolio with
              similar product showcases and AI-generated case studies.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/generate">
                <Button size="lg">Create Portfolio</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Everything You Need</h2>
            <p className="text-lg text-muted-foreground">Build winning Upwork proposals in minutes, not hours</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="group rounded-lg border border-border bg-card p-6 transition-all duration-200 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y border-border bg-secondary/30 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">How It Works</h2>
            <p className="text-lg text-muted-foreground">Four simple steps to your perfect portfolio</p>
          </div>
          <div className="grid gap-8 md:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="mb-4 text-6xl font-bold text-primary/20">{step.number}</div>
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">Ready to Win More Jobs?</h2>
          <p className="mb-8 text-lg text-muted-foreground">Join thousands of freelancers who use Upfolio AI to create professional portfolios that win clients.</p>
          <Link href="/generate">
            <Button size="lg">Start Creating</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
                <Sparkles className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="font-semibold">Upfolio AI</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2024 Upfolio AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}