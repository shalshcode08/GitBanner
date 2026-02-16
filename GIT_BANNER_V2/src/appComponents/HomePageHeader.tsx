import ThemeToggleBtn from "./ThemeToggle";

const HomepageHeader = () => {
  return (
    <div className="w-full flex items-center justify-between">
      <div className="text-foreground font-semibold">GIT BANNER</div>
      <ThemeToggleBtn />
    </div>
  );
};

export default HomepageHeader;
