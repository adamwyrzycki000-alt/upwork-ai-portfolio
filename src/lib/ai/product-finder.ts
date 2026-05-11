import type { JobAnalysis, MatchedProduct } from "@/types";

// More comprehensive product database with recent products
const ALL_PRODUCTS: ProductSearchResult[] = [
  // CRM - recent products
  { url: "https://hubspot.com", name: "HubSpot", description: "All-in-one CRM platform with marketing, sales, and service hub", industry: "crm", features: ["contact management", "marketing automation", "sales pipeline"] },
  { url: "https://salesforce.com", name: "Salesforce", description: "World's #1 CRM with AI-powered Einstein", industry: "crm", features: ["AI", "analytics", " automation"] },
  { url: "https://pipedrive.com", name: "Pipedrive", description: "Sales-focused CRM with pipeline management", industry: "crm", features: ["pipeline", "mobile", "AI assistant"] },
  { url: "https://zoho.com/crm", name: "Zoho CRM", description: "Budget-friendly CRM with automation", industry: "crm", features: ["automation", "analytics", "workflow"] },
  { url: "https://keap.com", name: "Keap", description: "CRM for small business automation", industry: "crm", features: ["email marketing", "payments", "ecommerce"] },
  { url: "https:// close.com", name: "Close", description: "Sales CRM with built-in communication", industry: "crm", features: ["calling", "email", "pipeline"] },
  
  // Project Management
  { url: "https://notion.so", name: "Notion", description: "All-in-one workspace for notes & docs", industry: "project", features: ["wiki", "database", "project management"] },
  { url: "https://airtable.com", name: "Airtable", description: "Low-code platform for building apps", industry: "saas", features: ["database", "forms", "automations"] },
  { url: "https://asana.com", name: "Asana", description: "Work management platform", industry: "project", features: ["tasks", "timelines", "goals"] },
  { url: "https://clickup.com", name: "ClickUp", description: "Productivity platform for everything", industry: "project", features: ["tasks", "docs", "chat", "whiteboard"] },
  { url: "https://trello.com", name: "Trello", description: "Visual board-based project management", industry: "project", features: ["boards", "cards", "automations"] },
  { url: "https://monday.com", name: "Monday", description: "Work OS for teams", industry: "project", features: ["dashboards", "automations", "forms"] },
  { url: "https://linear.app", name: "Linear", description: "Issue tracking for modern teams", industry: "project", features: ["issues", "cycles", "sprints"] },
  { url: "https://shortcut.com", name: "Shortcut", description: "Project management for PMs", industry: "project", features: ["epics", "stories", "roadmaps"] },
  { url: "https://planview.com", name: "Planview", description: "Agile work management", industry: "project", features: ["agile", "portfolio", "kanban"] },
  
  // AI Products - Very recent
  { url: "https://openai.com", name: "OpenAI", description: "AI research and deployment company with GPT-4", industry: "ai", features: ["GPT", "API", "fine-tuning", "assistant"] },
  { url: "https://anthropic.com", name: "Anthropic", description: "AI safety company with Claude", industry: "ai", features: ["Claude", "API", "constitutional AI"] },
  { url: "https://cohere.com", name: "Cohere", description: "Enterprise AI platform", industry: "ai", features: ["LLM", "embeddings", "command"] },
  { url: "https://writesonic.com", name: "Writesonic", description: "AI article & content writer", industry: "ai", features: ["SEO articles", "blog posts", "ads"] },
  { url: "https://copy.ai", name: "Copy.ai", description: "AI marketing copywriter", industry: "ai", features: ["marketing copy", "workflows", "brand voice"] },
  { url: "https://jasper.ai", name: "Jasper", description: "AI writing assistant", industry: "ai", features: ["long-form", "SEO", "brand"] },
  { url: "https://ottle.ai", name: "Otter.ai", description: "AI meeting assistant", industry: "ai", features: ["transcription", "summary", "自动字幕"] },
  { url: "https://descript.com", name: "Descript", description: "AI-powered video editor", industry: "ai", features: ["video editing", "transcription", "podcast"] },
  { url: "https://runwayml.com", name: "Runway", description: "AI creative tools", industry: "ai", features: ["video generation", "editing", "effects"] },
  { url: "https://midjourney.com", name: "Midjourney", description: "AI image generation", industry: "ai", features: ["image generation", "art", "design"] },
  
  // Fintech/Payments
  { url: "https://stripe.com", name: "Stripe", description: "Payment infrastructure platform", industry: "fintech", features: ["payments", "billing", "connect"] },
  { url: "https://plaid.com", name: "Plaid", description: "Financial data platform", industry: "fintech", features: ["banking", "identity", "income verification"] },
  { url: "https://wise.com", name: "Wise", description: "International payments platform", industry: "fintech", features: ["multi-currency", "low fees", "API"] },
  { url: "https://checkout.com", name: "Checkout.com", description: "Global payments solution", industry: "fintech", features: ["cards", "wallets", "local methods"] },
  { url: "https://ramp.com", name: "Ramp", description: "Corporate cards and finance", industry: "fintech", features: ["corporate cards", "expense management", "automations"] },
  { url: "https://mercury.com", name: "Mercury", description: "Banking for startups", industry: "fintech", features: ["banking", "cards", " treasury"] },
  
  // Ecommerce
  { url: "https://shopify.com", name: "Shopify", description: "Ecommerce platform", industry: "ecommerce", features: ["online store", "payments", "POS"] },
  { url: "https://woocommerce.com", name: "WooCommerce", description: "Open-source ecommerce", industry: "ecommerce", features: ["WordPress", "customizable", "extensions"] },
  { url: "https://bigcommerce.com", name: "BigCommerce", description: "Headless commerce", industry: "ecommerce", features: ["scalable", "multi-channel", "API-first"] },
  { url: "https://squarespace.com", name: "Squarespace", description: "Website building with ecommerce", industry: "ecommerce", features: ["templates", "ecommerce", "domains"] },
  { url: "https://wix.com", name: "Wix", description: "Website builder", industry: "ecommerce", features: ["drag-drop", "templates", "ecommerce"] },
  
  // Marketing
  { url: "https://mailchimp.com", name: "Mailchimp", description: "Email marketing platform", industry: "marketing", features: ["email Campaigns", "landing pages", "automations"] },
  { url: "https://buffer.com", name: "Buffer", description: "Social media management", industry: "marketing", features: ["publishing", "analytics", "engagement"] },
  { url: "https://hootsuite.com", name: "Hootsuite", description: "Social media platform", industry: "marketing", features: ["scheduling", "monitoring", "analytics"] },
  { url: "https://semrush.com", name: "SEMrush", description: "SEO and content marketing", industry: "marketing", features: ["SEO audit", "content", "position tracking"] },
  { url: "https://ahrefs.com", name: "Ahrefs", description: "SEO toolkit", industry: "marketing", features: ["backlinks", "keywords", "crawling"] },
  
  // Analytics/Dashboard
  { url: "https://databricks.com", name: "Databricks", description: "Data and AI platform", industry: "analytics", features: ["lakehouse", "ML", "real-time analytics"] },
  { url: "https://mode.com", name: "Mode", description: "Collaborative analytics", industry: "analytics", features: ["SQL", "Python", "visualizations"] },
  { url: "https://mixpanel.com", name: "Mixpanel", description: "Product analytics", industry: "analytics", features: ["events", "funnels", "cohorts"] },
  { url: "https://amplitude.com", name: "Amplitude", description: "Product intelligence", industry: "analytics", features: ["analytics", "predictions", "heatmaps"] },
  
  // HR/Recruiting
  { url: "https://lever.com", name: "Lever", description: "Recruiting and ATS", industry: "hr", features: ["ATS", "recruiting", "career pages"] },
  { url: "https://greenhouse.io", name: "Greenhouse", description: "Hiring platform", industry: "hr", features: ["ATS", "interviewing", "scoring"] },
  { url: "https://workday.com", name: "Workday", description: "HR and finance cloud", industry: "hr", features: ["HRIS", "payroll", "planning"] },
  { url: "https://bob.com", name: "HiBob", description: "HR platform for growth", industry: "hr", features: ["onboarding", "payroll", "documents"] },
  
  // Communication
  { url: "https://slack.com", name: "Slack", description: "Business messaging", industry: "communication", features: ["channels", "integrations", "huddles"] },
  { url: "https://zoom.us", name: "Zoom", description: "Video communications", industry: "communication", features: ["video calls", "webinars", "chat"] },
  { url: "https://teams.microsoft.com", name: "Microsoft Teams", description: "Chat and collaboration", industry: "communication", features: ["chat", "meetings", "calls"] },
  { url: "https://discord.com", name: "Discord", description: "Communication platform", industry: "communication", features: ["voice", "video", "communities"] },
];

