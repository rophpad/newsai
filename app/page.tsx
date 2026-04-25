import Link from "next/link";
import { ArrowRight, Globe, Headphones, Mic, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { landingFeatures } from "@/lib/article-content";

const icons = [Globe, Sparkles, Headphones, Mic];

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-hero-grid" />
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <section className="rounded-[2rem] border border-border/70 bg-[linear-gradient(140deg,rgba(255,251,247,0.96),rgba(246,240,232,0.9))] p-8 shadow-glow sm:p-10 lg:p-14">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>NewsAI</Badge>
            <Badge variant="secondary">AI-powered news experience</Badge>
          </div>
          <div className="mt-8 max-w-4xl space-y-6">
            <h1 className="text-balance font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Turn every article into a multilingual, listenable, interactive experience.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">
              NewsAI transforms static stories into article pages that readers can translate, summarize, listen to, and question directly.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/article" className={buttonVariants({ size: "lg" })}>
              Open article
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {landingFeatures.map((feature, index) => {
            const Icon = icons[index];

            return (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-sm leading-7">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </section>

        <section className="rounded-[2rem] border border-accent/15 bg-accent p-8 text-accent-foreground shadow-glow sm:p-10">
          <div className="max-w-3xl space-y-4">
            <Badge variant="secondary" className="bg-white/10 text-accent-foreground hover:bg-white/10">
              Reader tools
            </Badge>
            <h2 className="font-serif text-3xl leading-tight sm:text-4xl">
              Switch languages, get the summary, listen, and ask what matters without leaving the story.
            </h2>
            <Link href="/article" className={buttonVariants({ variant: "secondary", size: "lg" })}>
              Read the article
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
