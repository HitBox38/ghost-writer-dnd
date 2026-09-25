import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AiSettingsSection } from "../ai-settings-section";
import { GenerationSliders } from "../generation-sliders";
import { MODEL_OPTIONS } from "@/lib/types";

function renderSettings() {
  const onProviderChange = vi.fn();
  const onModelChange = vi.fn();
  const onTemperatureChange = vi.fn();
  render(
    <AiSettingsSection
      provider="openai"
      model={MODEL_OPTIONS.openai[0].value}
      temperature={0.7}
      onProviderChange={onProviderChange}
      onModelChange={onModelChange}
      onTemperatureChange={onTemperatureChange}
    />,
  );
  return { onProviderChange, onModelChange, onTemperatureChange };
}

describe("Base UI generation controls", () => {
  beforeEach(() => {
    // jsdom has no layout. Inset thumbs need a nonzero control width before
    // Base UI exposes them; real visibility and keyboard behavior also run in Playwright.
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      return new DOMRect(0, 0, this.dataset.slot === "slider-thumb" ? 16 : 240, 16);
    });
  });

  afterEach(() => vi.restoreAllMocks());

  it("displays provider labels and sends the selected provider value", async () => {
    const user = userEvent.setup();
    const { onProviderChange } = renderSettings();
    const provider = screen.getByRole("combobox", { name: "AI Provider" });
    expect(provider).toHaveTextContent("OpenAI");
    await user.click(provider);
    await user.click(await screen.findByRole("option", { name: "Anthropic" }));
    expect(onProviderChange).toHaveBeenCalledWith("anthropic");
  });

  it("displays model labels while sending the underlying model identifier", async () => {
    const user = userEvent.setup();
    const { onModelChange } = renderSettings();
    const model = screen.getByRole("combobox", { name: "Model" });
    expect(model).toHaveTextContent(MODEL_OPTIONS.openai[0].label);
    await user.click(model);
    await user.click(await screen.findByRole("option", { name: MODEL_OPTIONS.openai[1].label }));
    expect(onModelChange).toHaveBeenCalledWith(MODEL_OPTIONS.openai[1].value);
  });

  it("labels the temperature thumb and sends a number for keyboard changes", async () => {
    const user = userEvent.setup();
    const { onTemperatureChange } = renderSettings();
    const slider = await screen.findByRole("slider", { name: /Temperature/ });
    act(() => slider.focus());
    await user.keyboard("{End}");
    expect(onTemperatureChange).toHaveBeenCalledWith(1);
  });

  it("labels the result-count thumb and supports its keyboard bounds", async () => {
    const user = userEvent.setup();
    const onResultCountChange = vi.fn();
    render(<GenerationSliders resultCount={5} onResultCountChange={onResultCountChange} />);
    const slider = await screen.findByRole("slider", { name: /Number of Results/ });
    act(() => slider.focus());
    await user.keyboard("{End}");
    expect(onResultCountChange).toHaveBeenCalledWith(25);
    await user.keyboard("{Home}");
    expect(onResultCountChange).toHaveBeenCalledWith(1);
  });
});
