import { render, screen } from "@testing-library/react";
import ECCAttack from "./ECCAttack";
import { ERAS } from "@/lib/constants";

const era = ERAS[4];

describe("ECCAttack", () => {
  it("renders with default state", () => {
    render(<ECCAttack era={era} />);
    expect(screen.getByText("Attack Demo")).toBeInTheDocument();
    expect(screen.getAllByText(/ECDLP/).length).toBeGreaterThanOrEqual(1);
  });

  it("shows toy curve info", () => {
    render(<ECCAttack era={era} />);
    expect(screen.getByText(/y² = x³/)).toBeInTheDocument();
  });

  it("shows ECDLP explanation steps", () => {
    render(<ECCAttack era={era} />);
    expect(screen.getByText("Pick private key k")).toBeInTheDocument();
    expect(screen.getByText("ECDLP hardness")).toBeInTheDocument();
  });

  it("shows ECC vs RSA table", () => {
    render(<ECCAttack era={era} />);
    expect(screen.getByText("ECC vs RSA — equivalent security")).toBeInTheDocument();
  });

  it("renders SVG with curve points", () => {
    const { container } = render(<ECCAttack era={era} />);
    const circles = container.querySelectorAll("circle");
    expect(circles.length).toBeGreaterThan(0);
  });
});
