import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const portfolios = await prisma.portfolio.findMany({
      where: { userId: "demo-user" },
      include: {
        jobPost: {
          include: {
            products: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(portfolios);
  } catch (error) {
    console.error("Get portfolios error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}