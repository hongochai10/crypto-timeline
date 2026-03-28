import { render, screen, fireEvent } from "@testing-library/react";
import CaesarDemo from "./CaesarDemo";
import { ERAS } from "@/lib/constants";

const era = ERAS[0];

describe("CaesarDemo", () => {
  it("renders with default state", () => {
    render(<CaesarDemo era={era} />);
    expect(screen.getByText("Interactive Demo")).toBeInTheDocument();
    expect(screen.getByTestId("caesar-input")).toHaveValue("HELLO WORLD");
    expect(screen.getByTestId("caesar-output")).toBeInTheDocument();
  });

  it("shows encrypt/decrypt mode buttons", () => {
    render(<CaesarDemo era={era} />);
    const encryptBtn = screen.getByTestId("caesar-encrypt-btn");
    const decryptBtn = screen.getByTestId("caesar-decrypt-btn");
    expect(encryptBtn).toHaveAttribute("aria-pressed", "true");
    expect(decryptBtn).toHaveAttribute("aria-pressed", "false");
  });

  it("switches between encrypt and decrypt modes", () => {
    render(<CaesarDemo era={era} />);
    const decryptBtn = screen.getByTestId("caesar-decrypt-btn");
    fireEvent.click(decryptBtn);
    expect(decryptBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("encrypts default text with shift 3", () => {
    render(<CaesarDemo era={era} />);
    expect(screen.getByTestId("caesar-output").textContent).toBe("KHOOR ZRUOG");
  });

  it("updates output when input changes", () => {
    render(<CaesarDemo era={era} />);
    const input = screen.getByTestId("caesar-input");
    fireEvent.change(input, { target: { value: "ABC" } });
    expect(screen.getByTestId("caesar-output").textContent).toBe("DEF");
  });

  it("updates output when shift changes", () => {
    render(<CaesarDemo era={era} />);
    const slider = screen.getByTestId("caesar-shift");
    fireEvent.change(slider, { target: { value: "1" } });
    expect(screen.getByTestId("caesar-output").textContent).toBe("IFMMP XPSME");
  });

  it("renders character mapping display", () => {
    render(<CaesarDemo era={era} />);
    // With shift 3: A→D
    expect(screen.getByText(/A → D/)).toBeInTheDocument();
  });

  it("has proper ARIA labels on mode buttons", () => {
    render(<CaesarDemo era={era} />);
    expect(screen.getByLabelText("Encrypt mode")).toBeInTheDocument();
    expect(screen.getByLabelText("Decrypt mode")).toBeInTheDocument();
  });

  it("output area has aria-live polite for screen readers", () => {
    render(<CaesarDemo era={era} />);
    expect(screen.getByTestId("caesar-output")).toHaveAttribute("aria-live", "polite");
  });
});
