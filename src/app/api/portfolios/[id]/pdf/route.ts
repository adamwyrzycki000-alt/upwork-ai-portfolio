import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const portfolio = await prisma.portfolio.findUnique({
      where: { id, userId: "demo-user" },
      include: {
        jobPost: {
          include: {
            products: true,
            experiences: true,
          },
        },
      },
    });

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    // Parse analysis
    let analysis: any = {};
    try {
      analysis = portfolio.jobPost.analysis ? JSON.parse(portfolio.jobPost.analysis) : {};
    } catch (e) {}

    // Generate simple HTML that can be printed to PDF
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${portfolio.title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { color: #1a1a1a; font-size: 24px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
    h2 { color: #374151; font-size: 18px; margin-top: 30px; }
    .badge { display: inline-block; background: #e5e7eb; padding: 4px 12px; border-radius: 16px; font-size: 12px; margin: 4px; }
    .product { border: 1px solid #e5e7eb; padding: 16px; margin: 12px 0; border-radius: 8px; }
    .product-name { font-weight: 600; font-size: 16px; }
    .product-url { color: #3b82f6; font-size: 14px; }
    .product-desc { color: #6b7280; font-size: 14px; margin-top: 4px; }
    .job-content { background: #f9fafb; padding: 16px; border-radius: 8px; font-size: 13px; white-space: pre-wrap; }
    .meta { color: #9ca3af; font-size: 12px; margin-top: 8px; }
  </style>
</head>
<body>
  <h1>${portfolio.title}</h1>
  <div class="meta">Created: ${new Date(portfolio.createdAt).toLocaleDateString()}</div>
  
  <h2>Tech Stack</h2>
  <div>
    ${(analysis.techStack || []).map((t: string) => `<span class="badge">${t}</span>`).join("")}
  </div>
  
  <h2>Features</h2>
  <div>
    ${(analysis.features || []).map((f: string) => `<span class="badge">${f}</span>`).join("")}
  </div>
  
  <h2>Similar Products for Reference</h2>
  ${(portfolio.jobPost.products || []).map((p: any) => `
    <div class="product">
      <div class="product-name">${p.name}</div>
      <div class="product-url"><a href="${p.url}">${p.url}</a></div>
      <div class="product-desc">${p.description || ""}</div>
    </div>
  `).join("")}
  
  <h2>Experience Highlights</h2>
  ${(portfolio.jobPost.experiences || []).map((e: any) => `
    <div class="product">
      <div class="product-name">${e.title}</div>
      <div class="product-desc">${e.shortDescription || ""}</div>
    </div>
  `).join("")}
  
  <h2>Job Description</h2>
  <div class="job-content">${portfolio.jobPost.content}</div>
  
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af;">
    Generated with Upfolio AI - AI-Powered Portfolio Generator for Upwork
  </div>
</body>
</html>
    `;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("PDF export error:", error);
    return NextResponse.json({ error: "Failed to export portfolio" }, { status: 500 });
  }
}