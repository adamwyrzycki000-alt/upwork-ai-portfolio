import type { JobAnalysis, MatchedProduct } from "@/types";

const KNOWN_PRODUCTS: Record<string, ProductSearchResult[]> = {
  crm: [
    { url: "https://hubspot.com", name: "HubSpot", description: "CRM platform for marketing and sales", features: ["contact management", "email tracking", "deal pipeline"] },
    { url: "https://salesforce.com", name: "Salesforce", description: "Enterprise CRM with AI insights", features: ["lead management", "analytics", "automation"] },
    { url: "https://pipedrive.com", name: "Pipedrive", description: "Sales CRM for small businesses", features: ["pipeline", "activity tracking"] },
  ],
  saas: [
    { url: "https://notion.so", name: "Notion", description: "All-in-one workspace", features: ["wiki", "databases", "projects"] },
    { url: "https://airtable.com", name: "Airtable", description: "Low-code platform", features: ["databases", "forms", "automations"] },
    { url: "https://asana.com", name: "Asana", description: "Work management", features: ["tasks", "timelines", "portfolios"] },
  ],
  ai: [
    { url: "https://openai.com", name: "OpenAI", description: "AI research and deployment", features: ["GPT", "API", "playground"] },
    { url: "https://anthropic.com", name: "Anthropic", description: "AI safety company", features: ["Claude", "API", "constitutional AI"] },
  ],
  ecommerce: [
    { url: "https://shopify.com", name: "Shopify", description: "Ecommerce platform", features: ["storefront", "payments", "inventory"] },
    { url: "https://woocommerce.com", name: "WooCommerce", description: "Ecommerce plugin", features: ["store", "products"] },
  ],
  fintech: [
    { url: "https://stripe.com", name: "Stripe", description: "Payment infrastructure", features: ["payments", "billing"] },
    { url: "https://plaid.com", name: "Plaid", description: "Financial data platform", features: ["banking", "identity"] },
  ],
  default: [
    { url: "https://webflow.com", name: "Webflow", description: "Visual web development", features: ["CMS", "ecommerce"] },
  ],
};

interface ProductSearchResult {
  url: string;
  name: string;
  description: string;
  features: string[];
}

export async function findSimilarProducts(
  analysis: JobAnalysis,
  maxResults: number = 3
): Promise<MatchedProduct[]> {
  const industryProducts = KNOWN_PRODUCTS[analysis.industry.toLowerCase()] || 
                       KNOWN_PRODUCTS[analysis.projectType.toLowerCase()] || 
                       KNOWN_PRODUCTS.default;
  
  const results = industryProducts.slice(0, maxResults).map((product) => ({
    id: crypto.randomUUID(),
    jobPostId: "",
    url: product.url,
    name: product.name,
    description: product.description,
    features: product.features,
    similarityScore: Math.floor(70 + Math.random() * 30),
    imageUrl: `/placeholder/${product.name.toLowerCase().replace(/\s/g, "")}.png`,
    createdAt: new Date(),
  }));

  return results;
}
