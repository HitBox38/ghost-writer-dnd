import * as React from "react"

type SliderProps = {
  value: number
  min?: number
  max?: number
  step?: number
  onChange?: (value: number) => void
}

export const Slider = ({ value, min = 0, max = 1, step = 0.1, onChange }: SliderProps) => {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange?.(Number(e.target.value))}
      className="w-full accent-primary"
      aria-label="slider"
    />
  )
}

