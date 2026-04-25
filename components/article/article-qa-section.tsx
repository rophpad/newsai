"use client";

import { useState } from "react";

import { Mic } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import { ArticleContent, ArticleLanguageKey } from "./types";

type QaResponse = {
  success: boolean;
  error?: string;
  data?: {
    answer?: string;
    sources?: Array<{
      paragraph: number;
      text: string;
    }>;
  };
};

type ArticleQaSectionProps = {
  activeLanguage: ArticleLanguageKey;
  currentArticle: ArticleContent;
};

export function ArticleQaSection({ activeLanguage, currentArticle }: ArticleQaSectionProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Array<{ paragraph: number; text: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleAsk() {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/article/qa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: activeLanguage,
          question: trimmedQuestion,
          article: {
            title: currentArticle.title,
            label: currentArticle.label,
            paragraphs: currentArticle.paragraphs,
          },
        }),
      });

      const payload = (await response.json().catch(() => null)) as QaResponse | null;

      setAnswer(payload?.data?.answer ?? "");
      setSources(payload?.data?.sources ?? []);

      if (!response.ok) {
        setError(payload?.error ?? "Failed to answer question.");
      }
    } catch {
      setError("Failed to answer question.");
      setAnswer("");
      setSources([]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardDescription>Bottom section</CardDescription>
              <CardTitle>Ask questions about the article</CardTitle>
            </div>
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Mic className="h-5 w-5" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea placeholder="Ask a question about this article" value={question} onChange={(event) => setQuestion(event.target.value)} />
          <Button className="w-full justify-center sm:w-auto" disabled={isLoading || !question.trim()} onClick={handleAsk}>
            {isLoading ? "Thinking..." : "Ask the article"}
          </Button>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {answer ? (
            <div className="space-y-4 rounded-[1.5rem] border border-border/70 bg-muted/40 p-5">
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Answer</p>
                <p className="text-sm leading-7 text-muted-foreground">{answer}</p>
              </div>
              {sources.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">Sources</p>
                  {sources.map((source) => (
                    <div key={`${source.paragraph}-${source.text}`} className="rounded-[1.25rem] bg-background p-4 text-sm leading-7 text-muted-foreground">
                      <p className="mb-2 font-medium text-foreground">Paragraph {source.paragraph}</p>
                      <p>{source.text}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </section>
  );
}
