import { render, screen } from "@testing-library/react";
import RSAStation from "./RSAStation";
import { ERAS } from "@/lib/constants";

const era = ERAS[3]; // RSA

describe("RSAStation", () => {
  it("renders the historical narrative", () => {
    render(<RSAStation era={era} />);
    expect(screen.getByText("Historical Narrative")).toBeInTheDocument();
  });

  it("renders key figures", () => {
    render(<RSAStation era={era} />);
    expect(screen.getByText("Key Figures")).toBeInTheDocument();
  });

  it("renders timeline events", () => {
    render(<RSAStation era={era} />);
    expect(screen.getByText("Timeline")).toBeInTheDocument();
    expect(screen.getByText("RSA invented")).toBeInTheDocument();
  });

  it("renders RSADemo and RSAAttack", () => {
    render(<RSAStation era={era} />);
    expect(screen.getByText("Interactive Demos")).toBeInTheDocument();
    expect(screen.getByText("Attack Demo")).toBeInTheDocument();
  });

  it("mentions Diffie-Hellman", () => {
    render(<RSAStation era={era} />);
    expect(screen.getAllByText(/Diffie/).length).toBeGreaterThanOrEqual(1);
  });
});
