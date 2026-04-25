import { NextResponse } from "next/server";

import { translateArticleWithAi } from "@/lib/afri-ai";
import { articleNotFoundResponse, getArticlePayload, isArticleLanguage } from "@/lib/article-api";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const language = body?.language;

  if (!isArticleLanguage(language)) {
    return NextResponse.json(articleNotFoundResponse(language), { status: 400 });
  }

  try {
    const data = await translateArticleWithAi(language);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    const fallback = getArticlePayload(language);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to translate article",
        data: {
          ...fallback,
          meta: {
            provider: "afri",
            model: "gpt-5.4-nano",
            mode: "fallback",
          },
        },
      },
      { status: 502 },
    );
  }
}
