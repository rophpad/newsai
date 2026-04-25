import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { article } from "@/lib/article-content";

type ArticleHeroProps = {
  title: string;
  dek: string;
};

export function ArticleHero({ title, dek }: ArticleHeroProps) {
  return (
    <section className="rounded-[2rem] border border-border/70 bg-[linear-gradient(140deg,rgba(255,251,247,0.96),rgba(246,240,232,0.9))] p-8 shadow-glow sm:p-10">
      <div className="flex flex-wrap items-center gap-3">
        <Badge>{article.category}</Badge>
        <Badge variant="secondary">Full article experience</Badge>
      </div>
      <div className="mt-6 max-w-4xl space-y-5">
        <h1 className="text-balance font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="text-lg leading-8 text-muted-foreground sm:text-xl">{dek}</p>
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-3 rounded-full bg-white/80 px-4 py-2">
          <Avatar className="h-9 w-9 border border-border/70">
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{article.author}</p>
            <p>{article.authorRole}</p>
          </div>
        </div>
        <div className="rounded-full bg-white/70 px-4 py-2">{article.source}</div>
        <div className="rounded-full bg-white/70 px-4 py-2">{article.published}</div>
        <div className="rounded-full bg-white/70 px-4 py-2">{article.readTime}</div>
      </div>
    </section>
  );
}
