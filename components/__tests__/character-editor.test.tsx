import Link from "next/link";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, afterEach, expect, it, vi } from "vitest";
import { CharacterEditor } from "../character-editor";
import { useCharacterStore } from "@/stores/character-store";
import { useCharacterDraftStore } from "@/stores/character-draft-store";
import { characterFixture } from "@/tests/fixtures/characters";
import { readPortrait, readCharacterSheet } from "@/lib/character-files";
import { storage } from "@/lib/storage";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("@/lib/character-files", () => ({ readPortrait: vi.fn(), readCharacterSheet: vi.fn() }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@/components/pdf-document", () => ({ default: () => <div>PDF pages</div> }));
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal(
    "URL",
    class extends URL {
      static createObjectURL = vi.fn(() => "blob:character-sheet");
      static revokeObjectURL = vi.fn();
    },
  );
  useCharacterStore.setState({
    initialized: true,
    characters: [characterFixture],
    activeCharacterId: characterFixture.id,
  });
  useCharacterDraftStore.getState().reset();
  vi.mocked(readPortrait).mockResolvedValue("data:image/webp;base64,AAAA");
  vi.mocked(readCharacterSheet).mockResolvedValue("data:application/pdf;base64,AAAA");
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it.each([undefined, "merrin"])(
  "previews a draft PDF without saving or leaving (character: %s)",
  async (characterId) => {
    const { container } = render(<CharacterEditor characterId={characterId} />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/Name/), " Draft");
    expect(screen.queryByRole("button", { name: "View PDF" })).not.toBeInTheDocument();
    await user.upload(
      container.querySelector<HTMLInputElement>("#character-sheet")!,
      new File(["pdf"], "Draft sheet.pdf", { type: "application/pdf" }),
    );
    const trigger = await screen.findByRole("button", { name: "View PDF" });
    await user.click(trigger);
    const dialog = await screen.findByRole("dialog", { name: "Draft sheet.pdf" });
    expect(await within(dialog).findByText("PDF pages")).toBeVisible();
    expect(within(dialog).getByRole("link", { name: "Download PDF" })).toHaveAttribute(
      "download",
      "Draft sheet.pdf",
    );
    await user.click(within(dialog).getByRole("button", { name: "Close" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(push).not.toHaveBeenCalled();
    expect(useCharacterStore.getState().characters[0].characterSheet).toBeUndefined();
    expect(screen.getByText("Unsaved changes")).toBeVisible();
    await waitFor(() => expect(trigger).toHaveFocus());
  },
);

it("waits for local data and handles a missing character", () => {
  useCharacterStore.setState({ initialized: false });
  const { rerender } = render(<CharacterEditor characterId="missing" />);
  expect(screen.getByRole("status")).toHaveTextContent("Opening character");
  act(() => useCharacterStore.setState({ initialized: true }));
  rerender(<CharacterEditor characterId="missing" />);
  expect(screen.getByRole("heading", { name: "Character not found" })).toBeVisible();
});

it("creates a minimal character with a trimmed name", async () => {
  render(<CharacterEditor />);
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/Name/), "  New bard  ");
  await user.click(screen.getByRole("button", { name: "Create character" }));
  expect(useCharacterStore.getState().characters.at(-1)).toMatchObject({
    name: "New bard",
    level: 1,
  });
  expect(push).toHaveBeenCalledWith("/generate");
  expect(useCharacterDraftStore.getState().drafts).toEqual({});
});

it("persists the full edited voice and homebrew identity", async () => {
  render(<CharacterEditor characterId="merrin" />);
  const user = userEvent.setup();
  for (const [label, value] of [
    ["Race / species", "Clockwork"],
    ["Class", "Storykeeper"],
    ["Backstory & personality", "Speaks in proverbs"],
    ["Appearance", "Copper eyes"],
    ["Campaign setting", "The dreaming city"],
  ] as const) {
    await user.clear(screen.getByLabelText(label));
    await user.paste(value);
  }
  await user.clear(screen.getByLabelText("Level"));
  await user.type(screen.getByLabelText("Level"), "12");
  await user.click(screen.getByRole("button", { name: "Save changes" }));
  expect(useCharacterStore.getState().characters[0]).toMatchObject({
    race: "Clockwork",
    class: "Storykeeper",
    level: 12,
    backstory: "Speaks in proverbs",
    appearance: "Copper eyes",
    worldSetting: "The dreaming city",
  });
});

it("validates whitespace names and invalid levels without discarding input", () => {
  render(<CharacterEditor />);
  fireEvent.change(screen.getByLabelText(/Name/), { target: { value: " " } });
  fireEvent.submit(screen.getByRole("button", { name: "Create character" }).closest("form")!);
  expect(screen.getByRole("alert")).toHaveTextContent("Give your character a name");
  fireEvent.change(screen.getByLabelText(/Name/), { target: { value: "Named" } });
  fireEvent.change(screen.getByLabelText("Level"), { target: { value: "30" } });
  fireEvent.submit(screen.getByRole("button", { name: "Create character" }).closest("form")!);
  expect(screen.getByRole("alert")).toHaveTextContent("1 to 20");
  expect(push).not.toHaveBeenCalled();
});

it("confirms dirty cancellation, allows staying, and discards only on request", async () => {
  render(<CharacterEditor characterId="merrin" />);
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/Name/), " changed");
  await user.click(screen.getByRole("button", { name: "Back to workspace" }));
  const dialog = screen.getByRole("alertdialog");
  await user.click(within(dialog).getByRole("button", { name: "Cancel" }));
  await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
  expect(screen.getByLabelText(/Name/)).toHaveValue("Merrin Ashvale changed");
  await user.click(screen.getByRole("button", { name: "Cancel" }));
  await user.click(screen.getByRole("button", { name: "Discard changes" }));
  expect(useCharacterDraftStore.getState().drafts).toEqual({});
  expect(useCharacterStore.getState().characters[0].name).toBe("Merrin Ashvale");
  expect(push).toHaveBeenCalledWith("/generate");
});

