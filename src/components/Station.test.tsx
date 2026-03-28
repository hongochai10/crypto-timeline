import { render, screen } from "@testing-library/react";
import Station from "./Station";
import { ERAS } from "@/lib/constants";

const era = ERAS[0]; // Caesar

describe("Station", () => {
  it("renders a section with correct aria-label", () => {
    render(
      <Station era={era} index={0}>
        <p>Child content</p>
      </Station>
    );
    expect(screen.getByRole("region", { name: /Caesar Cipher — 50 BC/ })).toBeInTheDocument();
  });

  it("renders era name and subtitle", () => {
    render(
      <Station era={era} index={0}>
        <p>Child</p>
      </Station>
    );
    expect(screen.getByText("Caesar Cipher")).toBeInTheDocument();
    expect(screen.getByText("The Birth of Secret Writing")).toBeInTheDocument();
  });

  it("renders era year badge", () => {
    render(
      <Station era={era} index={0}>
        <p>Child</p>
      </Station>
    );
    expect(screen.getByText("50 BC")).toBeInTheDocument();
  });

  it("renders era status badge", () => {
    render(
      <Station era={era} index={0}>
        <p>Child</p>
      </Station>
    );
    expect(screen.getByText("Broken")).toBeInTheDocument();
  });

  it("renders station number", () => {
    render(
      <Station era={era} index={0}>
        <p>Child</p>
      </Station>
    );
    expect(screen.getByText("01")).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <Station era={era} index={0}>
        <p>Test child content</p>
      </Station>
    );
    expect(screen.getByText("Test child content")).toBeInTheDocument();
  });

  it("renders era description", () => {
    render(
      <Station era={era} index={0}>
        <p>Child</p>
      </Station>
    );
    expect(screen.getByText(/Julius Caesar communicated/)).toBeInTheDocument();
  });

  it("renders key fact", () => {
    render(
      <Station era={era} index={0}>
        <p>Child</p>
      </Station>
    );
    expect(screen.getByText(/only 25 possible keys/)).toBeInTheDocument();
  });

  it("has correct section id", () => {
    render(
      <Station era={era} index={0}>
        <p>Child</p>
      </Station>
    );
    expect(document.getElementById("caesar")).toBeInTheDocument();
  });
});
