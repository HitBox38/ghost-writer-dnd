import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiTab, Props } from "../api-tab";
import { Tabs } from "@/components/ui/tabs";
import type { Settings } from "@/lib/types";

const renderWithTabs = (props: Props) => {
  return render(
    <Tabs defaultValue="api">
      <ApiTab {...props} />
    </Tabs>
  );
};

describe("ApiTab", () => {
  const mockSettings: Settings = {
    provider: "openai",
    apiKeys: { openai: "sk-test-key", anthropic: "", google: "", openrouter: "" },
    theme: "system",
    temperature: 0.7,
    apiKey: "",
    model: "",
  };

  const defaultProps = {
    settings: mockSettings,
    isTesting: false,
    testResults: {},
    onApiKeyChange: vi.fn(),
    onTestConnection: vi.fn(),
  };

  it("should render security notice", () => {
    renderWithTabs(defaultProps);
    expect(screen.getByText(/Your API keys never leave your browser/i)).toBeInTheDocument();
  });

  it("should render all provider sections", () => {
    renderWithTabs(defaultProps);
    expect(screen.getByText("OpenAI")).toBeInTheDocument();
    expect(screen.getByText("Anthropic")).toBeInTheDocument();
    expect(screen.getByText("Gemini")).toBeInTheDocument();
    expect(screen.getByText("OpenRouter")).toBeInTheDocument();
  });

  it("should call onTestConnection when test button is clicked", async () => {
    const user = userEvent.setup();
    renderWithTabs(defaultProps);
    const testButton = screen.getByRole("button", { name: /Test All Connections/i });
    await user.click(testButton);
    expect(defaultProps.onTestConnection).toHaveBeenCalledOnce();
  });

  it("should disable test button when testing", () => {
    renderWithTabs({ ...defaultProps, isTesting: true });
    const testButton = screen.getByRole("button", { name: /Testing Connections/i });
    expect(testButton).toBeDisabled();
  });

  it("should disable test button when no API keys are set", () => {
    const settingsWithoutKeys: Settings = {
      ...mockSettings,
      apiKeys: { openai: "", anthropic: "", google: "", openrouter: "" },
    };
    renderWithTabs({ ...defaultProps, settings: settingsWithoutKeys });
    const testButton = screen.getByRole("button", { name: /Test All Connections/i });
    expect(testButton).toBeDisabled();
  });

  it("should show loading spinner when testing", () => {
    renderWithTabs({ ...defaultProps, isTesting: true });
    expect(screen.getByText(/Testing Connections/i)).toBeInTheDocument();
  });

  it("should pass correct props to ProviderSection components", async () => {
    const user = userEvent.setup();
    renderWithTabs(defaultProps);
    const openaiTrigger = screen.getByText("OpenAI").closest("button");
    await user.click(openaiTrigger!);
    await waitFor(() => expect(screen.getByPlaceholderText("sk-...")).toBeInTheDocument());
  });

  it("should call onApiKeyChange when provider API key is changed", async () => {
    const user = userEvent.setup();
    const onApiKeyChange = vi.fn();
    renderWithTabs({ ...defaultProps, onApiKeyChange });
    const openaiTrigger = screen.getByText("OpenAI").closest("button");
    await user.click(openaiTrigger!);
    await waitFor(() => expect(screen.getByPlaceholderText("sk-...")).toBeInTheDocument());
    const input = screen.getByPlaceholderText("sk-...");
    await user.clear(input);
    await user.type(input, "new-key");
    expect(onApiKeyChange).toHaveBeenCalled();
  });

  it("should render TestResultsDisplay with test results", () => {
    const testResults = { openai: true, anthropic: false };
    renderWithTabs({ ...defaultProps, testResults });
    expect(screen.getByRole("button", { name: /Test All Connections/i })).toBeInTheDocument();
  });
});
