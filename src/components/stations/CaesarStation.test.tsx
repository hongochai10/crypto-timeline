import { render, screen } from "@testing-library/react";
import CaesarStation from "./CaesarStation";
import { ERAS } from "@/lib/constants";

const era = ERAS[0]; // Caesar

describe("CaesarStation", () => {
  it("renders the historical narrative section", () => {
    render(<CaesarStation era={era} />);
    expect(screen.getByText("Historical Narrative")).toBeInTheDocument();
    expect(screen.getAllByText(/Julius Caesar/).length).toBeGreaterThanOrEqual(1);
  });

  it("renders all key figures", () => {
    render(<CaesarStation era={era} />);
    expect(screen.getByText("Key Figures")).toBeInTheDocument();
    // Key figures appear as names in figure cards
    const figures = ["Julius Caesar", "Al-Kindi", "Suetonius"];
    for (const name of figures) {
      expect(screen.getAllByText(name).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("renders timeline events", () => {
    render(<CaesarStation era={era} />);
    expect(screen.getByText("Timeline")).toBeInTheDocument();
    expect(screen.getByText("Gallic Wars begin")).toBeInTheDocument();
    expect(screen.getByText("ROT13 lives on")).toBeInTheDocument();
  });

  it("renders interactive demos section", () => {
    render(<CaesarStation era={era} />);
    expect(screen.getByText("Interactive Demos")).toBeInTheDocument();
    expect(screen.getByText("Attack Demo")).toBeInTheDocument();
  });

  it("displays frequency analysis mention", () => {
    render(<CaesarStation era={era} />);
    expect(screen.getAllByText(/frequency analysis/).length).toBeGreaterThanOrEqual(1);
  });
});
