import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { Carousel, CarouselNext, CarouselPrevious } from "..";

const { api, emit } = vi.hoisted(() => {
  const listeners = new Map<string, Set<() => void>>();
  const api = {
    on: vi.fn((event: string, listener: () => void) => {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event)!.add(listener);
    }),
    off: vi.fn((event: string, listener: () => void) => listeners.get(event)?.delete(listener)),
    canScrollPrev: vi.fn(() => false),
    canScrollNext: vi.fn(() => true),
    scrollPrev: vi.fn(),
    scrollNext: vi.fn(),
  };
  return { api, emit: (event: string) => listeners.get(event)?.forEach((notify) => notify()) };
});
vi.mock("embla-carousel-react", () => ({ default: () => [vi.fn(), api] }));

it("publishes the external API without pushing selection state into the parent", async () => {
  const publish = vi.fn();
  const { rerender, unmount } = render(
    <Carousel setApi={publish}>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>,
  );
  expect(publish).toHaveBeenCalledExactlyOnceWith(api);
  expect(screen.getByRole("button", { name: "Previous slide" })).toBeDisabled();
  await userEvent.setup().click(screen.getByRole("button", { name: "Next slide" }));
  expect(api.scrollNext).toHaveBeenCalledTimes(1);
  api.canScrollPrev.mockReturnValue(true);
  await act(() => emit("select"));
  expect(screen.getByRole("button", { name: "Previous slide" })).toBeEnabled();
  expect(publish).toHaveBeenCalledTimes(1);
  const replacementRecipient = vi.fn();
  rerender(<Carousel setApi={replacementRecipient}>Slides</Carousel>);
  expect(replacementRecipient).toHaveBeenCalledExactlyOnceWith(api);
  unmount();
  expect(api.off).toHaveBeenCalled();
});
