import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import type { AIProvider } from '@/lib/types';

interface ProviderSectionProps {
  provider: AIProvider;
  displayName: string;
  isActive: boolean;
  apiKey: string;
  placeholder: string;
  onApiKeyChange: (value: string) => void;
}

export const ProviderSection = ({
  provider,
  displayName,
  isActive,
  apiKey,
  placeholder,
  onApiKeyChange,
}: ProviderSectionProps) => {
  return (
    <AccordionItem value={provider}>
      <AccordionTrigger>
        <div className="flex gap-2 items-center flex-1">
          <h3 className="text-lg font-semibold">{displayName}</h3>
          {isActive && (
            <span className="inline-block">
              <Badge variant="secondary">Active</Badge>
            </span>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-2">
        <Label htmlFor={`${provider}-key`}>API Key</Label>
        <Input
          id={`${provider}-key`}
          type="password"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder={placeholder}
        />
      </AccordionContent>
    </AccordionItem>
  );
};