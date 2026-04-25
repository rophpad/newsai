import { article, articleBody, summaryPoints } from "@/lib/article-content";

export type ArticleLanguageKey = keyof typeof articleBody;
export type ArticleSourceInput = {
  title: string;
  label: string;
  paragraphs: string[];
};

type QaResponse = {
  answer: string;
  sources: number[];
};

type RetrievedParagraph = {
  paragraph: number;
  text: string;
  score: number;
};

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "how",
  "in",
  "into",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "their",
  "this",
  "to",
  "what",
  "when",
  "where",
  "which",
  "who",
  "why",
  "with",
]);

export const supportedArticleLanguages = Object.keys(articleBody) as ArticleLanguageKey[];

export function isArticleLanguage(value: unknown): value is ArticleLanguageKey {
  return typeof value === "string" && supportedArticleLanguages.includes(value as ArticleLanguageKey);
}

export function getArticlePayload(language: ArticleLanguageKey) {
  const localizedArticle = articleBody[language];

  return {
    article,
    language,
    label: localizedArticle.label,
    paragraphs: localizedArticle.paragraphs,
  };
}

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token && !STOP_WORDS.has(token));
}

export function retrieveArticleParagraphs(question: string, articleSource: ArticleSourceInput, limit = 3): RetrievedParagraph[] {
  const queryTokens = tokenize(question);

  return articleSource.paragraphs
    .map((text, index) => {
      const paragraphTokens = tokenize(text);
      const tokenSet = new Set(paragraphTokens);
      const overlap = queryTokens.reduce((score, token) => score + (tokenSet.has(token) ? 1 : 0), 0);
      const phraseBonus = question
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
        .some((term) => term.length > 4 && text.toLowerCase().includes(term.toLowerCase()))
        ? 1
        : 0;

      return {
        paragraph: index + 1,
        text,
        score: overlap + phraseBonus,
      };
    })
    .sort((a, b) => b.score - a.score || a.paragraph - b.paragraph)
    .slice(0, limit)
    .filter((item, index, items) => item.score > 0 || index < Math.min(2, items.length));
}

export function getSummaryPayload(language: ArticleLanguageKey) {
  return {
    article: {
      title: article.title,
      language,
      label: articleBody[language].label,
    },
    points: summaryPoints.map((point, index) => ({
      id: index + 1,
      text: point,
    })),
  };
}

export function getAudioPayload(language: ArticleLanguageKey) {
  const localizedArticle = articleBody[language];
  const transcript = localizedArticle.paragraphs.join(" ");

  return {
    article: {
      title: article.title,
      language,
      label: localizedArticle.label,
      durationSeconds: 512,
      voice: "alloy",
      speed: 1,
    },
    audio: {
      url: null,
      mimeType: "audio/mpeg",
      transcript,
      status: "ready-for-tts",
    },
  };
}

export function answerArticleQuestion(question: string, language: ArticleLanguageKey): QaResponse {
  const normalizedQuestion = question.trim().toLowerCase();

  if (normalizedQuestion.includes("solar") || normalizedQuestion.includes("land") || normalizedQuestion.includes("farmland")) {
    return {
      answer:
        "The story says floating solar avoids the land tradeoff. The city can add power generation on sheltered water without taking farmland or housing land out of use.",
      sources: [1, 2],
    };
  }

  if (
    normalizedQuestion.includes("ai") ||
    normalizedQuestion.includes("assistant") ||
    normalizedQuestion.includes("monitor") ||
    normalizedQuestion.includes("maintenance")
  ) {
    return {
      answer:
        "AI is used as an operations layer. It flags panel fouling, predicts battery strain, and explains output drops in plain language for local operators.",
      sources: [3],
    };
  }

  if (
    normalizedQuestion.includes("impact") ||
    normalizedQuestion.includes("community") ||
    normalizedQuestion.includes("clinic") ||
    normalizedQuestion.includes("student")
  ) {
    return {
      answer:
        "The article ties the project to everyday reliability: clinics keep refrigeration running, market vendors use fans longer, and students face fewer study interruptions.",
      sources: [4],
    };
  }

  if (normalizedQuestion.includes("next") || normalizedQuestion.includes("phase") || normalizedQuestion.includes("cooperative")) {
    return {
      answer:
        "The next phase tests whether community energy cooperatives can own part of future floating arrays so the economic gains stay closer to affected neighborhoods.",
      sources: [5],
    };
  }

  return {
    answer:
      `This article in ${articleBody[language].label} focuses on floating solar, grid reliability, lower diesel use, and community impact. Ask about land use, AI operations, local benefits, or the next project phase for a more specific answer.`,
    sources: [1, 2, 3, 4, 5],
  };
}

export function articleNotFoundResponse(language: unknown) {
  return {
    error: "Unsupported language",
    supportedLanguages: supportedArticleLanguages,
    received: language ?? null,
  };
}
