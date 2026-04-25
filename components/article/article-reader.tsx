import { Languages } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { ArticleContent } from "./types";

type ArticleReaderProps = {
  currentArticle: ArticleContent;
};

export function ArticleReader({ currentArticle }: ArticleReaderProps) {
  return (
    <section>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardDescription>Article body</CardDescription>
              <CardTitle>Read the full story</CardTitle>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground">
              <Languages className="h-4 w-4 text-primary" />
              {currentArticle.label}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 text-[15px] leading-8 text-foreground/90 sm:text-base">
            {currentArticle.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
