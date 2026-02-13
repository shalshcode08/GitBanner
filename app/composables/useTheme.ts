export const useTheme = () => {
  const colorMode = useColorMode();

  const setTheme = (theme: "light" | "dark" | "system") => {
    colorMode.preference = theme;
  };

  return {
    preference: colorMode.preference,
    value: colorMode.value,
    setTheme,
  };
};