it("preserves an unfinished draft when navigating back and returning", async () => {
  const user = userEvent.setup();
  const first = render(<CharacterEditor />);
  await user.type(screen.getByLabelText(/Name/), "Unfinished bard");
  first.unmount();
  render(<CharacterEditor />);
  expect(screen.getByLabelText(/Name/)).toHaveValue("Unfinished bard");
  expect(screen.getByText("Unsaved changes")).toBeVisible();
});

it("guards in-app links while editing and warns before reloading", async () => {
  render(
    <>
      <Link href="/settings/connections">Go to settings</Link>
      <CharacterEditor characterId="merrin" />
    </>,
  );
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/Name/), " changed");
  const event = new Event("beforeunload", { cancelable: true });
  act(() => {
    window.dispatchEvent(event);
  });
  expect(event.defaultPrevented).toBe(true);
  expect(screen.getByRole("alert")).toHaveTextContent("You have unsaved changes");
  await user.click(screen.getByRole("link", { name: "Go to settings" }));
  await user.click(screen.getByRole("button", { name: "Discard changes" }));
  expect(push).toHaveBeenCalledWith("/settings/connections");
});

it.each([
  { key: "r", ctrlKey: true },
  { key: "R", ctrlKey: true, shiftKey: true },
  { key: "r", metaKey: true },
  { key: "F5" },
  { key: "F5", ctrlKey: true },
])("confirms dirty refresh shortcuts and preserves edits when canceled (%j)", async (shortcut) => {
  render(<CharacterEditor characterId="merrin" />);
  fireEvent.change(screen.getByLabelText(/Name/), { target: { value: "Keep this draft" } });
  const event = new KeyboardEvent("keydown", { ...shortcut, bubbles: true, cancelable: true });
  act(() => {
    window.dispatchEvent(event);
  });
  expect(event.defaultPrevented).toBe(true);
  const dialog = screen.getByRole("alertdialog");
  expect(dialog).toHaveTextContent("Refreshing will discard your unsaved edits");
  await userEvent.setup().click(within(dialog).getByRole("button", { name: "Cancel" }));
  expect(screen.getByLabelText(/Name/)).toHaveValue("Keep this draft");
  expect(useCharacterDraftStore.getState().drafts.merrin.name).toBe("Keep this draft");
  expect(push).not.toHaveBeenCalled();
});

