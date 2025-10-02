import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Props, ProviderSection } from "../provider-section";
import { Accordion } from "@/components/ui/accordion";

describe("ProviderSection", () => {
  const defaultProps: Props = {
    provider: "openai",
    displayName: "OpenAI",
    isActive: true,
    apiKey: "sk-test-key",
    placeholder: "sk-...",
    onApiKeyChange: vi.fn(),
  };

  const renderWithAccordion = (props = defaultProps) => {
    return render(
      <Accordion type="single" collapsible>
        <ProviderSection {...props} />
      </Accordion>
    );
  };

  it("should render provider display name", () => {
    renderWithAccordion();
    expect(screen.getByText("OpenAI")).toBeInTheDocument();
  });

  it("should show active badge when provider is active", () => {
    renderWithAccordion();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("should not show active badge when provider is not active", () => {
    renderWithAccordion({ ...defaultProps, isActive: false });
    expect(screen.queryByText("Active")).not.toBeInTheDocument();
  });

  it("should render API key input when expanded", async () => {
    const user = userEvent.setup();
    renderWithAccordion();

    const trigger = screen.getByText("OpenAI").closest("button");
    await user.click(trigger!);

    await waitFor(() => {
      expect(screen.getByLabelText("API Key")).toBeInTheDocument();
    });
  });

  it("should render password type input", async () => {
    const user = userEvent.setup();
    renderWithAccordion();

    const trigger = screen.getByText("OpenAI").closest("button");
    await user.click(trigger!);

    await waitFor(() => {
      const input = screen.getByLabelText("API Key") as HTMLInputElement;
      expect(input.type).toBe("password");
    });
  });

  it("should display placeholder text", async () => {
    const user = userEvent.setup();
    renderWithAccordion();

    const trigger = screen.getByText("OpenAI").closest("button");
    await user.click(trigger!);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("sk-...")).toBeInTheDocument();
    });
  });

  it("should display current API key value", async () => {
    const user = userEvent.setup();
    renderWithAccordion();

    const trigger = screen.getByText("OpenAI").closest("button");
    await user.click(trigger!);

    await waitFor(() => {
      const input = screen.getByLabelText("API Key") as HTMLInputElement;
      expect(input.value).toBe("sk-test-key");
    });
  });

  it("should call onApiKeyChange when input changes", async () => {
    const user = userEvent.setup();
    const onApiKeyChange = vi.fn();
    renderWithAccordion({ ...defaultProps, onApiKeyChange });

    const trigger = screen.getByText("OpenAI").closest("button");
    await user.click(trigger!);

    await waitFor(() => {
      expect(screen.getByLabelText("API Key")).toBeInTheDocument();
    });

    const input = screen.getByLabelText("API Key");
    await user.clear(input);
    await user.type(input, "new-key");

    expect(onApiKeyChange).toHaveBeenCalled();
  });

  it("should render with different provider names", () => {
    renderWithAccordion({
      ...defaultProps,
      provider: "anthropic",
      displayName: "Anthropic",
    });

    expect(screen.getByText("Anthropic")).toBeInTheDocument();
  });

  it("should use provider-specific id for input", async () => {
    const user = userEvent.setup();
    renderWithAccordion();

    const trigger = screen.getByText("OpenAI").closest("button");
    await user.click(trigger!);

    await waitFor(() => {
      const input = screen.getByLabelText("API Key") as HTMLInputElement;
      expect(input.id).toBe("openai-key");
    });
  });
});
