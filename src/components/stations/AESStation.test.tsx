import { render, screen } from "@testing-library/react";
import AESStation from "./AESStation";
import { ERAS } from "@/lib/constants";

const era = ERAS[2]; // AES

describe("AESStation", () => {
  it("renders the historical narrative", () => {
    render(<AESStation era={era} />);
    expect(screen.getByText("Historical Narrative")).toBeInTheDocument();
  });

  it("renders key figures", () => {
    render(<AESStation era={era} />);
    expect(screen.getByText("Key Figures")).toBeInTheDocument();
  });

  it("renders timeline events", () => {
    render(<AESStation era={era} />);
    expect(screen.getByText("Timeline")).toBeInTheDocument();
    expect(screen.getByText("Rijndael wins")).toBeInTheDocument();
  });

  it("renders AESDemo and AESAttack", () => {
    render(<AESStation era={era} />);
    expect(screen.getByText("Interactive Demos")).toBeInTheDocument();
    expect(screen.getByText("Attack Demo")).toBeInTheDocument();
  });

  it("mentions the NIST competition", () => {
    render(<AESStation era={era} />);
    expect(screen.getByText("NIST competition announced")).toBeInTheDocument();
  });
});
