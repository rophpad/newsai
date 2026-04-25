import { article, articleBody } from "@/lib/article-content";
import { ArticleLanguageKey, ArticleSourceInput } from "@/lib/article-api";

const AFRI_BASE_URL = process.env.AFRI_BASE_URL ?? "https://build.lewisnote.com/v1";
const AFRI_MODEL = "gpt-5.4-nano";
const AFRI_AUDIO_MODEL = process.env.AFRI_AUDIO_MODEL ?? "gpt-audio-1.5";
const AFRI_AUDIO_VOICE = process.env.AFRI_AUDIO_VOICE ?? "nova";

const NEWS_AI_SYSTEM_PROMPT = [
  "You are the NewsAI article intelligence system.",
  "You help with article translation and article summarization.",
  "Preserve the original meaning, factual details, and editorial tone.",
  "Never invent facts that are not present in the source article.",
  "When the user asks for JSON, return valid JSON only with no markdown fences or extra commentary.",
].join(" ");

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | Array<{ type?: string; text?: string }>;
    };
  }>;
  error?: {
    message?: string;
  };
};

type TranslationResult = {
  title: string;
  dek: string;
  label: string;
  paragraphs: string[];
};

type SummaryResult = {
  points: string[];
};

type RagAnswerResult = {
  answer: string;
};

type AudioSpeechErrorResponse = {
  error?: {
    message?: string;
  };
};

type ArticleAudioSource = {
  title: string;
  label: string;
  text: string;
  paragraphs: string[];
};

function getApiKey() {
  const apiKey = process.env.AFRI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing AFRI_API_KEY environment variable");
  }

  return apiKey;
}

function extractMessageContent(response: ChatCompletionResponse) {
  const content = response.choices?.[0]?.message?.content;

  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part?.text === "string" ? part.text : ""))
      .join("")
      .trim();
  }

  return "";
}

function parseJsonResponse<T>(content: string): T {
  const normalized = content.trim().replace(/^```json\s*/i, "").replace(/^```/, "").replace(/```$/, "").trim();

  return JSON.parse(normalized) as T;
}

async function runAfriChatJson<T>(userPrompt: string): Promise<T> {
  const response = await fetch(`${AFRI_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: AFRI_MODEL,
      messages: [
        {
          role: "system",
          content: NEWS_AI_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.2,
    }),
  });

  const payload = (await response.json().catch(() => null)) as ChatCompletionResponse | null;

  if (!response.ok) {
    const message = payload?.error?.message ?? `AI request failed with status ${response.status}`;
    throw new Error(message);
  }

  const content = extractMessageContent(payload ?? {});

  if (!content) {
    throw new Error("AI response did not include any message content");
  }

  return parseJsonResponse<T>(content);
}

export async function translateArticleWithAi(language: ArticleLanguageKey) {
  if (language === "english") {
    return {
      article,
      language,
      label: articleBody.english.label,
      paragraphs: articleBody.english.paragraphs,
      meta: {
        provider: "afri",
        model: AFRI_MODEL,
        mode: "source",
      },
    };
  }

  const targetLabel = articleBody[language].label;
  const sourceArticle = articleBody.english;

  const prompt = [
    `Translate this news article into ${targetLabel}.`,
    "Keep the meaning precise and preserve the article tone.",
    'Return JSON with this exact shape: {"title": string, "dek": string, "label": string, "paragraphs": string[] }.',
    `Use this exact label value: \"${targetLabel}\".`,
    `Return exactly ${sourceArticle.paragraphs.length} paragraphs.`,
    "Source article JSON:",
    JSON.stringify({
      title: article.title,
      dek: article.dek,
      label: sourceArticle.label,
      paragraphs: sourceArticle.paragraphs,
    }),
  ].join("\n\n");

  const translation = await runAfriChatJson<TranslationResult>(prompt);

  if (!Array.isArray(translation.paragraphs) || translation.paragraphs.length !== sourceArticle.paragraphs.length) {
    throw new Error("AI translation response returned an invalid paragraph structure");
  }

  return {
    article: {
      ...article,
      title: translation.title,
      dek: translation.dek,
    },
    language,
    label: translation.label || targetLabel,
    paragraphs: translation.paragraphs,
    meta: {
      provider: "afri",
      model: AFRI_MODEL,
      mode: "ai",
    },
  };
}

