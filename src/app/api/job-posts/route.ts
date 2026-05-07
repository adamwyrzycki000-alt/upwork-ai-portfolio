import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { analyzeJobPost } from "@/lib/ai/job-analyzer";

export async function POST(request: NextRequest) {
  try {
    const { content, url } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Analyze the job posting
    const analysis = await analyzeJobPost(content);

    // Create the job post and portfolio
    const jobPost = await prisma.jobPost.create({
      data: {
        userId: "demo-user", // For MVP without auth
        content,
        url,
        analysis: analysis as unknown as Record<string, unknown>,
      },
    });

    const portfolio = await prisma.portfolio.create({
      data: {
        userId: "demo-user",
        jobPostId: jobPost.id,
        title: `${analysis.projectType} - ${analysis.industry} Portfolio`,
        sections: [],
      },
    });

    return NextResponse.json({ portfolioId: portfolio.id, jobPost, analysis });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}