import { render, screen } from "@testing-library/react";
import EraTransition from "./EraTransition";
import { ERAS } from "@/lib/constants";

const fromEra = ERAS[0]; // Caesar
const toEra = ERAS[1]; // DES

describe("EraTransition", () => {
  it("renders without crashing", () => {
    const { container } = render(<EraTransition fromEra={fromEra} toEra={toEra} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("is hidden from assistive technology", () => {
    const { container } = render(<EraTransition fromEra={fromEra} toEra={toEra} />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("displays era names and years", () => {
    render(<EraTransition fromEra={fromEra} toEra={toEra} />);
    expect(screen.getByText(/Caesar Cipher/)).toBeInTheDocument();
    expect(screen.getByText(/DES · 1977/)).toBeInTheDocument();
  });

  it("displays year gap label", () => {
    render(<EraTransition fromEra={fromEra} toEra={toEra} />);
    expect(screen.getByText("50 BC → 1977")).toBeInTheDocument();
  });

  it("applies era colors in styles", () => {
    const { container } = render(<EraTransition fromEra={fromEra} toEra={toEra} />);
    const spans = container.querySelectorAll("span");
    const fromSpan = Array.from(spans).find((s) => s.textContent?.includes("Caesar"));
    expect(fromSpan?.style.color).toBeTruthy();
  });
});
