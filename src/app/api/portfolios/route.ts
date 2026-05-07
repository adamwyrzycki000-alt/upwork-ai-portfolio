import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const portfolios = await prisma.portfolio.findMany({
      where: { userId: session.user.id },
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