import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { MODEL_OPTIONS } from "@/lib/types";
import type { AIProvider } from "@/lib/types";

const PROVIDER_OPTIONS: { value: AIProvider; label: string }[] = [
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "google", label: "Google AI" },
  { value: "openrouter", label: "OpenRouter" },
];

interface AiSettingsSectionProps {
  provider: AIProvider;
  model: string;
  temperature: number;
  onProviderChange: (provider: AIProvider) => void;
  onModelChange: (model: string) => void;
  onTemperatureChange: (temperature: number) => void;
}

export const AiSettingsSection = ({
  provider,
  model,
  temperature,
  onProviderChange,
  onModelChange,
  onTemperatureChange,
}: AiSettingsSectionProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="provider">AI Provider</Label>
        <Select
          items={PROVIDER_OPTIONS}
          value={provider}
          onValueChange={(value) => {
            if (value !== null) onProviderChange(value);
          }}
        >
          <SelectTrigger id="provider">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PROVIDER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="model">Model</Label>
        <Select
          items={MODEL_OPTIONS[provider]}
          value={model}
          onValueChange={(value) => {
            if (value !== null) onModelChange(value);
          }}
        >
          <SelectTrigger id="model">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MODEL_OPTIONS[provider].map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label id="temperature-label">Temperature: {temperature.toFixed(2)}</Label>
        <Slider
          id="temperature"
          min={0}
          max={1}
          step={0.05}
          value={[temperature]}
          aria-labelledby="temperature-label"
          onValueChange={([value]) => onTemperatureChange(value)}
        />
        <p className="text-xs text-muted-foreground">
          Lower = more focused, Higher = more creative
        </p>
      </div>
    </>
  );
};
