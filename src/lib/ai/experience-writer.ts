import type { JobAnalysis, MatchedProduct } from "@/types";

interface DescriptionResult {
  title: string;
  short: string;
  medium: string;
  long: string;
  feature: string;
}

export async function generateExperienceDescriptions(
  jobAnalysis: JobAnalysis,
  products: MatchedProduct[]
): Promise<DescriptionResult[]> {
  const descriptions: DescriptionResult[] = [];
  
  for (const product of products) {
    const feature = product.features[0] || "feature";
    
    descriptions.push({
      title: `${product.name} - ${feature} Implementation`,
      short: `Built ${feature} functionality similar to ${product.name} using ${jobAnalysis.techStack[0]}.`,
      medium: `Developed ${feature} system for a ${jobAnalysis.projectType} platform in the ${jobAnalysis.industry} industry. Implemented using ${jobAnalysis.techStack.join(", ")} with focus on scalability and user experience.`,
      long: `Led the development of a ${feature} module for a ${jobAnalysis.industry}-focused ${jobAnalysis.projectType}. Using ${jobAnalysis.techStack.join(", ")}, created a solution that handles high traffic while maintaining fast response times. The implementation included comprehensive testing and monitoring.`,
      feature,
    });
  }

  return descriptions;
}
