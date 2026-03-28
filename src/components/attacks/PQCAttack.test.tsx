import { render, screen } from "@testing-library/react";
import PQCAttack from "./PQCAttack";
import { ERAS } from "@/lib/constants";

const era = ERAS[5];

describe("PQCAttack", () => {
  it("renders with default state", () => {
    render(<PQCAttack era={era} />);
    expect(screen.getByText("Attack Demo")).toBeInTheDocument();
  });

  it("shows classical vs quantum visualization", () => {
    render(<PQCAttack era={era} />);
    expect(screen.getByText("Classical vs Quantum computation")).toBeInTheDocument();
    expect(screen.getByText("Classical")).toBeInTheDocument();
    expect(screen.getByText("Quantum")).toBeInTheDocument();
  });

  it("shows Shor's algorithm steps", () => {
    render(<PQCAttack era={era} />);
    expect(screen.getByText(/Shor's Algorithm/)).toBeInTheDocument();
    expect(screen.getByText("Superposition")).toBeInTheDocument();
    expect(screen.getByText("QFT")).toBeInTheDocument();
    expect(screen.getByText("RSA broken")).toBeInTheDocument();
  });

  it("shows quantum threat analysis", () => {
    render(<PQCAttack era={era} />);
    expect(screen.getByText("Quantum threat analysis")).toBeInTheDocument();
  });

  it("shows NIST PQC standardization timeline", () => {
    render(<PQCAttack era={era} />);
    expect(screen.getByText("NIST PQC Standardization")).toBeInTheDocument();
  });
});
