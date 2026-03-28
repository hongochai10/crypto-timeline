import { render, screen } from "@testing-library/react";
import AESAttack from "./AESAttack";
import { ERAS } from "@/lib/constants";

const era = ERAS[2];

describe("AESAttack", () => {
  it("renders with default state", () => {
    render(<AESAttack era={era} />);
    expect(screen.getByText("Attack Demo")).toBeInTheDocument();
    expect(screen.getByText(/No practical attack/)).toBeInTheDocument();
  });

  it("shows unbroken shield", () => {
    render(<AESAttack era={era} />);
    expect(screen.getByText("UNBROKEN")).toBeInTheDocument();
    expect(screen.getByText(/Since standardization in 2001/)).toBeInTheDocument();
  });

  it("shows scale comparisons", () => {
    render(<AESAttack era={era} />);
    expect(screen.getByText("Scale comparison")).toBeInTheDocument();
    expect(screen.getByText("AES-256 keyspace")).toBeInTheDocument();
    expect(screen.getByText("Atoms in universe")).toBeInTheDocument();
  });

  it("shows known attack attempts", () => {
    render(<AESAttack era={era} />);
    expect(screen.getByText("Known attack attempts")).toBeInTheDocument();
    expect(screen.getByText("Brute Force")).toBeInTheDocument();
    expect(screen.getByText("Biclique Cryptanalysis")).toBeInTheDocument();
    expect(screen.getByText("Grover's Algorithm")).toBeInTheDocument();
  });

  it("marks side-channel as implementation risk", () => {
    render(<AESAttack era={era} />);
    expect(screen.getByText("Side-Channel Attack")).toBeInTheDocument();
    expect(screen.getByText("Implementation risk")).toBeInTheDocument();
  });
});
