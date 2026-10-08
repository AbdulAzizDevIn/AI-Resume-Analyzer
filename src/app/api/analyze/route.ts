import { getSession } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { analyzeResumeWithAI } from "@/lib/ai-analyzer";
import { calculateMatchScore } from "@/lib/score";
import { PDFParse } from "pdf-parse";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const formData = await request.formData();

    const resume = formData.get("resume");
    const jobTitle = formData.get("jobTitle");
    const company = formData.get("company");
    const jobDescription = formData.get("jobDescription");

    if (!(resume instanceof File)) {
      return Response.json(
        { error: "Resume file is required" },
        { status: 400 },
      );
    }

    if (resume.type !== "application/pdf") {
      return Response.json(
        { error: "Only PDF files are allowed" },
        { status: 400 },
      );
    }

    const arrayBuffer = await resume.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parse = new PDFParse({
      data: buffer,
    });

    const result = await parse.getText();

    await parse.destroy();

    const resumeText = result.text
      .normalize("NFKC")
      .replace(/[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, "")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (resumeText.length < 50) {
      return Response.json(
        { error: "Could not extract enough text from the resume" },
        { status: 400 },
      );
    }

    const resumeRecord = await prisma.resume.create({
      data: {
        userId: session.user.id,
        fileName: resume.name,
        extractedText: resumeText,
      },
    });

    const jobDescriptionRecord = await prisma.jobDescription.create({
      data: {
        userId: session.user.id,
        title: String(jobTitle || "").trim(),
        company: String(company || "").trim(),
        content: String(jobDescription || "").trim(),
      },
    });

    const aiResult = await analyzeResumeWithAI(
      resumeText,
      String(jobTitle || "").trim(),
      String(company || "").trim(),
      String(jobDescription || "").trim(),
    );
    console.log("AI Analysis Result:", aiResult);

    const matchScore = calculateMatchScore(aiResult);

    const analysisRecord = await prisma.analysis.create({
      data:{
        userId:session.user.id,
        resumeId:resumeRecord.id,
        jobDescriptionId:jobDescriptionRecord.id,
        matchScore: matchScore,
        result:aiResult
      }
    })

    return Response.json({
      message: "Analysis complete successfully",
      analysisId: analysisRecord.id,
    });
  } catch (error) {
    console.error("Resume analysis error:", error);

    return Response.json(
      { error: "Failed to process the resume" },
      { status: 500 },
    );
  }
}
