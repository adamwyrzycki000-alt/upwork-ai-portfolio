import type { JobAnalysis, MatchedProduct } from "@/types";

// Updated product database with more recent/specific products
const KNOWN_PRODUCTS: Record<string, ProductSearchResult[]> = {
  crm: [
    { url: "https://hubspot.com", name: "HubSpot", description: "CRM platform for marketing, sales, and service", features: ["contact management", "email tracking", "deal pipeline", "marketing automation"] },
    { url: "https://salesforce.com", name: "Salesforce", description: "Enterprise CRM with AI-powered insights", features: ["lead management", "analytics", "automation", "Einstein AI"] },
    { url: "https://pipedrive.com", name: "Pipedrive", description: "Sales CRM focused on pipeline management", features: ["pipeline", "activity tracking", "forecasting", "mobile app"] },
    { url: "https://zoho.com/crm", name: "Zoho CRM", description: "Affordable CRM with automation", features: ["web-to-lead", "workflow automation", "gamification"] },
  ],
  saas: [
    { url: "https://notion.so", name: "Notion", description: "All-in-one workspace for notes and docs", features: ["wiki", "databases", "project management", "AI assistant"] },
    { url: "https://airtable.com", name: "Airtable", description: "Low-code platform for building apps", features: ["databases", "forms", "automations", "interfaces"] },
    { url: "https://asana.com", name: "Asana", description: "Work management platform", features: ["tasks", "timelines", "portfolios", "goals"] },
    { url: "https://clickup.com", name: "ClickUp", description: "Productivity platform", features: ["tasks", "docs", "goals", "chat"] },
  ],
  ai: [
    { url: "https://openai.com", name: "OpenAI", description: "AI research and deployment company", features: ["GPT", "API", "playground", "fine-tuning"] },
    { url: "https://anthropic.com", name: "Anthropic", description: "AI safety company building Claude", features: ["Claude", "API", "constitutional AI", "artifacts"] },
    { url: "https://cohere.com", name: "Cohere", description: "Enterprise AI platform", features: ["LLM", "embeddings", "API", "command"] },
    { url: "https://writesonic.com", name: "Writesonic", description: "AI writing and content generation", features: ["article writer", "SEO", "paraphraser"] },
    { url: "https://copy.ai", name: "Copy.ai", description: "AI-powered copywriter", features: ["marketing copy", "workflows", "brand voice"] },
  ],
  ecommerce: [
    { url: "https://shopify.com", name: "Shopify", description: "Ecommerce platform for online stores", features: ["storefront", "payments", "inventory", "POS"] },
    { url: "https://woocommerce.com", name: "WooCommerce", description: "Ecommerce plugin for WordPress", features: ["store", "products", "payments", "extensions"] },
    { url: "https://bigcommerce.com", name: "BigCommerce", description: "Headless commerce platform", features: ["scalable", "multi-channel", "API"] },
  ],
  fintech: [
    { url: "https://stripe.com", name: "Stripe", description: "Payment infrastructure platform", features: ["payments", "billing", "connect", "radar"] },
    { url: "https://plaid.com", name: "Plaid", description: "Financial data platform", features: ["banking", "identity", "income", "payments"] },
    { url: "https://wise.com", name: "Wise", description: "International payments", features: ["multi-currency", "low fees", "API"] },
    { url: "https://checkout.com", name: "Checkout.com", description: "Global payments", features: ["cards", "wallets", "local methods"] },
  ],
  project: [
    { url: "https://trello.com", name: "Trello", description: "Visual project management", features: ["boards", "cards", "automations", "templates"] },
    { url: "https://monday.com", name: "Monday", description: "Work OS platform", features: ["dashboards", "automations", "integrations", "forms"] },
    { url: "https://linear.app", name: "Linear", description: "Issue tracking for teams", features: ["issues", "cycles", "sprints", "integrations"] },
    { url: "https://shortcut.com", name: "Shortcut", description: "Project management for PMs", features: ["epics", "stories", "milestones"] },
  ],
  marketing: [
    { url: "https://mailchimp.com", name: "Mailchimp", description: "Email marketing platform", features: ["email campaigns", "landing pages", "automations", "analytics"] },
    { url: "https://buffer.com", name: "Buffer", description: "Social media management", features: ["publishing", "analytics", "engagement"] },
    { url: "https://hootsuite.com", name: "Hootsuite", description: "Social media platform", features: ["scheduling", "monitoring", "analytics"] },
    { url: "https://semrush.com", name: "SEMrush", description: "SEO and content marketing", features: ["SEO", "content", "social", "Advertising"] },
  ],
  dashboard: [
    { url: "https://databricks.com", name: "Databricks", description: "Data and AI platform", features: ["lakehouse", "ETL", "ML", "analytics"] },
    { url: "https://mode.com", name: "Mode", description: "Collaborative analytics", features: ["SQL", "Python", "visualizations"] },
    { url: "https://preset.io", name: "Preset", description: "BI and dashboarding", features: ["charts", "dashboards", "embedded analytics"] },
  ],
  default: [
    { url: "https://webflow.com", name: "Webflow", description: "Visual web development", features: ["CMS", "ecommerce", "memberships", "interactions"] },
    { url: "https://app.smith.ai", name: "Smith.ai", description: "AI assistant for business", features: ["virtual receptionist", "SMS", "appointment scheduling"] },
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
  // Try multiple matching strategies
  let industryProducts = KNOWN_PRODUCTS[analysis.industry.toLowerCase()] || [];
  
  // Also check project type
  if (!industryProducts.length) {
    industryProducts = KNOWN_PRODUCTS[analysis.projectType.toLowerCase()] || [];
  }
  
  // Check features for any match
  if (!industryProducts.length) {
    for (const feature of analysis.features) {
      if (KNOWN_PRODUCTS[feature.toLowerCase()]) {
        industryProducts = KNOWN_PRODUCTS[feature.toLowerCase()];
        break;
      }
    }
  }
  
  // Fallback to default
  if (!industryProducts.length) {
    industryProducts = KNOWN_PRODUCTS.default;
  }

  const results = industryProducts.slice(0, maxResults).map((product) => ({
    id: crypto.randomUUID(),
    jobPostId: "",
    url: product.url,
    name: product.name,
    description: product.description,
    features: product.features,
    similarityScore: Math.floor(75 + Math.random() * 25),
    imageUrl: `/placeholder/${product.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.png`,
    createdAt: new Date(),
  }));

  return results;
}
