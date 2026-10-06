import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { ChartContext } from "../constants";
import { ChartLegendContent } from "../components/chart-legend-content";
import { ChartTooltipContent } from "../components/chart-tooltip-content";

const config = { alpha: { label: "Alpha" }, beta: { label: "Beta" } };
const payload = [
  { graphicalItemId: "series-alpha", dataKey: "alpha", name: "alpha", value: 1, color: "red" },
  { graphicalItemId: "series-beta", dataKey: "beta", name: "beta", value: 2, color: "blue" },
];
const legendPayload = payload.map((item) => ({ ...item, value: String(item.value) }));

it("does not format tooltip labels while the tooltip is inactive", () => {
  const formatLabel = vi.fn((label) => String(label));
  const { rerender } = render(
    <ChartContext.Provider value={{ config }}>
      <ChartTooltipContent active={false} payload={payload} labelFormatter={formatLabel} />
    </ChartContext.Provider>,
  );
  expect(formatLabel).not.toHaveBeenCalled();
  rerender(
    <ChartContext.Provider value={{ config }}>
      <ChartTooltipContent active payload={payload} labelFormatter={formatLabel} />
    </ChartContext.Provider>,
  );
  expect(formatLabel).toHaveBeenCalledWith("Alpha", payload);
});

it("keeps each legend entry's DOM identity when series reorder", () => {
  const { rerender } = render(
    <ChartContext.Provider value={{ config }}>
      <ChartLegendContent payload={legendPayload} />
    </ChartContext.Provider>,
  );
  const alpha = screen.getByText("Alpha");
  rerender(
    <ChartContext.Provider value={{ config }}>
      <ChartLegendContent payload={[...legendPayload].reverse()} />
    </ChartContext.Provider>,
  );
  expect(screen.getByText("Alpha")).toBe(alpha);
});

it("keeps each tooltip entry's DOM identity when series reorder", () => {
  const { rerender } = render(
    <ChartContext.Provider value={{ config }}>
      <ChartTooltipContent active hideLabel payload={payload} />
    </ChartContext.Provider>,
  );
  const alpha = screen.getByText("Alpha");
  rerender(
    <ChartContext.Provider value={{ config }}>
      <ChartTooltipContent active hideLabel payload={[...payload].reverse()} />
    </ChartContext.Provider>,
  );
  expect(screen.getByText("Alpha")).toBe(alpha);
});
