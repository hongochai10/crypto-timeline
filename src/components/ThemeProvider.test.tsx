import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Unmock ThemeProvider for this test file
vi.unmock("@/components/ThemeProvider");

import { ThemeProvider, useTheme } from "./ThemeProvider";

const STORAGE_KEY = "crypto-timeline-theme";

function ThemeConsumer() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

// Create a proper localStorage mock since Node.js built-in localStorage
// doesn't implement the Web Storage API
const storageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (i: number) => Object.keys(store)[i] ?? null,
  };
})();

beforeAll(() => {
  Object.defineProperty(globalThis, "localStorage", {
    value: storageMock,
    writable: true,
    configurable: true,
  });

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

beforeEach(() => {
  storageMock.clear();
  document.documentElement.removeAttribute("data-theme");
});

describe("ThemeProvider", () => {
  it("defaults to system preference when no stored theme", () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
  });

  it("reads stored theme from localStorage on mount", () => {
    storageMock.setItem(STORAGE_KEY, "light");

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("light");
  });

  it("persists theme to localStorage on toggle", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");

    await user.click(screen.getByText("Toggle"));

    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    expect(storageMock.getItem(STORAGE_KEY)).toBe("light");
  });

  it("sets data-theme attribute on document element", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

    await user.click(screen.getByText("Toggle"));

    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("ignores invalid stored values and falls back to system preference", () => {
    storageMock.setItem(STORAGE_KEY, "invalid-value");

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
  });

  it("syncs theme across tabs via storage event", () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");

    // Simulate storage event from another tab
    act(() => {
      window.dispatchEvent(new StorageEvent("storage", {
        key: STORAGE_KEY,
        newValue: "light",
        oldValue: "dark",
      }));
    });

    expect(screen.getByTestId("theme")).toHaveTextContent("light");
  });

  it("ignores storage events with invalid values", () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");

    act(() => {
      window.dispatchEvent(new StorageEvent("storage", {
        key: STORAGE_KEY,
        newValue: "invalid",
      }));
    });

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
  });

  it("ignores storage events for other keys", () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");

    act(() => {
      window.dispatchEvent(new StorageEvent("storage", {
        key: "other-key",
        newValue: "light",
      }));
    });

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
  });

  it("throws when useTheme is used outside ThemeProvider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<ThemeConsumer />)).toThrow(
      "useTheme must be used within ThemeProvider"
    );

    consoleSpy.mockRestore();
  });
});
