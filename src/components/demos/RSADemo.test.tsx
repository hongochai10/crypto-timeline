import { render, screen } from "@testing-library/react";
import RSADemo from "./RSADemo";
import { ERAS } from "@/lib/constants";

const era = ERAS[3];

describe("RSADemo", () => {
  it("renders with default state", () => {
    render(<RSADemo era={era} />);
    expect(screen.getByText("Interactive Demo")).toBeInTheDocument();
    expect(screen.getAllByText(/RSA-2048/).length).toBeGreaterThanOrEqual(1);
  });

  it("shows three-step workflow", () => {
    render(<RSADemo era={era} />);
    expect(screen.getByText(/Step 1/)).toBeInTheDocument();
    expect(screen.getByText(/Step 2/)).toBeInTheDocument();
    expect(screen.getByText(/Step 3/)).toBeInTheDocument();
  });

  it("has generate key pair button", () => {
    render(<RSADemo era={era} />);
    expect(screen.getByTestId("rsa-generate-btn")).toBeInTheDocument();
  });

  it("has message input with default value", () => {
    render(<RSADemo era={era} />);
    expect(screen.getByTestId("rsa-message")).toHaveValue("Hello RSA!");
  });

  it("encrypt button is disabled without key pair", () => {
    render(<RSADemo era={era} />);
    expect(screen.getByTestId("rsa-encrypt-btn")).toBeDisabled();
  });

  it("decrypt button is disabled without ciphertext", () => {
    render(<RSADemo era={era} />);
    expect(screen.getByTestId("rsa-decrypt-btn")).toBeDisabled();
  });
});
