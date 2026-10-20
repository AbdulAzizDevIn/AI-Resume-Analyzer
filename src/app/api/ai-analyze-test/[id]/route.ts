
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { id } = await params;

  const analysis = await prisma.analysis.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    select: {
      id: true,
      matchScore: true,
      result: true,
      createdAt: true,
      resume: {
        select: {
          fileName: true,
        },
      },
      jobDescription: {
        select: {
          title: true,
          company: true,
        },
      },
    },
  });

  if (!analysis) {
    return NextResponse.json(
      { error: "Analysis not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(analysis);
}
