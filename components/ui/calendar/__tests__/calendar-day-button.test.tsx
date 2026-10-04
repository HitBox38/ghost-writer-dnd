import { render, screen } from "@testing-library/react";
import { CalendarDay } from "react-day-picker";
import { expect, it } from "vitest";
import { CalendarDayButton } from "../components/calendar-day-button";

it("uses the calendar day as a locale-independent machine identifier", () => {
  const date = new Date(2026, 9, 4);
  const day = new CalendarDay(date, date);
  const { rerender } = render(
    <CalendarDayButton day={day} modifiers={{}} locale={{ code: "en-US" }}>
      4
    </CalendarDayButton>,
  );
  expect(screen.getByRole("button")).toHaveAttribute("data-day", "2026-10-04");
  rerender(
    <CalendarDayButton day={day} modifiers={{}} locale={{ code: "he" }}>
      4
    </CalendarDayButton>,
  );
  expect(screen.getByRole("button")).toHaveAttribute("data-day", "2026-10-04");
});
