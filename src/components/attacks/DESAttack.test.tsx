import { render, screen, fireEvent } from "@testing-library/react";
import DESAttack from "./DESAttack";
import { ERAS } from "@/lib/constants";

const era = ERAS[1];

describe("DESAttack", () => {
  it("renders with default state", () => {
    render(<DESAttack era={era} />);
    expect(screen.getByText("Attack Demo")).toBeInTheDocument();
  });

  it("shows keyspace statistics", () => {
    render(<DESAttack era={era} />);
    expect(screen.getByText("56-bit")).toBeInTheDocument();
    expect(screen.getByText("~6 days")).toBeInTheDocument();
  });

  it("has a simulate brute force button", () => {
    render(<DESAttack era={era} />);
    expect(screen.getByText(/Simulate Brute Force/)).toBeInTheDocument();
  });

  it("starts simulation on button click", () => {
    render(<DESAttack era={era} />);
    fireEvent.click(screen.getByText(/Simulate Brute Force/));
    expect(screen.getByText(/Brute-forcing/)).toBeInTheDocument();
  });

  it("renders historical timeline", () => {
    render(<DESAttack era={era} />);
    expect(screen.getByText("Breaking DES — Historical Timeline")).toBeInTheDocument();
    expect(screen.getByText(/DES standardized/)).toBeInTheDocument();
  });

  it("shows keyspace scanned progress", () => {
    render(<DESAttack era={era} />);
    expect(screen.getByText("Keyspace scanned")).toBeInTheDocument();
  });
});
