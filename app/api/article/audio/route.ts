import { NextResponse } from "next/server";

import { synthesizeArticleAudioWithAi } from "@/lib/afri-ai";
import { articleNotFoundResponse, getAudioPayload, isArticleLanguage } from "@/lib/article-api";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const language = body?.language ?? "english";
  const articleInput = body?.article;

  if (!isArticleLanguage(language)) {
    return NextResponse.json(articleNotFoundResponse(language), { status: 400 });
  }

  const customArticle =
    typeof articleInput?.title === "string" &&
    typeof articleInput?.label === "string" &&
    typeof articleInput?.text === "string" &&
    Array.isArray(articleInput?.paragraphs) &&
    articleInput.paragraphs.every((paragraph: unknown) => typeof paragraph === "string")
      ? {
          title: articleInput.title,
          label: articleInput.label,
          text: articleInput.text,
          paragraphs: articleInput.paragraphs,
        }
      : undefined;

  try {
    const data = await synthesizeArticleAudioWithAi(language, customArticle);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    const fallback = getAudioPayload(language);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate audio",
        data: {
          ...fallback,
          meta: {
            provider: "afri",
            model: process.env.AFRI_AUDIO_MODEL ?? "gpt-audio-1.5",
            voice: process.env.AFRI_AUDIO_VOICE ?? "nova",
            mode: "fallback",
          },
        },
      },
      { status: 502 },
    );
  }
}