it("lets clean and reverted forms refresh without prompting", () => {
  render(<CharacterEditor characterId="merrin" />);
  function expectUnguarded() {
    const unload = new Event("beforeunload", { cancelable: true });
    const refresh = new KeyboardEvent("keydown", { key: "F5", cancelable: true });
    act(() => {
      window.dispatchEvent(unload);
      window.dispatchEvent(refresh);
    });
    expect(unload.defaultPrevented).toBe(false);
    expect(refresh.defaultPrevented).toBe(false);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  }
  expectUnguarded();
  fireEvent.change(screen.getByLabelText(/Name/), { target: { value: "Changed" } });
  fireEvent.change(screen.getByLabelText(/Name/), { target: { value: characterFixture.name } });
  expectUnguarded();
});

it("offers confirmation when an embedded browser silently blocks unloading", async () => {
  render(<CharacterEditor characterId="merrin" />);
  fireEvent.change(screen.getByLabelText(/Name/), { target: { value: "Keep this draft" } });
  act(() => {
    window.dispatchEvent(new Event("beforeunload", { cancelable: true }));
  });
  await userEvent.setup().click(screen.getByRole("button", { name: "Discard and refresh" }));
  const dialog = screen.getByRole("alertdialog");
  expect(within(dialog).getByRole("button", { name: "Discard and refresh" })).toBeVisible();
  await userEvent.setup().click(within(dialog).getByRole("button", { name: "Cancel" }));
  expect(screen.getByLabelText(/Name/)).toHaveValue("Keep this draft");
  expect(push).not.toHaveBeenCalled();
});

it("attaches, replaces, removes, and stores optional files", async () => {
  const { container } = render(<CharacterEditor characterId="merrin" />);
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Upload portrait" }));
  await user.upload(
    screen.getByLabelText("Portrait image"),
    new File(["png"], "image.png", { type: "image/png" }),
  );
  expect(await screen.findByRole("img", { name: "Portrait of Merrin Ashvale" })).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Replace portrait" }));
  await user.upload(
    screen.getByLabelText("Portrait image"),
    new File(["other"], "new.png", { type: "image/png" }),
  );
  await user.click(screen.getByRole("button", { name: "Attach PDF" }));
  await user.upload(
    container.querySelector<HTMLInputElement>("#character-sheet")!,
    new File(["pdf"], "sheet.pdf", { type: "application/pdf" }),
  );
  expect(await screen.findByText("sheet.pdf")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Replace PDF" }));
  await user.click(screen.getByRole("button", { name: "Remove portrait" }));
  await user.click(screen.getByRole("button", { name: "Remove PDF" }));
  await user.click(screen.getByRole("button", { name: "Save changes" }));
  expect(useCharacterStore.getState().characters[0].portrait).toBeUndefined();
  expect(useCharacterStore.getState().characters[0].characterSheet).toBeUndefined();
  expect(useCharacterStore.getState().characters[0].characterSheetMetadata).toBeUndefined();
});

it("retains a failed upload draft and handles storage exhaustion", async () => {
  vi.mocked(readPortrait).mockRejectedValueOnce(new Error("Invalid image"));
  const { container } = render(<CharacterEditor />);
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/Name/), "Keep me");
  await user.upload(
    screen.getByLabelText("Portrait image"),
    new File(["bad"], "image.png", { type: "image/png" }),
  );
  expect(await screen.findByRole("alert")).toHaveTextContent("Invalid image");
  vi.spyOn(storage, "saveCharacters").mockImplementation(() => {
    throw new Error("QuotaExceeded");
  });
  fireEvent.submit(container.querySelector("form")!);
  expect(screen.getByRole("alert")).toHaveTextContent("Your draft is still here");
  expect(screen.getByLabelText(/Name/)).toHaveValue("Keep me");
});

