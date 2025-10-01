import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { MODEL_OPTIONS } from '@/lib/types';
import type { AIProvider } from '@/lib/types';

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
        <Select value={provider} onValueChange={(v) => onProviderChange(v as AIProvider)}>
          <SelectTrigger id="provider">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="openai">OpenAI</SelectItem>
            <SelectItem value="anthropic">Anthropic</SelectItem>
            <SelectItem value="google">Google AI</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="model">Model</Label>
        <Select value={model} onValueChange={onModelChange}>
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
        <Label htmlFor="temperature">Temperature: {temperature.toFixed(2)}</Label>
        <Slider
          id="temperature"
          min={0}
          max={1}
          step={0.05}
          value={[temperature]}
          onValueChange={([v]) => onTemperatureChange(v)}
        />
        <p className="text-xs text-muted-foreground">
          Lower = more focused, Higher = more creative
        </p>
      </div>
    </>
  );
};