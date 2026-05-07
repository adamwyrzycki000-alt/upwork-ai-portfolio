import type { MatchedProduct } from "@/types";

interface ScreenshotResult {
  id: string;
  productId: string;
  imageUrl: string;
  featureTags: string[];
  pageType: string;
}

export async function captureScreenshots(
  products: MatchedProduct[]
): Promise<ScreenshotResult[]> {
  // Simplified - returns placeholder data
  // In production, use Playwright to capture actual screenshots
  return products.map((product) => ({
    id: crypto.randomUUID(),
    productId: product.id,
    imageUrl: `/placeholder/${product.name.toLowerCase()}.png`,
    featureTags: product.features,
    pageType: "homepage",
  }));
}
