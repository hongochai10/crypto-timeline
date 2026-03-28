import { render, screen, fireEvent } from "@testing-library/react";
import PQCDemo from "./PQCDemo";
import { ERAS } from "@/lib/constants";

const era = ERAS[5];

describe("PQCDemo", () => {
  it("renders with default state", () => {
    render(<PQCDemo era={era} />);
    expect(screen.getByText("Interactive Demo")).toBeInTheDocument();
    expect(screen.getByText(/LWE lattice-based encryption/)).toBeInTheDocument();
  });

  it("shows lattice visualization", () => {
    render(<PQCDemo era={era} />);
    expect(screen.getByLabelText(/Lattice point visualization/)).toBeInTheDocument();
  });

  it("shows LWE parameters", () => {
    render(<PQCDemo era={era} />);
    expect(screen.getByText("Dimension n")).toBeInTheDocument();
    expect(screen.getByText("Modulus q")).toBeInTheDocument();
    expect(screen.getByText("97")).toBeInTheDocument();
  });

  it("has generate button", () => {
    render(<PQCDemo era={era} />);
    expect(screen.getByTestId("pqc-generate-btn")).toBeInTheDocument();
  });

  it("generates keys and shows encrypt section", () => {
    render(<PQCDemo era={era} />);
    fireEvent.click(screen.getByTestId("pqc-generate-btn"));
    // After generating, bit selection and encrypt button appear
    expect(screen.getByTestId("pqc-bit-0-btn")).toBeInTheDocument();
    expect(screen.getByTestId("pqc-bit-1-btn")).toBeInTheDocument();
    expect(screen.getByTestId("pqc-encrypt-btn")).toBeInTheDocument();
  });

  it("encrypts and shows decrypt button", () => {
    render(<PQCDemo era={era} />);
    fireEvent.click(screen.getByTestId("pqc-generate-btn"));
    fireEvent.click(screen.getByTestId("pqc-encrypt-btn"));
    expect(screen.getByTestId("pqc-decrypt-btn")).toBeInTheDocument();
  });

  it("decrypts and shows result", () => {
    render(<PQCDemo era={era} />);
    fireEvent.click(screen.getByTestId("pqc-generate-btn"));
    fireEvent.click(screen.getByTestId("pqc-encrypt-btn"));
    fireEvent.click(screen.getByTestId("pqc-decrypt-btn"));
    expect(screen.getByTestId("pqc-decrypt-result")).toBeInTheDocument();
  });

  it("bit 1 is selected by default", () => {
    render(<PQCDemo era={era} />);
    fireEvent.click(screen.getByTestId("pqc-generate-btn"));
    expect(screen.getByTestId("pqc-bit-1-btn")).toHaveAttribute("aria-pressed", "true");
  });
});