interface ProductSearchResult {
  url: string;
  name: string;
  description: string;
  industry: string;
  features: string[];
}

// Calculate match score based on job requirements
function calculateScore(product: ProductSearchResult, analysis: JobAnalysis): number {
  let score = 0;
  const pFeaturesLower = product.features.map(f => f.toLowerCase());
  const pIndustryLower = product.industry.toLowerCase();
  const jobFeaturesLower = analysis.features.map(f => f.toLowerCase());
  const jobIndustryLower = analysis.industry.toLowerCase();
  const jobProjectLower = analysis.projectType.toLowerCase();
  
  // Industry match (high weight)
  if (pIndustryLower === jobIndustryLower) score += 30;
  if (pIndustryLower === jobProjectLower) score += 20;
  
  // Feature match
  for (const jf of jobFeaturesLower) {
    if (pFeaturesLower.some(pf => pf.includes(jf) || jf.includes(pf))) {
      score += 15;
    }
  }
  
  // Tech stack match
  for (const tech of analysis.techStack) {
    if (pFeaturesLower.some(pf => pf.toLowerCase().includes(tech.toLowerCase()))) {
      score += 10;
    }
  }
  
  return Math.min(score, 100);
}

export async function findSimilarProducts(
  analysis: JobAnalysis,
  maxResults: number = 3
): Promise<MatchedProduct[]> {
  // Score all products
  const scored = ALL_PRODUCTS.map(p => ({
    ...p,
    score: calculateScore(p, analysis),
  }));
  
  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);
  
  // Take top results
  const topProducts = scored.slice(0, maxResults);
  
  return topProducts.map((product) => ({
    id: crypto.randomUUID(),
    jobPostId: "",
    url: product.url,
    name: product.name,
    description: product.description,
    features: product.features,
    similarityScore: product.score,
    imageUrl: `/placeholder/${product.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.png`,
    createdAt: new Date(),
  }));
}
