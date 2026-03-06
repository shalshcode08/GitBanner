import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, useTheme } from "../../context/ThemeProvider";

// Helper component to read and interact with the theme context.
const ThemeConsumer = () => {
  const { theme, setTheme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={() => setTheme("light")}>set-light</button>
      <button onClick={() => setTheme("dark")}>set-dark</button>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  );
};

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("defaults to light when no saved theme and system prefers light", () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme").textContent).toBe("light");
  });

  it("defaults to dark when system prefers dark", () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true });

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme").textContent).toBe("dark");
  });

  it("restores saved theme from localStorage", () => {
    localStorage.setItem("theme", "dark");
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme").textContent).toBe("dark");
  });

  it("setTheme updates theme and localStorage", async () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    await user.click(screen.getByText("set-dark"));

    expect(screen.getByTestId("theme").textContent).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("toggleTheme switches between dark and light", async () => {
    localStorage.setItem("theme", "light");
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme").textContent).toBe("light");

    await user.click(screen.getByText("toggle"));
    expect(screen.getByTestId("theme").textContent).toBe("dark");

    await user.click(screen.getByText("toggle"));
    expect(screen.getByTestId("theme").textContent).toBe("light");
  });

  it("adds dark class to documentElement when theme is dark", async () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    await user.click(screen.getByText("set-dark"));
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    await user.click(screen.getByText("set-light"));
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("throws when useTheme is used outside ThemeProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<ThemeConsumer />)).toThrow(
      "useTheme must be used within ThemeProvider",
    );

    spy.mockRestore();
  });

  it("persists theme to localStorage on change", async () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    await user.click(screen.getByText("set-dark"));
    expect(localStorage.getItem("theme")).toBe("dark");

    await user.click(screen.getByText("set-light"));
    expect(localStorage.getItem("theme")).toBe("light");
  });
});
