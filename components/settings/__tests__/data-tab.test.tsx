import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTab, Props } from "../data-tab";
import { Tabs } from "@/components/ui/tabs";

const renderWithTabs = (props: Props) => {
  return render(
    <Tabs defaultValue="data">
      <DataTab {...props} />
    </Tabs>
  );
};

describe("DataTab", () => {
  const defaultProps = {
    onExport: vi.fn(),
    onImport: vi.fn(),
    onClearAll: vi.fn(),
  };

  it("should render export section", () => {
    renderWithTabs(defaultProps);
    expect(screen.getByText("Export Data")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Download Backup JSON/i })).toBeInTheDocument();
    expect(screen.getByText(/Export all characters and favorites/i)).toBeInTheDocument();
  });

  it("should call onExport when export button is clicked", async () => {
    const user = userEvent.setup();
    const onExport = vi.fn();
    renderWithTabs({ ...defaultProps, onExport });
    const exportButton = screen.getByRole("button", { name: /Download Backup JSON/i });
    await user.click(exportButton);
    expect(onExport).toHaveBeenCalledOnce();
  });

  it("should render import section", () => {
    renderWithTabs(defaultProps);
    expect(screen.getByText("Import Data")).toBeInTheDocument();
    expect(screen.getByLabelText("Import Data")).toBeInTheDocument();
    expect(
      screen.getByText(/Import characters and favorites from a backup file/i)
    ).toBeInTheDocument();
  });

  it("should call onImport when file is selected", async () => {
    const user = userEvent.setup();
    const onImport = vi.fn();
    renderWithTabs({ ...defaultProps, onImport });
    const file = new File(["{}"], "backup.json", { type: "application/json" });
    const input = screen.getByLabelText("Import Data") as HTMLInputElement;
    await user.upload(input, file);
    expect(onImport).toHaveBeenCalledOnce();
  });

  it("should only accept JSON files", () => {
    renderWithTabs(defaultProps);
    const input = screen.getByLabelText("Import Data") as HTMLInputElement;
    expect(input.accept).toBe(".json");
  });

  it("should render clear all section", () => {
    renderWithTabs(defaultProps);
    expect(screen.getByRole("button", { name: /Clear All Data/i })).toBeInTheDocument();
    expect(
      screen.getByText(/Permanently delete all characters, favorites, and settings/i)
    ).toBeInTheDocument();
  });

  it("should call onClearAll when clear button is clicked", async () => {
    const user = userEvent.setup();
    const onClearAll = vi.fn();
    renderWithTabs({ ...defaultProps, onClearAll });
    const clearButton = screen.getByRole("button", { name: /Clear All Data/i });
    await user.click(clearButton);
    expect(onClearAll).toHaveBeenCalledOnce();
  });

  it("should have destructive variant for clear button", () => {
    renderWithTabs(defaultProps);
    const clearButton = screen.getByRole("button", { name: /Clear All Data/i });
    expect(clearButton.className).toContain("destructive");
  });

  it("should have outline variant for export button", () => {
    renderWithTabs(defaultProps);
    const exportButton = screen.getByRole("button", { name: /Download Backup JSON/i });
    expect(exportButton.className).toContain("outline");
  });
});
