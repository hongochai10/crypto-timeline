import { render, screen } from "@testing-library/react";
import RSAAttack from "./RSAAttack";
import { ERAS } from "@/lib/constants";

const era = ERAS[3];

describe("RSAAttack", () => {
  it("renders with default state", () => {
    render(<RSAAttack era={era} />);
    expect(screen.getByText("Attack Demo")).toBeInTheDocument();
    expect(screen.getByText(/Integer factoring/)).toBeInTheDocument();
  });

  it("shows RSA hard problem explanation", () => {
    render(<RSAAttack era={era} />);
    expect(screen.getByText("The RSA Hard Problem")).toBeInTheDocument();
  });

  it("renders toy example selection buttons", () => {
    render(<RSAAttack era={era} />);
    // Buttons contain "n = ..." text; there may be duplicates due to the display box
    expect(screen.getAllByText(/n = 3233/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/n = 10403/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/n = 40291/).length).toBeGreaterThanOrEqual(1);
  });

  it("has run trial division button", () => {
    render(<RSAAttack era={era} />);
    expect(screen.getByText(/Run Trial Division Attack/)).toBeInTheDocument();
  });

  it("shows RSA key size security table", () => {
    render(<RSAAttack era={era} />);
    expect(screen.getByText("RSA key size security")).toBeInTheDocument();
  });
});
