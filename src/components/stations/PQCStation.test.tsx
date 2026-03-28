import { render, screen } from "@testing-library/react";
import PQCStation from "./PQCStation";
import { ERAS } from "@/lib/constants";

const era = ERAS[5]; // PQC

describe("PQCStation", () => {
  it("renders the 'You Are Here' banner", () => {
    render(<PQCStation era={era} />);
    expect(screen.getByText(/You Are Here/)).toBeInTheDocument();
    expect(screen.getByText(/Quantum Threat Is Real/)).toBeInTheDocument();
  });

  it("renders quantum threat assessment table", () => {
    render(<PQCStation era={era} />);
    expect(screen.getByText(/Quantum Threat Assessment/)).toBeInTheDocument();
  });

  it("renders key figures", () => {
    render(<PQCStation era={era} />);
    expect(screen.getByText("Key Figures")).toBeInTheDocument();
    expect(screen.getByText("Peter Shor")).toBeInTheDocument();
    expect(screen.getByText("Oded Regev")).toBeInTheDocument();
  });

  it("renders timeline events", () => {
    render(<PQCStation era={era} />);
    expect(screen.getByText("Timeline")).toBeInTheDocument();
    expect(screen.getByText("Finalists selected")).toBeInTheDocument();
  });

  it("renders PQCDemo and PQCAttack", () => {
    render(<PQCStation era={era} />);
    expect(screen.getByText("Interactive Demos")).toBeInTheDocument();
    expect(screen.getByText("Attack Demo")).toBeInTheDocument();
  });

  it("mentions harvest-now decrypt-later threat", () => {
    render(<PQCStation era={era} />);
    expect(screen.getByText(/harvest-now, decrypt-later/)).toBeInTheDocument();
  });
});
