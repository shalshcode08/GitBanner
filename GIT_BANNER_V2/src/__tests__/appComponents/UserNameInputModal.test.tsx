import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import type { ReactNode } from "react";
import { DashboardProvider } from "../../context/DashboardContext";
import UserNameInputModal from "../../appComponents/UserNameInputModal";
import * as bannerApi from "../../api/banner";

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock("../../api/banner", async (importOriginal) => {
  const actual = await importOriginal<typeof bannerApi>();
  return { ...actual, validateUsername: vi.fn() };
});

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mockValidate = () => vi.mocked(bannerApi.validateUsername);

function renderModal(open = true, setOpen = vi.fn()) {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter>
      <DashboardProvider>{children}</DashboardProvider>
    </MemoryRouter>
  );

  return {
    setOpen,
    ...render(<UserNameInputModal open={open} setOpen={setOpen} />, {
      wrapper: Wrapper,
    }),
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("UserNameInputModal", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it("renders the title when open", () => {
    renderModal();
    expect(screen.getByText("Enter GitHub Username")).toBeInTheDocument();
  });

  it("renders the username input", () => {
    renderModal();
    expect(screen.getByPlaceholderText("GitHub username")).toBeInTheDocument();
  });

  it("submit button is disabled when the input is empty", () => {
    renderModal();
    expect(screen.getByRole("button", { name: /continue/i })).toBeDisabled();
  });

  it("submit button becomes enabled once the user types", async () => {
    const user = userEvent.setup();
    renderModal();

    await user.type(screen.getByPlaceholderText("GitHub username"), "a");

    expect(screen.getByRole("button", { name: /continue/i })).toBeEnabled();
  });

  it("calls validateUsername with the trimmed input on submit", async () => {
    mockValidate().mockResolvedValue(null);
    const user = userEvent.setup();
    renderModal();

    await user.type(
      screen.getByPlaceholderText("GitHub username"),
      "  torvalds  ",
    );
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(mockValidate()).toHaveBeenCalledWith(
        "torvalds",
        expect.any(AbortSignal),
      );
    });
  });

  it("closes the modal on successful validation", async () => {
    mockValidate().mockResolvedValue(null);
    const user = userEvent.setup();
    const { setOpen } = renderModal();

    await user.type(screen.getByPlaceholderText("GitHub username"), "torvalds");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(setOpen).toHaveBeenCalledWith(false);
    });
  });

  it("shows an inline error on validation failure", async () => {
    mockValidate().mockResolvedValue('GitHub user "nobody" not found.');
    const user = userEvent.setup();
    renderModal();

    await user.type(screen.getByPlaceholderText("GitHub username"), "nobody");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(
        screen.getByText('GitHub user "nobody" not found.'),
      ).toBeInTheDocument();
    });
  });

  it("does not close the modal on validation failure", async () => {
    mockValidate().mockResolvedValue("Invalid GitHub username.");
    const user = userEvent.setup();
    const { setOpen } = renderModal();

    await user.type(screen.getByPlaceholderText("GitHub username"), "bad!");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(mockValidate()).toHaveBeenCalled();
    });

    expect(setOpen).not.toHaveBeenCalledWith(false);
  });

  it("clears the error message when the user types again", async () => {
    mockValidate().mockResolvedValue("Invalid GitHub username.");
    const user = userEvent.setup();
    renderModal();

    const input = screen.getByPlaceholderText("GitHub username");
    await user.type(input, "bad!");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid GitHub username.")).toBeInTheDocument();
    });

    await user.type(input, "x");
    expect(
      screen.queryByText("Invalid GitHub username."),
    ).not.toBeInTheDocument();
  });

  it("submits when the user presses Enter", async () => {
    mockValidate().mockResolvedValue(null);
    const user = userEvent.setup();
    renderModal();

    await user.type(
      screen.getByPlaceholderText("GitHub username"),
      "torvalds{Enter}",
    );

    await waitFor(() => {
      expect(mockValidate()).toHaveBeenCalledWith(
        "torvalds",
        expect.any(AbortSignal),
      );
    });
  });

  it("navigates to home and calls setOpen(false) on cancel", async () => {
    const user = userEvent.setup();
    const { setOpen } = renderModal();

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/");
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it("disables inputs while validation is in progress", async () => {
    let resolve!: (v: null) => void;
    mockValidate().mockReturnValue(new Promise((r) => (resolve = r)));

    const user = userEvent.setup();
    renderModal();

    await user.type(screen.getByPlaceholderText("GitHub username"), "torvalds");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByPlaceholderText("GitHub username")).toBeDisabled();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();

    // Resolve the promise inside act() so the resulting state update is flushed cleanly.
    await act(async () => {
      resolve(null);
    });
  });
});
