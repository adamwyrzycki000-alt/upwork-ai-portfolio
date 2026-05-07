import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { analyzeJobPost } from "@/lib/ai/job-analyzer";
import { findSimilarProducts } from "@/lib/ai/product-finder";
import { captureScreenshots } from "@/lib/ai/screenshot-engine";
import { generateExperienceDescriptions } from "@/lib/ai/experience-writer";

export async function POST(request: NextRequest) {
  try {
    const { content, url } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // 1. Analyze the job posting
    const analysis = await analyzeJobPost(content);

    // 2. Create job post
    const jobPost = await prisma.jobPost.create({
      data: {
        userId: "demo-user",
        content,
        url,
        analysis: analysis as unknown as Record<string, unknown>,
      },
    });

    // 3. Create portfolio
    const portfolio = await prisma.portfolio.create({
      data: {
        userId: "demo-user",
        jobPostId: jobPost.id,
        title: `${analysis.projectType} - ${analysis.industry} Portfolio`,
        sections: [],
      },
    });

    // 4. Find similar products
    const products = await findSimilarProducts(analysis, 3);
    
    // Save products
    for (const product of products) {
      await prisma.product.create({
        data: {
          jobPostId: jobPost.id,
          name: product.name,
          url: product.url,
          description: product.description,
          similarityScore: product.similarityScore,
          features: product.features,
        },
      });
    }

    // 5. Capture screenshots (mock for now - would need Playwright)
    for (const product of products) {
      await prisma.screenshot.create({
        data: {
          productId: product.name, // temp - needs proper relation
          jobPostId: jobPost.id,
          imageUrl: `/placeholder/${product.name}.png`,
          featureTags: product.features,
          pageType: "homepage",
        },
      });
    }

    // 6. Generate experience descriptions
    const descriptions = await generateExperienceDescriptions(analysis, products);
    
    // Save descriptions
    for (const desc of descriptions) {
      await prisma.experience.create({
        data: {
          jobPostId: jobPost.id,
          title: desc.title,
          shortDescription: desc.short,
          mediumDescription: desc.medium,
          longDescription: desc.long,
          relatedFeature: desc.feature,
        },
      });
    }

    return NextResponse.json({ 
      success: true, 
      portfolioId: portfolio.id,
      productsFound: products.length,
      descriptionsGenerated: descriptions.length
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json({ error: "Failed to generate portfolio" }, { status: 500 });
  }
}