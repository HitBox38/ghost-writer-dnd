import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import GeneratePage from "@/app/(main)/generate/page";
import { useCharacterStore } from "@/stores/character-store";
import { useSettingsStore } from "@/stores/settings-store";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { characterFixture, quipFixtures } from "@/tests/fixtures/characters";
import { generateFlavorTextAction } from "@/app/(main)/generate/actions";
import { getProviderModelsAction } from "@/app/(main)/generate/model-actions";
import { emptyApiKeys } from "@/lib/types";
vi.mock("@/app/(main)/generate/actions", () => ({
  generateFlavorTextAction: vi.fn(),
}));
vi.mock("@/app/(main)/generate/model-actions", () => ({
  getProviderModelsAction: vi.fn(),
}));
vi.mock("@/hooks/use-mobile", () => ({
  useIsMobile: () => false,
}));
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));
vi.mock("@/components/pdf-document", () => ({
  default: () => <div>PDF pages</div>,
}));
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
    activeCharacterId: "merrin",
  });
  useSettingsStore.setState({
    settings: {
      provider: "openai",
      apiKey: "key",
      apiKeys: {
        ...emptyApiKeys(),
        openai: "key",
        anthropic: "other",
        google: "google",
        openrouter: "router",
      },
      model: "gpt-5",
      temperature: 0.8,
      theme: "light",
    },
  });
  useWorkspaceStore.getState().reset();
  vi.mocked(generateFlavorTextAction).mockResolvedValue(quipFixtures);
  vi.mocked(getProviderModelsAction).mockImplementation(async (provider) =>
    provider === "anthropic"
      ? [
          {
            value: "claude-opus-4-1",
            label: "Claude 4.1 Opus",
          },
          {
            value: "claude-haiku-4",
            label: "Claude 4 Haiku",
          },
        ]
      : [
          {
            value: "gpt-5",
            label: "GPT-5",
          },
        ],
  );
});
afterEach(() => vi.unstubAllGlobals());
it("passes edited scene, count, provider, model and creativity to generation", async () => {
  render(<GeneratePage />);
  const user = userEvent.setup();
  await user.click(
    screen.getByRole("button", {
      name: "Catchphrases",
    }),
  );
  await user.type(screen.getByLabelText("What's happening?"), "A speech");
  await user.clear(screen.getByLabelText("Number of lines"));
  await user.type(screen.getByLabelText("Number of lines"), "12");
  await user.click(screen.getByText("AI settings"));
  await user.click(
    screen.getByRole("combobox", {
      name: "Provider",
    }),
  );
  await user.click(
    await screen.findByRole("option", {
      name: "Anthropic",
    }),
  );
  await user.click(
    screen.getByRole("combobox", {
      name: "Model",
    }),
  );
  expect(getProviderModelsAction).toHaveBeenCalledWith("anthropic", "other", false);
  await user.type(
    screen.getByRole("combobox", {
      name: "Model",
    }),
    "opus",
  );
  expect(
    screen.queryByRole("option", {
      name: /Haiku/,
    }),
  ).not.toBeInTheDocument();
  await user.click(
    await screen.findByRole("option", {
      name: /Claude 4.1 Opus/,
    }),
  );
  await user.click(
    screen.getByRole("button", {
      name: "High",
    }),
  );
  expect(
    screen.getByRole("button", {
      name: "High",
    }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(useSettingsStore.getState().settings.reasoningEffort).toBe("high");
  fireEvent.change(screen.getByLabelText(/Creativity/), {
    target: {
      value: "1.2",
    },
  });
  await user.click(
    screen.getByRole("button", {
      name: "Generate lines",
    }),
  );
  await waitFor(() => expect(screen.getAllByRole("article")).toHaveLength(12));
  expect(generateFlavorTextAction).toHaveBeenCalledWith(
    expect.any(Object),
    "catchphrase",
    "anthropic",
    "claude-opus-4-1",
    "other",
    1.2,
    "A speech",
    12,
    "high",
  );
});
it("filters for PDF-capable models and opens the sheet in a modal without generating", async () => {
  useCharacterStore.setState({
    characters: [
      {
        ...characterFixture,
        characterSheet: "data:application/pdf;base64,AAAA",
      },
    ],
  });
  render(<GeneratePage />);
  await waitFor(() => expect(getProviderModelsAction).toHaveBeenCalledWith("openai", "key", true));
  const user = userEvent.setup();
  const trigger = screen.getByRole("button", {
    name: /Character sheet.pdf/,
  });
  await user.type(screen.getByLabelText("What's happening?"), "Keep this scene");
  await user.click(trigger);
  expect(
    await screen.findByRole("dialog", {
      name: "Character sheet.pdf",
    }),
  ).toBeVisible();
  expect(await screen.findByText("PDF pages")).toBeVisible();
  await user.keyboard("{Control>}{Enter}{/Control}");
  expect(generateFlavorTextAction).not.toHaveBeenCalled();
  await user.click(
    within(screen.getByRole("dialog")).getByRole("button", {
      name: "Close",
    }),
  );
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  expect(screen.getByLabelText("What's happening?")).toHaveValue("Keep this scene");
  await waitFor(() => expect(trigger).toHaveFocus());
});
it("fills and focuses an editable scene starter without generating", async () => {
  render(<GeneratePage />);
  const user = userEvent.setup();
  await user.click(
    screen.getByRole("button", {
      name: /A duel of wits/,
    }),
  );
  const draft = screen.getByLabelText("What's happening?");
  expect(draft).toHaveValue(
    "A pompous knight challenges me to a duel in front of my party. Give me a cutting reply.",
  );
  await waitFor(() => expect(draft).toHaveFocus());
  expect(generateFlavorTextAction).not.toHaveBeenCalled();
  await user.type(draft, " Keep it playful.");
  expect((draft as HTMLTextAreaElement).value).toContain("Keep it playful.");
});
it("offers only supported reasoning choices for Mistral and disables Cohere", async () => {
  useSettingsStore.getState().updateSettings({
    provider: "mistral",
    reasoningEffort: "low",
  });
  render(<GeneratePage />);
  const user = userEvent.setup();
  await user.click(screen.getByText("AI settings"));
  expect(
    screen.getByRole("button", {
      name: "Default",
    }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(
    screen.queryByRole("button", {
      name: "Low",
    }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", {
      name: "High",
    }),
  ).toBeInTheDocument();
  act(() => useSettingsStore.getState().setProvider("cohere"));
  expect(
    screen.getByRole("button", {
      name: "Default",
    }),
  ).toBeDisabled();
});
it("clears a saved model that cannot read the attached PDF", async () => {
  useCharacterStore.setState({
    characters: [
      {
        ...characterFixture,
        characterSheet: "data:application/pdf;base64,AAAA",
      },
    ],
  });
  vi.mocked(getProviderModelsAction).mockResolvedValueOnce([]);
  render(<GeneratePage />);
  await waitFor(() => expect(useSettingsStore.getState().settings.model).toBe(""));
  expect(screen.getByText(/Saved model can't read the attached PDF/)).toBeInTheDocument();
  expect(
    screen.getByRole("button", {
      name: "Generate lines",
    }),
  ).toBeDisabled();
});
it("keeps draft values through collapsing and expands with keyboard focus", async () => {
  render(<GeneratePage />);
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("What's happening?"), "Keep this");
  await user.click(
    screen.getByRole("button", {
      name: "Hide scene",
    }),
  );
  await waitFor(() =>
    expect(
      screen.getByRole("button", {
        name: "Show scene",
      }),
    ).toHaveFocus(),
  );
  expect(screen.getByLabelText("What's happening?").closest(".scene-sidebar")).toHaveAttribute(
    "inert",
  );
  await user.click(
    screen.getByRole("button", {
      name: "Show scene",
    }),
  );
  await waitFor(() =>
    expect(
      screen.getByRole("button", {
        name: "Hide scene",
      }),
    ).toHaveFocus(),
  );
  expect(screen.getByLabelText("What's happening?")).toHaveValue("Keep this");
});
it("shows provider configuration guidance and rejects invalid counts", async () => {
  useSettingsStore.getState().setApiKey("");
  render(<GeneratePage />);
  expect(
    screen.getByRole("link", {
      name: "Configure provider",
    }),
  ).toHaveAttribute("href", "/settings/connections");
  expect(
    screen.getByRole("button", {
      name: "Generate lines",
    }),
  ).toBeDisabled();
  act(() => useSettingsStore.getState().setApiKey("key"));
  fireEvent.change(screen.getByLabelText("Number of lines"), {
    target: {
      value: "26",
    },
  });
  expect(
    screen.getByRole("button", {
      name: "Generate lines",
    }),
  ).toBeDisabled();
  fireEvent.change(screen.getByLabelText("Number of lines"), {
    target: {
      value: "",
    },
  });
  expect(
    screen.getByRole("button", {
      name: "Generate lines",
    }),
  ).toBeDisabled();
});
it("reports loading and failed generation while keeping the draft", async () => {
  let reject!: (error: Error) => void;
  vi.mocked(generateFlavorTextAction).mockImplementationOnce(
    () =>
      new Promise((_, fail) => {
        reject = fail;
      }),
  );
  render(<GeneratePage />);
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("What's happening?"), "A bad day");
  fireEvent.keyDown(screen.getByLabelText("What's happening?"), {
    key: "a",
  });
  expect(generateFlavorTextAction).not.toHaveBeenCalled();
  fireEvent.keyDown(screen.getByLabelText("What's happening?"), {
    key: "Enter",
    ctrlKey: true,
  });
  expect(
    screen.getByRole("button", {
      name: "Writing lines…",
    }),
  ).toBeDisabled();
  await act(async () => reject(new Error("Provider unavailable")));
  expect(screen.getByRole("alert")).toHaveTextContent("Provider unavailable");
  expect(screen.getByLabelText("What's happening?")).toHaveValue("A bad day");
});
