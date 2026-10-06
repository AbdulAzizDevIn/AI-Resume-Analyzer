import { ai } from "@/lib/gemini";

export async function GET() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: "Say hello ",
    });

    return Response.json({
      message: response.text,
    });
  } catch (error) {
    console.error("Gemini test error:", error);

    return Response.json({ error: "Gemini request failed" }, { status: 500 });
  }
}
