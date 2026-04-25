import { articleBody } from "@/lib/article-content";

export type ArticleLanguageKey = keyof typeof articleBody;
export type ArticleLanguage = (typeof articleBody)[ArticleLanguageKey];
export type PanelMode = "language" | "summary" | "audio" | null;

export type ArticleContent = {
  title: string;
  dek: string;
  label: string;
  paragraphs: string[];
};

export type ArticleSummaryPoint = {
  id: number;
  text: string;
};
