import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { FieldError } from "../components/field-error";

it("keeps each unique error's DOM identity when validation order changes", () => {
  const errors = [{ message: "Name is required" }, { message: "Email is required" }];
  const { rerender } = render(<FieldError errors={errors} />);
  const nameError = screen.getByText("Name is required");
  rerender(<FieldError errors={[...errors].reverse()} />);
  expect(screen.getByText("Name is required")).toBe(nameError);
});
