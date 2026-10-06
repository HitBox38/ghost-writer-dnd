import { render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";
import Link from "next/link";
import { Item, ItemGroup, ItemSeparator } from "..";

it("uses a native list with valid item wrappers for polymorphic items and separators", () => {
  render(
    <ItemGroup>
      <Item render={<Link href="/first" />}>First</Item>
      <ItemSeparator />
      <Item>Second</Item>
    </ItemGroup>,
  );
  const list = screen.getByRole("list");
  expect(list.tagName).toBe("UL");
  expect(within(list).getAllByRole("listitem")).toHaveLength(2);
  expect(screen.getByRole("link", { name: "First" }).parentElement?.tagName).toBe("LI");
  expect(Array.from(list.children).every((child) => child.tagName === "LI")).toBe(true);
});
