import { Link } from "react-router";
import DisplayCard from "../appComponents/DisplayCard";
import HomepageHeader from "../appComponents/HomePageHeader";
import { GitBannerHomepageMetaForCards } from "../utils/gitBannerHomepageMetaForCards";
import { useTheme } from "../context/ThemeProvider";

const Home = () => {
  const { theme } = useTheme();
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center py-10">
      <div className="w-full max-w-3xl flex flex-col gap-8 px-4">
        <div className="w-full flex justify-center">
          <HomepageHeader />
        </div>

        {GitBannerHomepageMetaForCards &&
        Object.values(GitBannerHomepageMetaForCards).length > 0 ? (
          <div className="flex flex-col gap-6 w-full">
            {Object.values(GitBannerHomepageMetaForCards).map(
              (cardMeta, index) => (
                <Link
                  to={cardMeta.link}
                  key={index}
                  className="w-full flex justify-center"
                >
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
          <p className="text-muted-foreground font-semibold text-sm text-center">
            No data to show
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
