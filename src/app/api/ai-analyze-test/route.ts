import { analyzeResumeWithAI } from "@/lib/ai-analyzer";

export async function POST() {
  try {
    const result = await analyzeResumeWithAI(
      "Frontend developer with React, Next.js, TypeScript, Node.js and MongoDB experience.",
      "Frontend Developer",
      "Test Company",
      "We are looking for a Frontend Developer with experience in React, Next.js and TypeScript.",
    );

    return Response.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("AI analysis test error:", error);

    return Response.json(
      {
        success: false,
        error: "AI analysis failed",
      },
      { status: 500 },
    );
  }
}