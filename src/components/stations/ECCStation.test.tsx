import { render, screen } from "@testing-library/react";
import ECCStation from "./ECCStation";
import { ERAS } from "@/lib/constants";

const era = ERAS[4]; // ECC

describe("ECCStation", () => {
  it("renders the historical narrative", () => {
    render(<ECCStation era={era} />);
    expect(screen.getByText("Historical Narrative")).toBeInTheDocument();
  });

  it("renders key figures", () => {
    render(<ECCStation era={era} />);
    expect(screen.getByText("Key Figures")).toBeInTheDocument();
  });

  it("renders timeline events", () => {
    render(<ECCStation era={era} />);
    expect(screen.getByText("Timeline")).toBeInTheDocument();
    // Use a specific timeline event label
    expect(screen.getByText("NSA adopts Suite B")).toBeInTheDocument();
  });

  it("renders ECCDemo and ECCAttack", () => {
    render(<ECCStation era={era} />);
    expect(screen.getByText("Interactive Demos")).toBeInTheDocument();
    expect(screen.getByText("Attack Demo")).toBeInTheDocument();
  });

  it("mentions Bitcoin in timeline", () => {
    render(<ECCStation era={era} />);
    expect(screen.getAllByText(/Bitcoin/).length).toBeGreaterThanOrEqual(1);
  });
});
