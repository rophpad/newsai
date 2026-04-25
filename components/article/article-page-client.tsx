"use client";

import { useEffect, useRef, useState } from "react";

import { article, articleBody, summaryPoints as fallbackSummaryPoints } from "@/lib/article-content";

import { ArticleActionDock } from "./article-action-dock";
import { ArticleBottomPanel } from "./article-bottom-panel";
import { ArticleHero } from "./article-hero";
import { ArticleQaSection } from "./article-qa-section";
import { ArticleReader } from "./article-reader";
import { ArticleContent, ArticleLanguageKey, ArticleSummaryPoint, PanelMode } from "./types";

type TranslateResponse = {
  success: boolean;
  error?: string;
  data?: {
    article?: {
      title: string;
      dek: string;
    };
    label?: string;
    paragraphs?: string[];
  };
};

type SummaryResponse = {
  success: boolean;
  error?: string;
  data?: {
    points?: ArticleSummaryPoint[];
  };
};

type AudioResponse = {
  success: boolean;
  error?: string;
  data?: {
    article?: {
      durationSeconds?: number;
      voice?: string;
    };
    audio?: {
      data?: string;
      mimeType?: string;
    };
    meta?: {
      voice?: string;
    };
  };
};

type AudioAsset = {
  src: string;
  durationSeconds: number;
  voice: string;
};

const initialArticle: ArticleContent = {
  title: article.title,
  dek: article.dek,
  label: articleBody.english.label,
  paragraphs: [...articleBody.english.paragraphs],
};

const initialSummary: Record<ArticleLanguageKey, ArticleSummaryPoint[]> = {
  english: fallbackSummaryPoints.map((point, index) => ({ id: index + 1, text: point })),
  french: [],
  fon: [],
};

