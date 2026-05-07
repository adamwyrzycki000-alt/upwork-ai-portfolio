import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import fs from "fs";
import path from "path";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const portfolio = await prisma.portfolio.findUnique({
      where: { id },
      include: {
        jobPost: {
          include: {
            products: {
              include: {
                screenshots: {
                  include: {
                    descriptions: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!portfolio || portfolio.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Generate simple HTML-based PDF (in production, you'd use @react-pdf/renderer or similar)
    const pdfContent = generatePortfolioHTML(portfolio);
    
    // Save the PDF
    const pdfDir = path.join(process.cwd(), "public", "pdfs");
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }
    
    const pdfPath = path.join(pdfDir, `${portfolio.id}.html`);
    fs.writeFileSync(pdfPath, pdfContent);

    await prisma.portfolio.update({
      where: { id },
      data: {
        pdfPath: `/pdfs/${portfolio.id}.html`,
      },
    });

    return NextResponse.json({ url: `/pdfs/${portfolio.id}.html` });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

function generatePortfolioHTML(portfolio: any): string {
  const jobPost = portfolio.jobPost;
  const analysis = jobPost?.analysis;
  const products = jobPost?.products || [];
  const screenshots = products.flatMap((p: any) => p.screenshots || []);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${portfolio.title || "Portfolio"}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; background: #fff; }
    .container { max-width: 800px; margin: 0 auto; padding: 40px; }
    h1 { font-size: 32px; margin-bottom: 8px; }
    h2 { font-size: 24px; margin: 32px 0 16px; }
    h3 { font-size: 18px; margin: 24px 0 12px; }
    p { margin-bottom: 16px; }
    .header { text-align: center; padding: 40px 0; border-bottom: 2px solid #e5e5e5; }
    .badge { display: inline-block; padding: 4px 12px; background: #f5f5f5; border-radius: 16px; font-size: 12px; margin-right: 8px; margin-bottom: 8px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin: 24px 0; }
    .card { border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px; }
    .section { margin: 40px 0; }
    .footer { text-align: center; padding: 40px 0; border-top: 2px solid #e5e5e5; margin-top: 40px; font-size: 14px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${portfolio.title || "Professional Portfolio"}</h1>
      <p>AI-Generated Portfolio for Upwork Proposals</p>
    </div>

    <div class="section">
      <h2>Job Analysis</h2>
      ${analysis ? `
      <div>
        <span class="badge">${analysis.projectType || 'N/A'}</span>
        <span class="badge">${analysis.industry || 'N/A'}</span>
        <span class="badge">${analysis.complexity || 'N/A'}</span>
      </div>
      ` : ''}
    </div>

    ${analysis?.techStack?.length ? `
    <div class="section">
      <h2>Tech Stack</h2>
      <div>
        ${analysis.techStack.map((tech: string) => `<span class="badge">${tech}</span>`).join('')}
      </div>
    </div>
    ` : ''}

    <div class="section">
      <h2>Similar Products</h2>
      <div class="grid">
        ${products.map((product: any) => `
          <div class="card">
            <h3>${product.name || 'Product'}</h3>
            <p>${product.description || ''}</p>
            <span class="badge">${Math.round(product.similarityScore || 0)}% match</span>
          </div>
        `).join('')}
      </div>
    </div>

    ${screenshots.length > 0 ? `
    <div class="section">
      <h2>Screenshots</h2>
      <div class="grid">
        ${screenshots.map((screenshot: any) => `
          <div class="card">
            <p>Feature: ${screenshot.featureTags?.join(', ') || 'General'}</p>
            ${screenshot.descriptions?.[0]?.mediumDescription ? `
              <p>${screenshot.descriptions[0].mediumDescription}</p>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}

    <div class="footer">
      <p>Generated by Upfolio AI</p>
    </div>
  </div>
</body>
</html>`;
}