export interface User {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobAnalysis {
  id: string;
  techStack: string[];
  features: string[];
  industry: string;
  keywords: string[];
  complexity: "simple" | "medium" | "complex";
  projectType: ProjectType;
  uiuxRequirements: string[];
  seniority: "junior" | "mid" | "senior" | "principal";
  platform: ("web" | "mobile" | "backend" | "fullstack")[];
}

export type ProjectType =
  | "saas"
  | "ai-tool"
  | "fintech"
  | "crm"
  | "marketplace"
  | "mobile-app"
  | "dashboard"
  | "automation"
  | "healthcare"
  | "ecommerce"
  | "other";

export interface MatchedProduct {
  id: string;
  jobPostId: string;
  url: string;
  name?: string | null;
  description?: string | null;
  features?: Record<string, unknown> | null;
  similarityScore?: number | null;
  createdAt: Date;
  screenshots?: Screenshot[];
}

export interface Screenshot {
  id: string;
  matchedProductId: string;
  url: string;
  imagePath?: string | null;
  featureTags: string[];
  createdAt: Date;
  descriptions?: GeneratedDescription[];
}

export interface GeneratedDescription {
  id: string;
  screenshotId: string;
  shortDescription?: string | null;
  mediumDescription?: string | null;
  enterpriseDescription?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioSection {
  id: string;
  type:
    | "cover"
    | "summary"
    | "experience"
    | "showcase"
    | "screenshots"
    | "tech-stack"
    | "architecture"
    | "contact";
  title: string;
  content: unknown;
  order: number;
}

export interface Portfolio {
  id: string;
  userId: string;
  jobPostId?: string | null;
  title?: string | null;
  template: string;
  theme: "dark" | "light";
  sections: PortfolioSection[];
  pdfPath?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GenerationProgress {
  stage: "input" | "analyzing" | "searching" | "capturing" | "generating" | "composing" | "complete" | "error";
  progress: number;
  message: string;
  error?: string;
}