import { render, screen, act } from "@testing-library/react";
import OfflineIndicator from "./OfflineIndicator";

describe("OfflineIndicator", () => {
  let originalOnLine: PropertyDescriptor | undefined;

  beforeEach(() => {
    originalOnLine = Object.getOwnPropertyDescriptor(navigator, "onLine");
  });

  afterEach(() => {
    if (originalOnLine) {
      Object.defineProperty(navigator, "onLine", originalOnLine);
    } else {
      // Reset to default (online)
      Object.defineProperty(navigator, "onLine", {
        configurable: true,
        get: () => true,
      });
    }
  });

  it("renders nothing when online", () => {
    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      get: () => true,
    });

    const { container } = render(<OfflineIndicator />);
    expect(container.innerHTML).toBe("");
  });

  it("renders offline banner when initially offline", () => {
    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      get: () => false,
    });

    render(<OfflineIndicator />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(
      screen.getByText("You are offline — the app is running from cache")
    ).toBeInTheDocument();
  });

  it("has aria-live assertive for accessibility", () => {
    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      get: () => false,
    });

    render(<OfflineIndicator />);
    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-live",
      "assertive"
    );
  });

  it("shows banner when going offline", () => {
    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      get: () => true,
    });

    render(<OfflineIndicator />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    // Simulate going offline
    act(() => {
      Object.defineProperty(navigator, "onLine", {
        configurable: true,
        get: () => false,
      });
      window.dispatchEvent(new Event("offline"));
    });

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("hides banner when coming back online", () => {
    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      get: () => false,
    });

    render(<OfflineIndicator />);
    expect(screen.getByRole("status")).toBeInTheDocument();

    // Simulate coming online
    act(() => {
      Object.defineProperty(navigator, "onLine", {
        configurable: true,
        get: () => true,
      });
      window.dispatchEvent(new Event("online"));
    });

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("cleans up event listeners on unmount", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = render(<OfflineIndicator />);

    expect(addSpy).toHaveBeenCalledWith("offline", expect.any(Function));
    expect(addSpy).toHaveBeenCalledWith("online", expect.any(Function));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith("offline", expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith("online", expect.any(Function));

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it("renders wifi-off icon when offline", () => {
    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      get: () => false,
    });

    render(<OfflineIndicator />);
    const svg = screen.getByRole("status").querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });
});
