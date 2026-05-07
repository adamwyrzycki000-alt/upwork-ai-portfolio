import type { JobAnalysis, MatchedProduct } from "@/types";

// Sample similar products database for common industries
const KNOWN_PRODUCTS: Record<string, ProductSearchResult[]> = {
  crm: [
    { url: "https://hubspot.com", name: "HubSpot", description: "CRM platform for marketing, sales, and customer service", features: ["contact management", "email tracking", "deal pipeline"], domain: "crm" },
    { url: "https://salesforce.com", name: "Salesforce", description: "Enterprise CRM with AI-powered insights", features: ["lead management", "analytics", "automation"], domain: "crm" },
    { url: "https://pipedrive.com", name: "Pipedrive", description: "Sales CRM for small businesses", features: ["pipeline management", "activity tracking", "forecasting"], domain: "crm" },
  ],
  saas: [
    { url: "https://notion.so", name: "Notion", description: "All-in-one workspace for notes and docs", features: ["wiki", "databases", "project management"], domain: "productivity" },
    { url: "https://airtable.com", name: "Airtable", description: "Low-code platform for building collaborative apps", features: ["databases", "forms", "automations"], domain: "productivity" },
    { url: "https://asana.com", name: "Asana", description: "Work management platform", features: ["tasks", "timelines", "portfolios"], domain: "project" },
  ],
  ai: [
    { url: "https://openai.com", name: "OpenAI", description: "AI research and deployment company", features: ["GPT", "API", "playground"], domain: "ai" },
    { url: "https://anthropic.com", name: "Anthropic", description: "AI safety company building Claude", features: ["Claude", "API", "constitutional AI"], domain: "ai" },
    { url: "https://cohere.com", name: "Cohere", description: "Enterprise AI platform", features: ["LLM", "embeddings", "API"], domain: "ai" },
  ],
  ecommerce: [
    { url: "https://shopify.com", name: "Shopify", description: "Ecommerce platform for online stores", features: ["storefront", "payments", "inventory"], domain: "ecommerce" },
    { url: "https://woocommerce.com", name: "WooCommerce", description: "Ecommerce plugin for WordPress", features: ["store", "products", "payments"], domain: "ecommerce" },
  ],
  fintech: [
    { url: "https://stripe.com", name: "Stripe", description: "Payment infrastructure platform", features: ["payments", "billing", "connect"], domain: "fintech" },
    { url: "https://plaid.com", name: "Plaid", description: "Financial data platform", features: ["banking", "identity", "income"], domain: "fintech" },
  ],
  default: [
    { url: "https://webflow.com", name: "Webflow", description: "Visual web development platform", features: ["CMS", "ecommerce", "memberships"], domain: "crm" },
  ],
};

export async function findSimilarProducts(
  analysis: JobAnalysis,
  maxResults: number = 3
): Promise<MatchedProduct[]> {
  // Find products based on industry
  const industryProducts = KNOWN_PRODUCTS[analysis.industry.toLowerCase()] || KNOWN_PRODUCTS[analysis.projectType.toLowerCase()] || KNOWN_PRODUCTS.default;
  
  const results = industryProducts.slice(0, maxResults).map((product) => ({
    id: crypto.randomUUID(),
    jobPostId: "",
    url: product.url,
    name: product.name,
    description: product.description,
    features: product.features,
    similarityScore: calculateSimilarityScore(product, analysis),
    createdAt: new Date(),
  }));

  return results;
}

interface ProductSearchResult {
  url: string;
  name: string;
  description: string;
  features: string[];
  domain: string;
  launched?: string;
}

function deduplicateProducts(products: ProductSearchResult[]): ProductSearchResult[] {
  const seen = new Set<string>();
  return products.filter((product) => {
    const key = new URL(product.url).hostname;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function calculateSimilarityScore(
  product: ProductSearchResult,
  analysis: JobAnalysis
): number {
  let score = 0;

  const featureLower = product.features.map((f) => f.toLowerCase());
  const jobFeaturesLower = analysis.features.map((f) => f.toLowerCase());

  for (const feature of jobFeaturesLower) {
    if (featureLower.some((f) => f.includes(feature) || feature.includes(f))) {
      score += 20;
    }
  }

  if (product.domain.toLowerCase() === analysis.industry.toLowerCase()) {
    score += 30;
  }

  if (product.features.some((f) => f.toLowerCase().includes("dashboard"))) {
    if (analysis.features.some((f) => f.toLowerCase().includes("dashboard"))) {
      score += 15;
    }
  }

  if (product.features.some((f) => f.toLowerCase().includes("ai"))) {
    if (analysis.features.some((f) => f.toLowerCase().includes("ai"))) {
      score += 15;
    }
  }

  return Math.min(score, 100);
}