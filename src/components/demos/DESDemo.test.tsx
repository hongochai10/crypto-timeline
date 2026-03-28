import { render, screen, fireEvent } from "@testing-library/react";
import DESDemo from "./DESDemo";
import { ERAS } from "@/lib/constants";

const era = ERAS[1];

describe("DESDemo", () => {
  it("renders with default state", () => {
    render(<DESDemo era={era} />);
    expect(screen.getByText("Interactive Demo")).toBeInTheDocument();
    expect(screen.getByTestId("des-input")).toHaveValue("HELLO DES");
    expect(screen.getByTestId("des-key")).toHaveValue("SECRET01");
  });

  it("shows encrypt/decrypt mode buttons", () => {
    render(<DESDemo era={era} />);
    expect(screen.getByTestId("des-encrypt-btn")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("des-decrypt-btn")).toHaveAttribute("aria-pressed", "false");
  });

  it("switches to decrypt mode", () => {
    render(<DESDemo era={era} />);
    fireEvent.click(screen.getByTestId("des-decrypt-btn"));
    expect(screen.getByTestId("des-decrypt-btn")).toHaveAttribute("aria-pressed", "true");
  });

  it("encrypts when run button is clicked", () => {
    render(<DESDemo era={era} />);
    const runBtn = screen.getByTestId("des-run-btn");
    fireEvent.click(runBtn);
    expect(screen.getByTestId("des-output")).toBeInTheDocument();
  });

  it("shows key length helper text", () => {
    render(<DESDemo era={era} />);
    expect(screen.getByText("Key length: 8/8 characters")).toBeInTheDocument();
  });

  it("disables run button when inputs are empty", () => {
    render(<DESDemo era={era} />);
    const input = screen.getByTestId("des-input");
    fireEvent.change(input, { target: { value: "" } });
    expect(screen.getByTestId("des-run-btn")).toBeDisabled();
  });

  it("has proper ARIA labels", () => {
    render(<DESDemo era={era} />);
    expect(screen.getByLabelText("Encrypt with DES")).toBeInTheDocument();
  });
});
