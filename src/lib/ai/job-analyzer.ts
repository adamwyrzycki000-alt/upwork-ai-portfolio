import type { JobAnalysis } from "@/types";

export async function analyzeJobPost(content: string): Promise<JobAnalysis> {
  const lower = content.toLowerCase();
  
  return {
    id: crypto.randomUUID(),
    techStack: extractTechStack(content),
    features: extractFeatures(content),
    industry: extractIndustry(lower),
    keywords: [],
    complexity: lower.includes("complex") || lower.includes("enterprise") ? "complex" : "medium",
    projectType: extractProjectType(lower),
    uiuxRequirements: [],
    seniority: lower.includes("senior") ? "senior" : "mid",
    platform: ["web"],
  };
}

function extractTechStack(content: string): string[] {
  const stack: string[] = [];
  const patterns = [
    [/react/gi, "React"], [/vue/gi, "Vue"], [/angular/gi, "Angular"], 
    [/node\.js/gi, "Node.js"], [/python/gi, "Python"], [/django/gi, "Django"], 
    [/flask/gi, "Flask"], [/typescript/gi, "TypeScript"], 
    [/javascript/gi, "JavaScript"], [/php/gi, "PHP"], 
    [/laravel/gi, "Laravel"], [/ruby/gi, "Ruby"], 
    [/rails/gi, "Rails"], [/go/gi, "Go"], [/rust/gi, "Rust"],
    [/java/gi, "Java"], [/spring/gi, "Spring"], 
    [/next\.js/gi, "Next.js"], [/express/gi, "Express"],
    [/fastapi/gi, "FastAPI"], [/postgresql/gi, "PostgreSQL"],
    [/mysql/gi, "MySQL"], [/mongodb/gi, "MongoDB"],
    [/redis/gi, "Redis"], [/tailwind/gi, "Tailwind CSS"],
  ];
  
  for (const [regex, name] of patterns) {
    if (regex.test(content) && !stack.includes(name)) {
      stack.push(name);
    }
  }
  
  return stack.length ? stack : ["React", "TypeScript", "Node.js"];
}

function extractFeatures(content: string): string[] {
  const features: string[] = [];
  const patterns = [
    [/auth|login|signin/gi, "user authentication"],
    [/dashboard/gi, "dashboard"],
    [/api|rest/gi, "REST API"],
    [/database|db/gi, "database"],
    [/payment|stripe/gi, "payment processing"],
    [/chat|message/gi, "chat"],
    [/analytics|chart/gi, "analytics"],
    [/admin/gi, "admin panel"],
    [/cms/gi, "CMS"],
    [/mobile|ios|android/gi, "mobile"],
    [/ai|ml|machine learning/gi, "AI/ML"],
  ];
  
  for (const [regex, name] of patterns) {
    if (regex.test(content) && !features.includes(name)) {
      features.push(name);
    }
  }
  
  return features.length ? features : ["user authentication", "database", "REST API"];
}

function extractIndustry(lower: string): string {
  if (lower.includes("crm") || lower.includes("sales")) return "crm";
  if (lower.includes("fintech") || lower.includes("payment")) return "fintech";
  if (lower.includes("ecommerce") || lower.includes("shop")) return "ecommerce";
  if (lower.includes("health") || lower.includes("medical")) return "healthcare";
  if (lower.includes("ai") || lower.includes("ml")) return "ai";
  return "saas";
}

function extractProjectType(lower: string): string {
  if (lower.includes("mobile") || lower.includes("ios")) return "mobile-app";
  if (lower.includes("crm")) return "crm";
  if (lower.includes("ecommerce")) return "ecommerce";
  if (lower.includes("dashboard")) return "dashboard";
  return "saas";
}
