"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export const FolioSelect = ({
  id,
  label,
  value,
  options,
  onValueChange,
  disabled = false,
}: {
  id?: string;
  label: string;
  value: string;
  options: {
    value: string;
    label: string;
  }[];
  onValueChange: (value: string) => void;
  disabled?: boolean;
}) => {
  return (
    <Select
      disabled={disabled}
      items={options}
      value={value}
      onValueChange={(next) => {
        if (next !== null) onValueChange(next);
      }}
    >
      <SelectTrigger id={id} aria-label={label} className="folio-select">
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="start" alignItemWithTrigger={false} className="folio-select-menu">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