export async function summarizeArticleWithAi(language: ArticleLanguageKey) {
  const localizedArticle = articleBody[language];

  const prompt = [
    `Summarize this article in ${localizedArticle.label}.`,
    "Write exactly 3 concise summary points.",
    "Each point must be factual, grounded in the article, and useful to a reader skimming the story.",
    'Return JSON with this exact shape: {"points": string[] }.',
    "Article JSON:",
    JSON.stringify({
      title: article.title,
      dek: article.dek,
      label: localizedArticle.label,
      paragraphs: localizedArticle.paragraphs,
    }),
  ].join("\n\n");

  const summary = await runAfriChatJson<SummaryResult>(prompt);

  if (!Array.isArray(summary.points) || summary.points.length === 0) {
    throw new Error("AI summary response returned no summary points");
  }

  return {
    article: {
      title: article.title,
      language,
      label: localizedArticle.label,
    },
    points: summary.points.slice(0, 3).map((point, index) => ({
      id: index + 1,
      text: point,
    })),
    meta: {
      provider: "afri",
      model: AFRI_MODEL,
      mode: "ai",
    },
  };
}

export async function answerArticleQuestionWithAi(
  question: string,
  language: ArticleLanguageKey,
  articleSource: ArticleSourceInput,
  contextParagraphs: Array<{ paragraph: number; text: string }>,
) {
  const prompt = [
    `Answer the reader question in ${articleSource.label}.`,
    "Answer only from the provided article context.",
    "If the context is insufficient, say so briefly instead of inventing facts.",
    'Return JSON with this exact shape: {"answer": string }.',
    `Question: ${question}`,
    "Context paragraphs:",
    ...contextParagraphs.map((item) => `[Paragraph ${item.paragraph}] ${item.text}`),
  ].join("\n\n");

  const result = await runAfriChatJson<RagAnswerResult>(prompt);

  if (!result.answer?.trim()) {
    throw new Error("AI Q&A response returned an empty answer");
  }

  return {
    answer: result.answer.trim(),
    meta: {
      provider: "afri",
      model: AFRI_MODEL,
      mode: "rag",
      language,
    },
  };
}

export async function synthesizeArticleAudioWithAi(language: ArticleLanguageKey, articleSource?: ArticleAudioSource) {
  const localizedArticle = articleBody[language];
  const source = articleSource ?? {
    title: article.title,
    label: localizedArticle.label,
    text: localizedArticle.paragraphs.join("\n\n"),
    paragraphs: [...localizedArticle.paragraphs],
  };
  const transcript = source.text.trim();

  const response = await fetch(`${AFRI_BASE_URL}/audio/speech`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: AFRI_AUDIO_MODEL,
      input: transcript,
      voice: AFRI_AUDIO_VOICE,
      response_format: "mp3",
    }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as AudioSpeechErrorResponse | null;
    const message = payload?.error?.message ?? `Audio request failed with status ${response.status}`;
    throw new Error(message);
  }

  const audioBuffer = Buffer.from(await response.arrayBuffer());

  return {
    article: {
      title: source.title,
      language,
      label: source.label,
      durationSeconds: 512,
      voice: AFRI_AUDIO_VOICE,
      model: AFRI_AUDIO_MODEL,
      speed: 1,
    },
    audio: {
      mimeType: "audio/mpeg",
      data: audioBuffer.toString("base64"),
      transcript,
      status: "generated",
    },
    meta: {
      provider: "afri",
      model: AFRI_AUDIO_MODEL,
      voice: AFRI_AUDIO_VOICE,
      mode: "ai",
    },
  };
}
