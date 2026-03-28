import { render, screen } from "@testing-library/react";
import ECCDemo from "./ECCDemo";
import { ERAS } from "@/lib/constants";

const era = ERAS[4];

describe("ECCDemo", () => {
  it("renders with default state", () => {
    render(<ECCDemo era={era} />);
    expect(screen.getByText("Interactive Demo")).toBeInTheDocument();
    expect(screen.getByText(/ECDSA P-256/)).toBeInTheDocument();
  });

  it("shows ECC vs RSA comparison", () => {
    render(<ECCDemo era={era} />);
    expect(screen.getByText(/ECC vs RSA key size comparison/)).toBeInTheDocument();
  });

  it("has generate key pair button", () => {
    render(<ECCDemo era={era} />);
    expect(screen.getByTestId("ecc-generate-btn")).toBeInTheDocument();
    expect(screen.getByLabelText("Generate ECDSA P-256 key pair")).toBeInTheDocument();
  });

  it("has message input with default value", () => {
    render(<ECCDemo era={era} />);
    expect(screen.getByTestId("ecc-message")).toHaveValue("Sign this message!");
  });

  it("sign button is disabled without key pair", () => {
    render(<ECCDemo era={era} />);
    expect(screen.getByTestId("ecc-sign-btn")).toBeDisabled();
  });

  it("shows step-by-step workflow", () => {
    render(<ECCDemo era={era} />);
    expect(screen.getByText(/Step 1/)).toBeInTheDocument();
    expect(screen.getByText(/Step 2/)).toBeInTheDocument();
  });
});
