import { render, screen, fireEvent } from "@testing-library/react";
import AESDemo from "./AESDemo";
import { ERAS } from "@/lib/constants";

const era = ERAS[2];

describe("AESDemo", () => {
  it("renders with default state", () => {
    render(<AESDemo era={era} />);
    expect(screen.getByText("Interactive Demo")).toBeInTheDocument();
    expect(screen.getByText(/AES-256-GCM/)).toBeInTheDocument();
  });

  it("shows encrypt/decrypt mode buttons", () => {
    render(<AESDemo era={era} />);
    expect(screen.getByTestId("aes-encrypt-btn")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("aes-decrypt-btn")).toHaveAttribute("aria-pressed", "false");
  });

  it("has passphrase input", () => {
    render(<AESDemo era={era} />);
    expect(screen.getByTestId("aes-passphrase")).toHaveValue("my-secret-key");
  });

  it("has plaintext input in encrypt mode", () => {
    render(<AESDemo era={era} />);
    expect(screen.getByTestId("aes-plaintext")).toHaveValue("Hello, AES-256!");
  });

  it("switches to decrypt mode", () => {
    render(<AESDemo era={era} />);
    fireEvent.click(screen.getByTestId("aes-decrypt-btn"));
    expect(screen.getByTestId("aes-decrypt-btn")).toHaveAttribute("aria-pressed", "true");
  });

  it("encrypt run button is disabled with empty input", () => {
    render(<AESDemo era={era} />);
    fireEvent.change(screen.getByTestId("aes-plaintext"), { target: { value: "" } });
    expect(screen.getByTestId("aes-encrypt-run-btn")).toBeDisabled();
  });

  it("has proper ARIA labels", () => {
    render(<AESDemo era={era} />);
    expect(screen.getByLabelText("Encrypt with AES-256")).toBeInTheDocument();
  });
});
