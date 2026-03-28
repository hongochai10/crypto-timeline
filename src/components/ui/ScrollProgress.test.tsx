import { render } from "@testing-library/react";
import ScrollProgress from "./ScrollProgress";

describe("ScrollProgress", () => {
  it("renders a progress bar element", () => {
    const { container } = render(<ScrollProgress />);
    const bar = container.firstChild as HTMLElement;
    expect(bar).toBeInTheDocument();
    expect(bar.className).toContain("fixed");
  });

  it("has correct positioning classes", () => {
    const { container } = render(<ScrollProgress />);
    const bar = container.firstChild as HTMLElement;
    expect(bar.className).toContain("left-0");
    expect(bar.className).toContain("top-0");
    expect(bar.className).toContain("z-50");
  });

  it("applies gradient background style", () => {
    const { container } = render(<ScrollProgress />);
    const bar = container.firstChild as HTMLElement;
    expect(bar.style.background).toContain("linear-gradient");
  });
});
