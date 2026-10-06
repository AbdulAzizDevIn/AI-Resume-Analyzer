import { groq } from "@/lib/groq";

export async function GET() {
  try {
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "user",
          content: "Say hello and tell me which modle you are?",
        },
      ],
    });

    return Response.json({
      message: response.choices[0]?.message?.content,
    });
  } catch (error) {
    console.error("Groq test error:", error);

    return Response.json(
      { error: "Groq request failed" },
      { status: 500 },
    );
  }
}