it("disables saving during attachment processing and handles untyped errors", async () => {
  let reject!: (reason: unknown) => void;
  vi.mocked(readPortrait).mockImplementationOnce(
    () =>
      new Promise((_, fail) => {
        reject = fail;
      }),
  );
  render(<CharacterEditor />);
  const user = userEvent.setup();
  await user.upload(
    screen.getByLabelText("Portrait image"),
    new File(["png"], "image.png", { type: "image/png" }),
  );
  expect(screen.getByRole("button", { name: "Create character" })).toBeDisabled();
  await act(async () => reject(null));
  expect(screen.getByRole("alert")).toHaveTextContent("Couldn't read the file");
});

it("leaves a clean editor immediately", async () => {
  render(<CharacterEditor characterId="merrin" />);
  await userEvent.setup().click(screen.getByRole("button", { name: "Back to workspace" }));
  expect(push).toHaveBeenCalledWith("/generate");
  expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
});

it("requires a separate confirmation for deletion and reports failures", async () => {
  render(<CharacterEditor characterId="merrin" />);
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Delete character" }));
  const save = vi.spyOn(storage, "saveCharacters").mockImplementationOnce(() => {
    throw new Error("Storage");
  });
  await user.click(
    within(screen.getByRole("alertdialog")).getByRole("button", { name: "Delete character" }),
  );
  expect(screen.getByRole("alert")).toHaveTextContent("Couldn't delete");
  save.mockRestore();
  await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
  await user.click(screen.getByRole("button", { name: "Delete character" }));
  await user.click(
    within(screen.getByRole("alertdialog")).getByRole("button", { name: "Delete character" }),
  );
  await waitFor(() => expect(useCharacterStore.getState().characters).toHaveLength(0));
});

it("shows PDF loading, preserves original details on failure, and saves file metadata", async () => {
  let resolve!: (data: string) => void;
  vi.mocked(readCharacterSheet).mockImplementationOnce(
    () =>
      new Promise((done) => {
        resolve = done;
      }),
  );
  const { container, unmount } = render(<CharacterEditor characterId="merrin" />);
  const user = userEvent.setup();
  const file = new File(["pdf contents"], "Merrin level seven.pdf", { type: "application/pdf" });
  await user.upload(container.querySelector<HTMLInputElement>("#character-sheet")!, file);
  expect(screen.getByRole("status")).toHaveTextContent("Reading PDF");
  expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();
  await act(async () => resolve("data:application/pdf;base64,AAAA"));
  expect(screen.getByText(file.name)).toBeVisible();
  expect(container.querySelector("time")).toHaveAttribute("datetime");
  vi.mocked(readCharacterSheet).mockRejectedValueOnce(new Error("Unreadable PDF"));
  await user.upload(
    container.querySelector<HTMLInputElement>("#character-sheet")!,
    new File(["bad"], "bad.pdf", { type: "application/pdf" }),
  );
  expect(await screen.findByRole("alert")).toHaveTextContent("Unreadable PDF");
  expect(screen.getByText(file.name)).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Save changes" }));
  expect(useCharacterStore.getState().characters[0].characterSheetMetadata).toEqual({
    name: file.name,
    size: file.size,
    uploadedAt: expect.any(Number),
  });
  unmount();
  act(() => useCharacterStore.getState().loadCharacters());
  render(<CharacterEditor characterId="merrin" />);
  expect(screen.getByText(file.name)).toBeVisible();
  expect(screen.getByText(/12 B · Added/)).toBeVisible();
  expect(screen.queryByText("Original file details unavailable")).not.toBeInTheDocument();
});

it("shows a recovered size for older PDFs without inventing file metadata", () => {
  useCharacterStore.setState({
    characters: [{ ...characterFixture, characterSheet: "data:application/pdf;base64,JVBERg==" }],
  });
  const { container } = render(<CharacterEditor characterId="merrin" />);
  expect(screen.getByText("Character sheet.pdf")).toBeVisible();
  expect(screen.getByText("4 B · PDF attached")).toBeVisible();
  expect(container.querySelector("time")).not.toBeInTheDocument();
  expect(useCharacterStore.getState().characters[0].characterSheetMetadata).toBeUndefined();
  expect(screen.getByText("All changes saved")).toBeVisible();
});
