import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppearanceTab, Props } from "../appearance-tab";
import { Tabs } from "@/components/ui/tabs";

const renderWithTabs = (props: Props) => {
  return render(
    <Tabs defaultValue="appearance">
      <AppearanceTab {...props} />
    </Tabs>
  );
};

describe("AppearanceTab", () => {
  const defaultProps = {
    theme: "system" as const,
    onThemeChange: vi.fn(),
  };

  it("should render theme label", () => {
    renderWithTabs(defaultProps);
    expect(screen.getByText("Theme")).toBeInTheDocument();
  });

  it("should render all theme buttons", () => {
    renderWithTabs(defaultProps);
    expect(screen.getByRole("button", { name: /Light/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Dark/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /System/i })).toBeInTheDocument();
  });

  it("should highlight selected theme", () => {
    renderWithTabs({ ...defaultProps, theme: "light" });
    const lightButton = screen.getByRole("button", { name: /Light/i });
    const darkButton = screen.getByRole("button", { name: /Dark/i });
    expect(lightButton.className).toContain("bg-primary");
    expect(darkButton.className).not.toContain("bg-primary");
  });

  it("should call onThemeChange when light theme is clicked", async () => {
    const user = userEvent.setup();
    const onThemeChange = vi.fn();
    renderWithTabs({ ...defaultProps, onThemeChange });
    const lightButton = screen.getByRole("button", { name: /Light/i });
    await user.click(lightButton);
    expect(onThemeChange).toHaveBeenCalledWith("light");
  });

  it("should call onThemeChange when dark theme is clicked", async () => {
    const user = userEvent.setup();
    const onThemeChange = vi.fn();
    renderWithTabs({ ...defaultProps, onThemeChange });
    const darkButton = screen.getByRole("button", { name: /Dark/i });
    await user.click(darkButton);
    expect(onThemeChange).toHaveBeenCalledWith("dark");
  });

  it("should call onThemeChange when system theme is clicked", async () => {
    const user = userEvent.setup();
    const onThemeChange = vi.fn();
    renderWithTabs({ ...defaultProps, onThemeChange });
    const systemButton = screen.getByRole("button", { name: /System/i });
    await user.click(systemButton);
    expect(onThemeChange).toHaveBeenCalledWith("system");
  });

  it("should highlight dark theme when selected", () => {
    renderWithTabs({ ...defaultProps, theme: "dark" });
    const darkButton = screen.getByRole("button", { name: /Dark/i });
    expect(darkButton.className).toContain("bg-primary");
  });

  it("should highlight system theme when selected", () => {
    renderWithTabs({ ...defaultProps, theme: "system" });
    const systemButton = screen.getByRole("button", { name: /System/i });
    expect(systemButton.className).toContain("bg-primary");
  });
});
