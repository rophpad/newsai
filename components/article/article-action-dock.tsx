import { Headphones, Languages, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

import { PanelMode } from "./types";

type ArticleActionDockProps = {
  activePanel: PanelMode;
  onToggle: (mode: Exclude<PanelMode, null>) => void;
};

export function ArticleActionDock({ activePanel, onToggle }: ArticleActionDockProps) {
  return (
    <section className="space-y-5">
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/95 p-2 shadow-sm backdrop-blur">
          <button
            type="button"
            aria-label="Change article language"
            className={cn(
              "inline-flex h-12 w-12 items-center justify-center rounded-full transition-colors",
              activePanel === "language"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            onClick={() => onToggle("language")}
          >
            <Languages className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Summarize article"
            className={cn(
              "inline-flex h-12 w-12 items-center justify-center rounded-full transition-colors",
              activePanel === "summary"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            onClick={() => onToggle("summary")}
          >
            <Sparkles className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Open audio player"
            className={cn(
              "inline-flex h-12 w-12 items-center justify-center rounded-full transition-colors",
              activePanel === "audio"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            onClick={() => onToggle("audio")}
          >
            <Headphones className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
