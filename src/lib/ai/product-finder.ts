import type { JobAnalysis, MatchedProduct } from "@/types";

interface ProductSearchResult {
  url: string;
  name: string;
  description: string;
  features: string[];
  domain: string;
  launched: string;
}

export async function findSimilarProducts(
  analysis: JobAnalysis,
  searchFunction: (query: string) => Promise<ProductSearchResult[]>
): Promise<MatchedProduct[]> {
  const searchQueries = [
    `${analysis.projectType} software ${analysis.industry}`,
    `${analysis.features[0]} tool SaaS`,
    `${analysis.techStack[0]} dashboard`,
    `${analysis.industry} ${analysis.projectType} startup`,
  ];

  const allResults: ProductSearchResult[] = [];

  for (const query of searchQueries) {
    try {
      const results = await searchFunction(query);
      allResults.push(...results);
    } catch (error) {
      console.error(`Search failed for query: ${query}`, error);
    }
  }

  const uniqueResults = deduplicateProducts(allResults);

  const scoredProducts = uniqueResults.map((product) => ({
    ...product,
    similarityScore: calculateSimilarityScore(product, analysis),
  }));

  scoredProducts.sort((a, b) => (b.similarityScore || 0) - (a.similarityScore || 0));

  return scoredProducts.slice(0, 5).map((product) => ({
    id: crypto.randomUUID(),
    jobPostId: "",
    url: product.url,
    name: product.name,
    description: product.description,
    features: product.features,
    similarityScore: product.similarityScore,
    createdAt: new Date(),
  }));
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