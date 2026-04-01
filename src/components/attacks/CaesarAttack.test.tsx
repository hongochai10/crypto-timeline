import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CaesarAttack from "./CaesarAttack";
import { ERAS } from "@/lib/constants";

const era = ERAS[0];

describe("CaesarAttack", () => {
  it("renders with default state", () => {
    render(<CaesarAttack era={era} />);
    expect(screen.getByText("Attack Demo")).toBeInTheDocument();
    expect(screen.getByText(/Frequency analysis/)).toBeInTheDocument();
  });

  it("has a textarea with default ciphertext", () => {
    render(<CaesarAttack era={era} />);
    expect(screen.getByDisplayValue(/KHOOR ZRUOG/)).toBeInTheDocument();
  });

  it("renders frequency chart", () => {
    render(<CaesarAttack era={era} />);
    expect(screen.getByText("Letter Frequency Analysis")).toBeInTheDocument();
  });

  it("has a crack button", () => {
    render(<CaesarAttack era={era} />);
    const crackBtn = screen.getByText(/Run Frequency Attack/);
    expect(crackBtn).not.toBeDisabled();
  });

  it("disables crack button for empty ciphertext", () => {
    render(<CaesarAttack era={era} />);
    const textarea = screen.getByDisplayValue(/KHOOR ZRUOG/);
    fireEvent.change(textarea, { target: { value: "" } });
    expect(screen.getByText(/Run Frequency Attack/)).toBeDisabled();
  });

  it("shows cracking state and then result", async () => {
    render(<CaesarAttack era={era} />);
    fireEvent.click(screen.getByText(/Run Frequency Attack/));
    expect(screen.getByText(/Cracking/)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Cracked")).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