export function ArticlePageClient() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeAudioUrlRef = useRef<string | null>(null);
  const shouldAutoplayAudioRef = useRef(false);
  const [activeLanguage, setActiveLanguage] = useState<ArticleLanguageKey>("english");
  const [activePanel, setActivePanel] = useState<PanelMode>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioByLanguage, setAudioByLanguage] = useState<Partial<Record<ArticleLanguageKey, AudioAsset>>>({});
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<ArticleContent>(initialArticle);
  const [summaryByLanguage, setSummaryByLanguage] = useState<Record<ArticleLanguageKey, ArticleSummaryPoint[]>>(initialSummary);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isTranslationLoading, setIsTranslationLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [languageError, setLanguageError] = useState<string | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const currentSummary = summaryByLanguage[activeLanguage] ?? [];
  const currentAudio = audioByLanguage[activeLanguage] ?? null;
  const audioDurationSeconds = currentAudio?.durationSeconds ?? 0;
  const audioProgress = audioDurationSeconds > 0 ? Math.min((audioCurrentTime / audioDurationSeconds) * 100, 100) : 0;
  const audioVoiceLabel = currentAudio?.voice ?? "voice";
  const isAiActing = isSummaryLoading || isTranslationLoading || isAudioLoading;

  function formatDuration(value: number) {
    const minutes = Math.floor(value / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(value % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${seconds}`;
  }

  function handlePanelToggle(mode: Exclude<PanelMode, null>) {
    setActivePanel((current) => (current === mode ? null : mode));
  }

  async function handleLanguageChange(language: ArticleLanguageKey) {
    if (language === activeLanguage || isTranslationLoading) {
      return;
    }

    setIsTranslationLoading(true);
    setLanguageError(null);

    try {
      const response = await fetch("/api/article/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ language }),
      });

      const payload = (await response.json().catch(() => null)) as TranslateResponse | null;
      const translatedArticle = payload?.data;

      if (translatedArticle?.article?.title && translatedArticle.article.dek && Array.isArray(translatedArticle.paragraphs) && translatedArticle.label) {
        setCurrentArticle({
          title: translatedArticle.article.title,
          dek: translatedArticle.article.dek,
          label: translatedArticle.label,
          paragraphs: [...translatedArticle.paragraphs],
        });
        setActiveLanguage(language);
      }

      if (!response.ok) {
        setLanguageError(payload?.error ?? "Failed to update language.");
      }
    } catch {
      setLanguageError("Failed to update language.");
    } finally {
      setIsTranslationLoading(false);
    }
  }

  async function handleAudioToggle() {
    if (isAudioLoading) {
      return;
    }

    const existingAudio = audioRef.current;

    if (existingAudio && currentAudio) {
      if (existingAudio.paused) {
        try {
          await existingAudio.play();
          setIsPlaying(true);
        } catch {
          setAudioError("Failed to start audio playback.");
        }
      } else {
        existingAudio.pause();
        setIsPlaying(false);
      }

      return;
    }

    setIsAudioLoading(true);
    setAudioError(null);
    shouldAutoplayAudioRef.current = true;

    try {
      const response = await fetch("/api/article/audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: activeLanguage,
          article: {
            title: currentArticle.title,
            label: currentArticle.label,
            text: currentArticle.paragraphs.join("\n\n"),
            paragraphs: currentArticle.paragraphs,
          },
        }),
      });

      const payload = (await response.json().catch(() => null)) as AudioResponse | null;
      const audioData = payload?.data?.audio?.data;
      const mimeType = payload?.data?.audio?.mimeType ?? "audio/mpeg";
      const durationSeconds = payload?.data?.article?.durationSeconds ?? 0;
      const voice = payload?.data?.meta?.voice ?? payload?.data?.article?.voice ?? "nova";

      if (!response.ok || !audioData) {
        shouldAutoplayAudioRef.current = false;
        setAudioError(payload?.error ?? "Failed to generate audio.");
        return;
      }

      const src = `data:${mimeType};base64,${audioData}`;

      setAudioByLanguage((current) => ({
        ...current,
        [activeLanguage]: {
          src,
          durationSeconds,
          voice,
        },
      }));
    } catch {
      shouldAutoplayAudioRef.current = false;
      setAudioError("Failed to generate audio.");
    } finally {
      setIsAudioLoading(false);
    }
  }

  useEffect(() => {
    if (activePanel !== "summary" || summaryByLanguage[activeLanguage].length > 0 || isSummaryLoading) {
      return;
    }

    let cancelled = false;

    async function loadSummary() {
      setIsSummaryLoading(true);
      setSummaryError(null);

      try {
        const response = await fetch("/api/article/summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ language: activeLanguage }),
        });

        const payload = (await response.json().catch(() => null)) as SummaryResponse | null;
        const points = payload?.data?.points;

        if (!cancelled && Array.isArray(points)) {
          setSummaryByLanguage((current) => ({
            ...current,
            [activeLanguage]: points,
          }));
        }

        if (!cancelled && !response.ok) {
          setSummaryError(payload?.error ?? "Failed to generate summary.");
        }
      } catch {
        if (!cancelled) {
          setSummaryError("Failed to generate summary.");
        }
      } finally {
        if (!cancelled) {
          setIsSummaryLoading(false);
        }
      }
    }

    void loadSummary();

    return () => {
      cancelled = true;
    };
  }, [activeLanguage, activePanel, isSummaryLoading, summaryByLanguage]);

  useEffect(() => {
    if (activePanel !== "audio" || !currentAudio) {
      return;
    }

    if (activeAudioUrlRef.current && activeAudioUrlRef.current !== currentAudio.src && activeAudioUrlRef.current.startsWith("blob:")) {
      URL.revokeObjectURL(activeAudioUrlRef.current);
    }

    const audio = new Audio(currentAudio.src);
    audioRef.current = audio;
    activeAudioUrlRef.current = currentAudio.src;
    setAudioCurrentTime(0);
    setIsPlaying(false);

    const handleTimeUpdate = () => {
      setAudioCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setAudioCurrentTime(audio.duration || currentAudio.durationSeconds);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);

    if (shouldAutoplayAudioRef.current) {
      shouldAutoplayAudioRef.current = false;
      void audio.play().catch(() => {
        setAudioError("Failed to start audio playback.");
        setIsPlaying(false);
      });
    }

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
      if (audioRef.current === audio) {
        audioRef.current = null;
      }
    };
  }, [activeLanguage, activePanel, currentAudio]);

  useEffect(() => {
    if (activePanel !== "audio" || currentAudio || isAudioLoading) {
      return;
    }

    void handleAudioToggle();
  }, [activeLanguage, activePanel, currentAudio, isAudioLoading]);

  useEffect(() => {
    if (activePanel === "audio") {
      return;
    }

    audioRef.current?.pause();
    setIsPlaying(false);
    setAudioCurrentTime(0);
    shouldAutoplayAudioRef.current = false;
  }, [activePanel]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (activeAudioUrlRef.current?.startsWith("blob:")) {
        URL.revokeObjectURL(activeAudioUrlRef.current);
      }
    };
  }, []);

  return (
    <main className="relative overflow-hidden pb-36">
      <div className="absolute inset-0 -z-10 bg-hero-grid" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <ArticleHero title={currentArticle.title} dek={currentArticle.dek} />
        <ArticleActionDock activePanel={activePanel} onToggle={handlePanelToggle} />
        {isAiActing ? (
          <div className="-mt-4 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.24s]" />
              <span className="h-3 w-3 rounded-full bg-primary animate-bounce [animation-delay:-0.12s]" />
              <span className="h-2.5 w-2.5 rounded-full bg-primary/70 animate-bounce" />
            </div>
            <p className="text-sm text-muted-foreground">Loading</p>
          </div>
        ) : null}
        <ArticleReader currentArticle={currentArticle} />
        <ArticleQaSection activeLanguage={activeLanguage} currentArticle={currentArticle} />
      </div>

      {activePanel ? (
        <ArticleBottomPanel
          activePanel={activePanel}
          activeLanguage={activeLanguage}
          currentArticle={currentArticle}
          audioDurationLabel={formatDuration(audioDurationSeconds)}
          audioElapsedLabel={formatDuration(audioCurrentTime)}
          audioError={audioError}
          audioProgress={audioProgress}
          audioVoiceLabel={audioVoiceLabel}
          isAudioLoading={isAudioLoading}
          isPlaying={isPlaying}
          isSummaryLoading={isSummaryLoading}
          isTranslationLoading={isTranslationLoading}
          languageError={languageError}
          onClose={() => setActivePanel(null)}
          onLanguageChange={handleLanguageChange}
          onPlaybackToggle={handleAudioToggle}
          summaryError={summaryError}
          summaryPoints={currentSummary}
        />
      ) : null}
    </main>
  );
}
