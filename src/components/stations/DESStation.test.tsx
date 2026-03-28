import { render, screen } from "@testing-library/react";
import DESStation from "./DESStation";
import { ERAS } from "@/lib/constants";

const era = ERAS[1]; // DES

describe("DESStation", () => {
  it("renders the historical narrative", () => {
    render(<DESStation era={era} />);
    expect(screen.getByText("Historical Narrative")).toBeInTheDocument();
  });

  it("renders key figures", () => {
    render(<DESStation era={era} />);
    expect(screen.getByText("Key Figures")).toBeInTheDocument();
  });

  it("renders timeline events", () => {
    render(<DESStation era={era} />);
    expect(screen.getByText("Timeline")).toBeInTheDocument();
    expect(screen.getByText("NBS issues a call")).toBeInTheDocument();
    expect(screen.getByText("Deep Crack breaks it")).toBeInTheDocument();
  });

  it("renders DESDemo and DESAttack", () => {
    render(<DESStation era={era} />);
    expect(screen.getByText("Interactive Demos")).toBeInTheDocument();
    expect(screen.getByText("Attack Demo")).toBeInTheDocument();
  });

  it("mentions NSA in the narrative", () => {
    render(<DESStation era={era} />);
    expect(screen.getAllByText(/NSA/).length).toBeGreaterThanOrEqual(1);
  });
});
