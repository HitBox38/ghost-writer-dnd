import { act, fireEvent, render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { SettingsScreen } from "../settings-screen";
import { useSettingsStore } from "@/stores/settings-store";
import { useCharacterStore } from "@/stores/character-store";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { characterFixture } from "@/tests/fixtures/characters";
import { storage } from "@/lib/storage";
import { testProviderAction } from "@/app/(main)/settings/actions";
import { toast } from "sonner";
import { emptyApiKeys } from "@/lib/types";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("@/app/(main)/settings/actions", () => ({ testProviderAction: vi.fn() }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
beforeEach(() => {
  vi.clearAllMocks();
  useSettingsStore.setState({
    settings: {
      provider: "openai",
      apiKey: "test-key",
      apiKeys: { ...emptyApiKeys(), openai: "test-key" },
      model: "gpt-5",
      temperature: 0.8,
      theme: "light",
    },
  });
  useCharacterStore.setState({
    initialized: true,
    characters: [characterFixture],
    activeCharacterId: "merrin",
  });
  useWorkspaceStore.getState().reset();
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
  vi.mocked(testProviderAction).mockResolvedValue(true);
});
afterEach(() => vi.restoreAllMocks());

it("waits for hydration and provides direct section navigation", async () => {
  useCharacterStore.setState({ initialized: false });
  const { rerender } = render(<SettingsScreen section="connections" />);
  expect(screen.getByText("Loading settings…")).toBeVisible();
  act(() => useCharacterStore.setState({ initialized: true }));
  rerender(<SettingsScreen section="connections" />);
  expect(screen.getByRole("link", { name: "AI connections" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  const user = userEvent.setup();
  await user.click(screen.getByRole("combobox", { name: "Settings section" }));
  await user.click(await screen.findByRole("option", { name: "Data & backups" }));
  expect(push).toHaveBeenCalledWith("/settings/data");
});

it("saves a masked key without changing provider, then explicitly switches", async () => {
  render(<SettingsScreen section="connections" />);
  const user = userEvent.setup();
  const row = screen.getByText("Anthropic", { selector: "strong" }).closest("details")!;
  await user.click(row.querySelector("summary")!);
  await user.type(within(row).getByLabelText("Anthropic API key"), "new-key");
  expect(useSettingsStore.getState().settings.apiKeys.anthropic).toBe("");
  expect(within(row).getByRole("button", { name: "Test connection" })).toBeDisabled();
  await user.click(within(row).getByRole("button", { name: "Save key" }));
  expect(useSettingsStore.getState().settings.provider).toBe("openai");
  expect(useSettingsStore.getState().settings.apiKeys.anthropic).toBe("new-key");
  await user.click(within(row).getByRole("button", { name: "Use this provider" }));
  expect(useSettingsStore.getState().settings.apiKey).toBe("new-key");
});

it("shows a connection row for every supported provider", () => {
  render(<SettingsScreen section="connections" />);
  for (const name of ["xAI", "Groq", "Mistral", "DeepSeek", "Cohere", "Cerebras"])
    expect(screen.getByText(name, { selector: "strong" })).toBeVisible();
});

it("toggles visibility, verifies a connection, and invalidates it after changing the key", async () => {
  render(<SettingsScreen section="connections" />);
  const user = userEvent.setup();
  const key = screen.getByLabelText("OpenAI API key");
  const row = key.closest("details")!;
  await user.click(screen.getByRole("button", { name: "Show OpenAI key" }));
  expect(key).toHaveAttribute("type", "text");
  await user.click(screen.getByRole("button", { name: "Hide OpenAI key" }));
  expect(key).toHaveAttribute("type", "password");
  await user.click(within(row).getByRole("button", { name: "Test connection" }));
  await waitFor(() =>
    expect(row.querySelector("summary")).toHaveTextContent("Connection verified"),
  );
  await user.clear(key);
  await user.type(key, "replacement");
  await user.click(within(row).getByRole("button", { name: "Save key" }));
  expect(row.querySelector("summary")).toHaveTextContent("Key saved");
  await user.clear(key);
  await user.click(within(row).getByRole("button", { name: "Save key" }));
  expect(row.querySelector("summary")).toHaveTextContent("Not configured");
  expect(useSettingsStore.getState().settings.apiKey).toBe("");
});

it.each([false, "reject"])("shows a recoverable provider failure (%s)", async (outcome) => {
  if (outcome === "reject")
    vi.mocked(testProviderAction).mockRejectedValueOnce(new Error("Network"));
  else vi.mocked(testProviderAction).mockResolvedValueOnce(false);
  render(<SettingsScreen section="connections" />);
  await userEvent.setup().click(screen.getAllByRole("button", { name: "Test connection" })[0]);
  expect(await screen.findByRole("alert")).toHaveTextContent(
    outcome === "reject" ? "Couldn't reach" : "Connection failed",
  );
  expect(toast.error).toHaveBeenCalledWith(
    outcome === "reject"
      ? "Couldn't reach the provider. Try again in a moment."
      : "Connection failed. Check the key, provider access, and available credits, then try again.",
  );
  expect(screen.getAllByRole("button", { name: "Test connection" })[0]).toBeEnabled();
});

it("reports key save and provider switch failures without pretending they succeeded", async () => {
  render(<SettingsScreen section="connections" />);
  const user = userEvent.setup();
  const row = screen.getByText("Anthropic", { selector: "strong" }).closest("details")!;
  await user.click(row.querySelector("summary")!);
  await user.type(within(row).getByLabelText("Anthropic API key"), "new-key");
  const save = vi.spyOn(storage, "saveSettings").mockImplementationOnce(() => {
    throw new Error("quota");
  });
  await user.click(within(row).getByRole("button", { name: "Save key" }));
  expect(screen.getByRole("alert")).toHaveTextContent("Couldn't save the key");
  save.mockRestore();
  await user.click(within(row).getByRole("button", { name: "Save key" }));
  vi.spyOn(storage, "saveSettings").mockImplementationOnce(() => {
    throw new Error("quota");
  });
  await user.click(within(row).getByRole("button", { name: "Use this provider" }));
  expect(screen.getByRole("alert")).toHaveTextContent("Couldn't switch providers");
});

it("applies themes and saves the layout preference", async () => {
  render(<SettingsScreen section="appearance" />);
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Dark" }));
  expect(useSettingsStore.getState().settings.theme).toBe("dark");
  await user.click(screen.getByRole("button", { name: "System" }));
  expect(useSettingsStore.getState().settings.theme).toBe("system");
  await user.click(screen.getByRole("button", { name: "List" }));
  expect(useWorkspaceStore.getState().layout).toBe("list");
  expect(useSettingsStore.getState().settings.resultLayout).toBe("list");
  await user.click(screen.getByRole("button", { name: "Grid" }));
  expect(useWorkspaceStore.getState().layout).toBe("grid");
});

it("exports a backup and reports a failed download", async () => {
  const download = vi.spyOn(storage, "downloadFile").mockImplementation(() => {});
  render(<SettingsScreen section="data" />);
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Export backup" }));
  expect(download).toHaveBeenCalled();
  download.mockImplementationOnce(() => {
    throw new Error("blocked");
  });
  await user.click(screen.getByRole("button", { name: "Export backup" }));
  expect(screen.getByRole("alert")).toHaveTextContent("Couldn't export");
});

it("cancels a pending import, then restores only after confirmation", async () => {
  const importData = vi.spyOn(useSettingsStore.getState(), "importData").mockResolvedValue();
  render(<SettingsScreen section="data" />);
  const user = userEvent.setup();
  const file = new File(["{}"], "backup.json", { type: "application/json" });
  await user.click(screen.getByRole("button", { name: "Import backup" }));
  await user.upload(screen.getByLabelText("Backup file"), file);
  expect(importData).not.toHaveBeenCalled();
  await user.click(within(screen.getByRole("alertdialog")).getByRole("button", { name: "Cancel" }));
  await user.upload(screen.getByLabelText("Backup file"), file);
  await user.click(screen.getByRole("button", { name: "Restore backup" }));
  await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
  expect(importData).toHaveBeenCalledWith(file);
});

it.each([new Error("Invalid backup"), null])(
  "reports import errors while preserving current data",
  async (problem) => {
    vi.spyOn(useSettingsStore.getState(), "importData").mockRejectedValueOnce(problem);
    render(<SettingsScreen section="data" />);
    const user = userEvent.setup();
    await user.upload(
      screen.getByLabelText("Backup file"),
      new File(["{}"], "backup.json", { type: "application/json" }),
    );
    await user.click(screen.getByRole("button", { name: "Restore backup" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      problem ? "Invalid backup" : "Couldn't restore",
    );
    expect(useCharacterStore.getState().characters).toHaveLength(1);
  },
);

it("confirms clearing all data and handles a failed clear", async () => {
  const clear = vi
    .spyOn(useSettingsStore.getState(), "clearAllData")
    .mockRejectedValueOnce(new Error("blocked"))
    .mockResolvedValueOnce();
  render(<SettingsScreen section="data" />);
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Clear local data" }));
  await user.click(screen.getByRole("button", { name: "Clear all data" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Couldn't clear local data");
  await user.click(screen.getByRole("button", { name: "Clear local data" }));
  await user.click(screen.getByRole("button", { name: "Clear all data" }));
  await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
  expect(clear).toHaveBeenCalledTimes(2);
});

it("ignores a cancelled file picker", () => {
  render(<SettingsScreen section="data" />);
  fireEvent.change(screen.getByLabelText("Backup file"), { target: { files: [] } });
  expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
});
