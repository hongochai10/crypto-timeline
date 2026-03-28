import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InteractiveInput from "./InteractiveInput";

describe("InteractiveInput", () => {
  it("renders an input element", () => {
    render(<InteractiveInput />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders a label when provided", () => {
    render(<InteractiveInput label="Plaintext" />);
    expect(screen.getByText("Plaintext")).toBeInTheDocument();
    expect(screen.getByLabelText("Plaintext")).toBeInTheDocument();
  });

  it("does not render a label when omitted", () => {
    const { container } = render(<InteractiveInput />);
    expect(container.querySelector("label")).not.toBeInTheDocument();
  });

  it("renders help text and links it via aria-describedby", () => {
    render(<InteractiveInput helpText="Enter your message" />);
    const helpText = screen.getByText("Enter your message");
    expect(helpText).toBeInTheDocument();
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-describedby", helpText.id);
  });

  it("does not render help text when omitted", () => {
    const { container } = render(<InteractiveInput />);
    expect(container.querySelectorAll("p")).toHaveLength(0);
  });

  it("applies accent color as CSS custom property", () => {
    render(<InteractiveInput accentColor="#c9a227" />);
    const input = screen.getByRole("textbox");
    expect(input.style.getPropertyValue("--accent")).toBe("#c9a227");
  });

  it("passes through standard input props", () => {
    render(
      <InteractiveInput
        placeholder="Type here..."
        maxLength={10}
        data-testid="my-input"
      />
    );
    const input = screen.getByTestId("my-input");
    expect(input).toHaveAttribute("placeholder", "Type here...");
    expect(input).toHaveAttribute("maxLength", "10");
  });

  it("uses external id when provided", () => {
    render(<InteractiveInput id="custom-id" label="Custom" />);
    const input = screen.getByRole("textbox");
    expect(input.id).toBe("custom-id");
  });

  it("handles user typing", async () => {
    const handleChange = vi.fn();
    render(<InteractiveInput onChange={handleChange} />);
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "hello");
    expect(handleChange).toHaveBeenCalled();
  });
});
