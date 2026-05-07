import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { analyzeJobPost } from "@/lib/ai/job-analyzer";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
        userId: session.user.id!,
        content,
        url,
        analysis: analysis as unknown as Record<string, unknown>,
      },
    });

    const portfolio = await prisma.portfolio.create({
      data: {
        userId: session.user.id!,
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