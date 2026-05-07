import OpenAI from "openai";
import type { JobAnalysis, ProjectType } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY,
});

const projectTypeLabels: ProjectType[] = [
  "saas",
  "ai-tool",
  "fintech",
  "crm",
  "marketplace",
  "mobile-app",
  "dashboard",
  "automation",
  "healthcare",
  "ecommerce",
  "other",
];

export async function analyzeJobPost(content: string): Promise<JobAnalysis> {
  const systemPrompt = `You are an expert job posting analyzer. Analyze the following Upwork job posting and extract structured information.

Analyze the job posting and return a JSON object with these fields:
- techStack: array of technologies mentioned (e.g., ["React", "TypeScript", "PostgreSQL"])
- features: array of features requested (e.g., ["user authentication", "payment processing"])
- industry: industry/domain (e.g., "fintech", "healthcare", "ecommerce")
- keywords: important keywords from the job
- complexity: "simple", "medium", or "complex" based on requirements
- projectType: one of: ${projectTypeLabels.join(", ")}
- uiuxRequirements: UI/UX requirements mentioned
- seniority: expected seniority level ("junior", "mid", "senior", "principal")
- platform: platform requirements (["web"], ["mobile"], ["backend"], ["web", "mobile"])

Return ONLY valid JSON, no additional text.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: content },
    ],
    temperature: 0.3,
    max_tokens: 2000,
    response_format: { type: "json_object" },
  });

  const analysis = JSON.parse(response.choices[0]?.message?.content || "{}");

  return {
    id: crypto.randomUUID(),
    techStack: analysis.techStack || [],
    features: analysis.features || [],
    industry: analysis.industry || "other",
    keywords: analysis.keywords || [],
    complexity: analysis.complexity || "medium",
    projectType: analysis.projectType || "other",
    uiuxRequirements: analysis.uiuxRequirements || [],
    seniority: analysis.seniority || "mid",
    platform: analysis.platform || ["web"],
  };
}

export async function generateSearchQueries(
  analysis: JobAnalysis
): Promise<string[]> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "Generate 5-10 search queries to find similar live products/websites. Each query should be concise and specific. Return ONLY a JSON array of strings.",
      },
      {
        role: "user",
        content: `Generate search queries for: ${analysis.projectType} ${analysis.industry} with features: ${analysis.features.join(", ")}. Tech stack: ${analysis.techStack.join(", ")}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 500,
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0]?.message?.content || "[]");
  return Array.isArray(result) ? result : result.queries || [];
}