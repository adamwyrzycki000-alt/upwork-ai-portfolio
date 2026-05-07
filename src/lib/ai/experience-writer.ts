import OpenAI from "openai";
import type { JobAnalysis, MatchedProduct, GeneratedDescription } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY,
});

interface GenerateDescriptionInput {
  screenshot: {
    url: string;
    featureTags: string[];
  };
  product: MatchedProduct;
  jobAnalysis: JobAnalysis;
}

export async function generateDescriptions(
  input: GenerateDescriptionInput
): Promise<GeneratedDescription> {
  const { screenshot, product, jobAnalysis } = input;

  const systemPrompt = `You are a senior software engineer writing portfolio case studies. Write professional experience descriptions that:
- Sound like a senior engineer wrote them
- Feel human-written, not AI-generated
- Match the job posting requirements closely
- Use terminology from the job posting
- Focus on achievements and impact
- Include specific metrics when possible
- Avoid generic "AI-sounding" phrases

Write in first person, as if YOU built this feature/project.
Keep descriptions concise but impactful.
Use active voice.
Include technical details that demonstrate expertise.`;

  const userPrompt = `Job Requirements:
- Project Type: ${jobAnalysis.projectType}
- Industry: ${jobAnalysis.industry}
- Tech Stack: ${jobAnalysis.techStack.join(", ")}
- Features Requested: ${jobAnalysis.features.join(", ")}
- Seniority Level: ${jobAnalysis.seniority}

Similar Product Reference:
- Name: ${product.name || "Unnamed Product"}
- URL: ${product.url}
- Description: ${product.description || "N/A"}
- Features: ${JSON.stringify(product.features || {})}

Screenshot Feature Tags: ${screenshot.featureTags.join(", ")}

Generate three versions:
1. short: A concise 1-2 sentence description suitable for a quick overview
2. medium: A paragraph description with some technical detail (2-3 sentences)
3. enterprise: A detailed case study with architecture, business impact, and technical depth (4-5 sentences)

Return ONLY valid JSON with keys: shortDescription, mediumDescription, enterpriseDescription`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.5,
    max_tokens: 2000,
    response_format: { type: "json_object" },
  });

  const descriptions = JSON.parse(
    response.choices[0]?.message?.content || "{}"
  );

  return {
    id: crypto.randomUUID(),
    screenshotId: screenshot.url,
    shortDescription: descriptions.shortDescription || "",
    mediumDescription: descriptions.mediumDescription || "",
    enterpriseDescription: descriptions.enterpriseDescription || "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function humanizeText(text: string): string {
  const phrasesToAvoid = [
    "I am",
    "I have",
    "I can",
    "as an AI",
    "As an AI",
    "I was trained",
    "my capabilities",
  ];

  let humanized = text;
  for (const phrase of phrasesToAvoid) {
    humanized = humanized.replace(new RegExp(phrase, "gi"), "");
  }

  humanized = humanized.replace(/\s+/g, " ").trim();

  return humanized;
}