import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LanguageSwitcher from "./LanguageSwitcher";

// Access the mocked router from setup.ts
const mockReplace = vi.fn();
vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ReactLib = require("react");
    return ReactLib.createElement("a", props, children);
  },
  useRouter: () => ({ replace: mockReplace, push: vi.fn() }),
  usePathname: () => "/",
  redirect: () => {},
}));

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    mockReplace.mockClear();
  });

  it("renders a button for each locale", () => {
    render(<LanguageSwitcher />);
    expect(screen.getByRole("button", { name: /en/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /vi/i })).toBeInTheDocument();
  });

  it("has role group with accessible label", () => {
    render(<LanguageSwitcher />);
    expect(screen.getByRole("group", { name: "Language" })).toBeInTheDocument();
  });

  it("marks current locale button as pressed", () => {
    render(<LanguageSwitcher />);
    // Default mocked locale is "en"
    expect(screen.getByRole("button", { name: /en/i })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: /vi/i })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("calls router.replace when switching locale", async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher />);

    await user.click(screen.getByRole("button", { name: /vi/i }));
    expect(mockReplace).toHaveBeenCalledWith("/", { locale: "vi" });
  });

  it("calls router.replace with en when clicking EN button", async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher />);

    await user.click(screen.getByRole("button", { name: /en/i }));
    expect(mockReplace).toHaveBeenCalledWith("/", { locale: "en" });
  });

  it("renders two locale buttons matching routing config", () => {
    render(<LanguageSwitcher />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
  });
});
