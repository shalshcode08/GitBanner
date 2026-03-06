import { Link } from "react-router";
import DisplayCard from "../appComponents/DisplayCard";
import HomepageHeader from "../appComponents/HomePageHeader";
import { GitBannerHomepageMetaForCards } from "../utils/gitBannerHomepageMetaForCards";
import { useTheme } from "../context/ThemeProvider";

const Home = () => {
  const { theme } = useTheme();

  return (
    <div className="w-full min-h-screen flex flex-col bg-background">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <HomepageHeader />
        </div>
      </header>

      <div className="w-full max-w-3xl mx-auto flex flex-col gap-8 px-4 py-12">
        {/* Hero */}
        <div className="flex flex-col items-center text-center gap-3">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <span className="h-[6px] w-[6px] rounded-full bg-primary animate-pulse" />
            Free &amp; instant — no sign-up required
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-5xl font-bold tracking-tight text-foreground whitespace-nowrap mt-10">
            Your GitHub, as a banner.
          </h1>

          {/* Subtitle */}
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Generate stunning profile banners — contribution graphs, stats &amp;
            pinned repos. Sized for Twitter/X and LinkedIn.
          </p>
        </div>

        {/* Divider + label */}
        <div className="flex items-center justify-start border-b border-border pb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Pick a template
          </p>
        </div>

        {/* Cards — vertical stack */}
        {Object.values(GitBannerHomepageMetaForCards).length > 0 ? (
          <div className="flex flex-col gap-4">
            {Object.values(GitBannerHomepageMetaForCards).map(
              (cardMeta, index) => (
                <Link to={cardMeta.link} key={index} className="w-full">
                  <DisplayCard
                    title={cardMeta.title}
                    description={cardMeta.description}
                    image={cardMeta.image[theme]}
                    link={cardMeta.link}
                  />
                </Link>
              ),
            )}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm text-center">
            No templates available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
