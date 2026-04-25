import { Globe, Pause, Play, Sparkles, Volume2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { article, articleBody } from "@/lib/article-content";
import { cn } from "@/lib/utils";

import { ArticleContent, ArticleLanguage, ArticleLanguageKey, ArticleSummaryPoint, PanelMode } from "./types";

const languages = Object.entries(articleBody) as Array<[ArticleLanguageKey, ArticleLanguage]>;

type ArticleBottomPanelProps = {
  activePanel: Exclude<PanelMode, null>;
  activeLanguage: ArticleLanguageKey;
  currentArticle: ArticleContent;
  isPlaying: boolean;
  isAudioLoading: boolean;
  isSummaryLoading: boolean;
  isTranslationLoading: boolean;
  audioError: string | null;
  audioProgress: number;
  audioElapsedLabel: string;
  audioDurationLabel: string;
  audioVoiceLabel: string;
  languageError: string | null;
  summaryError: string | null;
  summaryPoints: ArticleSummaryPoint[];
  onClose: () => void;
  onLanguageChange: (language: ArticleLanguageKey) => void;
  onPlaybackToggle: () => void;
};

export function ArticleBottomPanel({
  activePanel,
  activeLanguage,
  currentArticle,
  isPlaying,
  isAudioLoading,
  isSummaryLoading,
  isTranslationLoading,
  audioError,
  audioProgress,
  audioElapsedLabel,
  audioDurationLabel,
  audioVoiceLabel,
  languageError,
  onClose,
  onLanguageChange,
  onPlaybackToggle,
  summaryError,
  summaryPoints,
}: ArticleBottomPanelProps) {
  return (
    <div className="fixed inset-x-0 bottom-4 z-50 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[1.75rem] border border-accent/20 bg-[linear-gradient(160deg,rgba(40,82,61,0.98),rgba(24,45,33,0.98))] p-4 text-accent-foreground shadow-2xl backdrop-blur sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            {activePanel === "audio" ? (
              <button
                type="button"
                aria-label={isPlaying ? "Pause audio" : "Play audio"}
                disabled={isAudioLoading}
                className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-accent transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/60"
                onClick={onPlaybackToggle}
              >
                {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
              </button>
            ) : (
              <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10 text-accent-foreground">
                {activePanel === "language" ? <Globe className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
              </div>
            )}
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-accent-foreground/60">
                {activePanel === "language"
                  ? "Change language"
                  : activePanel === "summary"
                    ? "Article summary"
                    : "Audio article"}
              </p>
              <h2 className="font-serif text-xl leading-tight sm:text-2xl">
                {activePanel === "language"
                  ? "Choose article language"
                  : activePanel === "summary"
                    ? "Key points from the story"
                    : article.title}
              </h2>
              <p className="mt-1 text-sm text-accent-foreground/70">
                {activePanel === "language"
                  ? isTranslationLoading
                    ? "Updating article language."
                    : `Reading in ${currentArticle.label}.`
                  : activePanel === "summary"
                    ? isSummaryLoading
                      ? "Generating summary."
                      : "Quick points from this story."
                    : isAudioLoading
                      ? "Generating audio narration."
                      : "Listen in the current article language."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:self-start">
            <div className="rounded-full bg-white/10 px-4 py-2 text-sm text-accent-foreground/80">{currentArticle.label}</div>
            <Button
              variant="ghost"
              size="icon"
              className="text-accent-foreground hover:bg-white/10 hover:text-accent-foreground"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {activePanel === "language" ? (
          <div className="mt-5 space-y-4">
            <div className="flex flex-wrap gap-3">
              {languages.map(([key, value]) => (
                <Button
                  key={key}
                  variant={activeLanguage === key ? "default" : "outline"}
                  disabled={isTranslationLoading}
                  className={cn(
                    "border-white/15 text-accent-foreground",
                    activeLanguage === key
                      ? "bg-white text-accent hover:bg-white/90"
                      : "bg-white/5 hover:bg-white/10 hover:text-accent-foreground",
                  )}
                  onClick={() => onLanguageChange(key)}
                >
                  {value.label}
                </Button>
              ))}
            </div>
            {languageError ? <p className="text-sm text-red-200">{languageError}</p> : null}
          </div>
        ) : null}

        {activePanel === "summary" ? (
          <div className="mt-5 flex flex-col gap-3">
            {isSummaryLoading ? <p className="text-sm text-accent-foreground/80">Generating summary...</p> : null}
            {!isSummaryLoading && summaryPoints.length === 0 ? (
              <p className="text-sm text-accent-foreground/80">No summary available yet.</p>
            ) : null}
            {summaryError ? <p className="text-sm text-red-200">{summaryError}</p> : null}
            {summaryPoints.map((point, index) => (
              <div
                key={`${point.id}-${point.text}`}
                className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-accent-foreground/80"
              >
                <span className="mb-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-semibold text-accent">
                  {index + 1}
                </span>
                <p>{point.text}</p>
              </div>
            ))}
          </div>
        ) : null}

        {activePanel === "audio" ? (
          <div className="mt-4 space-y-3">
            {isAudioLoading ? <p className="text-sm text-accent-foreground/80">Generating audio...</p> : null}
            {audioError ? <p className="text-sm text-red-200">{audioError}</p> : null}
            <Progress value={audioProgress} className="bg-white/15 [&>div]:bg-primary" />
            <div className="flex items-center justify-between text-sm text-accent-foreground/70">
              <span>{audioElapsedLabel} elapsed</span>
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <span>{audioVoiceLabel}</span>
              </div>
              <span>{audioDurationLabel} total</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
