import { render, screen } from "@testing-library/react";
import { ERAS } from "@/lib/constants";
import enMessages from "../../messages/en.json";

// Mock next/dynamic to render a simple placeholder for lazy components
vi.mock("next/dynamic", () => ({
  __esModule: true,
  default: (loader: () => Promise<{ default: React.ComponentType }>) => {
    // Return a stub component that renders a div with a test id
    const Stub = (props: Record<string, unknown>) => {
      const React = require("react");
      return React.createElement("div", { "data-testid": "dynamic-stub", ...props });
    };
    Stub.displayName = "DynamicStub";
    return Stub;
  },
}));

// Extend framer-motion mock with useTransform and MotionConfig
vi.mock("framer-motion", async () => {
  const React = require("react");
  return {
    motion: new Proxy(
      {},
      {
        get: (_target: unknown, prop: string) => {
          return React.forwardRef((props: Record<string, unknown>, ref: unknown) => {
            const {
              animate: _a,
              initial: _i,
              exit: _e,
              transition: _t,
              whileInView: _w,
              whileHover: _wh,
              whileTap: _wt,
              viewport: _v,
              variants: _va,
              ...rest
            } = props;
            return React.createElement(prop, { ...rest, ref });
          });
        },
      }
    ),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useSpring: (val: unknown) => val,
    useInView: () => true,
    useTransform: () => 1,
    MotionConfig: ({ children }: { children: React.ReactNode }) => children,
  };
});

// Must import after mocks
import Timeline from "./Timeline";

describe("Timeline", () => {
  it("renders the timeline container", () => {
    render(<Timeline />);
    expect(screen.getByTestId("timeline")).toBeInTheDocument();
  });

  it("renders hero section with title", () => {
    render(<Timeline />);
    expect(screen.getByText("Crypto")).toBeInTheDocument();
    expect(screen.getByText("Timeline")).toBeInTheDocument();
  });

  it("renders hero label", () => {
    render(<Timeline />);
    expect(
      screen.getByText("TechBi Labs · Interactive Exhibit")
    ).toBeInTheDocument();
  });

  it("renders hero subtitle", () => {
    render(<Timeline />);
    expect(
      screen.getByText(/A journey through 2,000 years/)
    ).toBeInTheDocument();
  });

  it("renders skip-to-content link for accessibility", () => {
    render(<Timeline />);
    const skipLink = screen.getByText("Skip to timeline");
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute("href", "#timeline-start");
  });

  it("renders era navigation dots for all 6 eras", () => {
    render(<Timeline />);
    // Each era has a navigation link with aria-label "Jump to <name>"
    ERAS.forEach((era) => {
      const eraMessages = enMessages.eras[era.id as keyof typeof enMessages.eras] as { name: string };
      const link = screen.getByLabelText(`Jump to ${eraMessages.name}`);
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", `#${era.id}`);
    });
  });

  it("renders era year badges in navigation", () => {
    render(<Timeline />);
    // Year text appears in both nav and station — use getAllByText
    ERAS.forEach((era) => {
      const eraMessages = enMessages.eras[era.id as keyof typeof enMessages.eras] as { year: string };
      const elements = screen.getAllByText(eraMessages.year);
      expect(elements.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders scroll cue text", () => {
    render(<Timeline />);
    expect(screen.getByText("Scroll to explore")).toBeInTheDocument();
  });

  it("renders footer section", () => {
    render(<Timeline />);
    expect(screen.getByText("End of Timeline")).toBeInTheDocument();
    expect(
      screen.getByText(/The story continues/)
    ).toBeInTheDocument();
  });

  it("renders copyright with current year", () => {
    render(<Timeline />);
    const year = new Date().getFullYear();
    expect(
      screen.getByText(`TechBi Labs · ${year}`)
    ).toBeInTheDocument();
  });

  it("renders timeline-start anchor for skip link target", () => {
    render(<Timeline />);
    expect(document.getElementById("timeline-start")).toBeInTheDocument();
  });

  it("renders a station section for each era", () => {
    render(<Timeline />);
    // Each era id should be rendered as section id (via Station component stub)
    ERAS.forEach((era) => {
      expect(document.getElementById(era.id)).toBeInTheDocument();
    });
  });

  it("renders LanguageSwitcher", () => {
    render(<Timeline />);
    // LanguageSwitcher renders a group with label "Language"
    expect(screen.getByRole("group", { name: "Language" })).toBeInTheDocument();
  });
});
