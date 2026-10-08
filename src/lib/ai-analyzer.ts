import z from "zod";
import { buildJdMatchPrompt } from "./ai-prompt";
import { jdMatchSchema, type JdMatchResult } from "./ai-schema";
import { groq } from "@/lib/groq";

export async function analyzeResumeWithAI(
  resumeText: string,
  jobTitle: string,
  company: string,
  jobDescription: string,
): Promise<JdMatchResult> {
  const prompt = buildJdMatchPrompt(
    resumeText,
    jobTitle,
    company,
    jobDescription,
  );

  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "system",
        content:
          "You are an expert resume and job description analyzer. Return only the structured JSON requested by the schema.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0,
    max_completion_tokens: 4000,

    response_format: {
      type: "json_schema",
      json_schema: {
        name: "jd_match_analysis",
        strict: true,
        schema: z.toJSONSchema(jdMatchSchema),
      },
    },
  });

  const content = response.choices[0]?.message.content;

  if (!content) {
    throw new Error("Ai returned an empty response");
  }

  const parsedJson: unknown = JSON.parse(content);

  const result = jdMatchSchema.safeParse(parsedJson);

  if (!result.success) {
    console.error("AI response validation failed:", result.error);
    throw new Error("Ai returned invalid analysis data");
  }

  return result.data;
}
