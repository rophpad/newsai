import { NextResponse } from "next/server";

import { answerArticleQuestionWithAi } from "@/lib/afri-ai";
import { answerArticleQuestion, articleNotFoundResponse, getArticlePayload, isArticleLanguage, retrieveArticleParagraphs } from "@/lib/article-api";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const language = body?.language ?? "english";
  const question = typeof body?.question === "string" ? body.question.trim() : "";
  const articleInput = body?.article;

  if (!isArticleLanguage(language)) {
    return NextResponse.json(articleNotFoundResponse(language), { status: 400 });
  }

  if (!question) {
    return NextResponse.json({ error: "Question is required" }, { status: 400 });
  }

  const articlePayload = getArticlePayload(language);
  const articleSource =
    typeof articleInput?.title === "string" &&
    typeof articleInput?.label === "string" &&
    Array.isArray(articleInput?.paragraphs) &&
    articleInput.paragraphs.every((paragraph: unknown) => typeof paragraph === "string")
      ? {
          title: articleInput.title,
          label: articleInput.label,
          paragraphs: articleInput.paragraphs,
        }
      : {
          title: articlePayload.article.title,
          label: articlePayload.label,
          paragraphs: [...articlePayload.paragraphs],
        };

  const retrievedParagraphs = retrieveArticleParagraphs(question, articleSource);

  try {
    const response = await answerArticleQuestionWithAi(question, language, articleSource, retrievedParagraphs);

    return NextResponse.json({
      success: true,
      data: {
        question,
        answer: response.answer,
        language,
        sources: retrievedParagraphs.map((item) => ({
          paragraph: item.paragraph,
          text: item.text,
        })),
      },
    });
  } catch (error) {
    const response = answerArticleQuestion(question, language);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to answer question",
        data: {
          question,
          answer: response.answer,
          language,
          sources: response.sources.map((paragraph) => ({
            paragraph,
            text: articleSource.paragraphs[paragraph - 1],
          })),
        },
      },
      { status: 502 },
    );
  }
}
