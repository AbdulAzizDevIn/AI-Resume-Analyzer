import { getSession } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  const skip = Number(searchParams.get("skip") ?? 5);

  if (!Number.isInteger(skip) || skip < 0) {
    return NextResponse.json({ error: "Invalid offset" }, { status: 400 });
  }

  const analyses = await prisma.analysis.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    skip,
    take: 5,
    include: {
      resume: { select: { fileName: true } },
      jobDescription: { select: { title: true, company: true } },
    },
  });
  const totalAnalyses = await prisma.analysis.count({
    where:{userId:session.user.id},
  })

  return NextResponse.json({
    analyses,
    hasMore:skip + analyses.length < totalAnalyses
  })
}
