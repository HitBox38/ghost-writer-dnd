import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CharacterSheetUpload } from "../character-sheet-upload";

describe("CharacterSheetUpload", () => {
  const defaultProps = {
    characterSheet: "",
    isUploading: false,
    onFileUpload: vi.fn(),
    onRemoveSheet: vi.fn(),
  };

  it("should render file input when no sheet is uploaded", () => {
    render(<CharacterSheetUpload {...defaultProps} />);

    expect(screen.getByLabelText(/Character Sheet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Character Sheet/i)).toHaveAttribute("type", "file");
  });

  it("should only accept PDF files", () => {
    render(<CharacterSheetUpload {...defaultProps} />);

    const input = screen.getByLabelText(/Character Sheet/i) as HTMLInputElement;
    expect(input.accept).toBe(".pdf");
  });

  it("should call onFileUpload when file is selected", async () => {
    const user = userEvent.setup();
    const onFileUpload = vi.fn();
    render(<CharacterSheetUpload {...defaultProps} onFileUpload={onFileUpload} />);

    const file = new File(["test"], "character.pdf", { type: "application/pdf" });
    const input = screen.getByLabelText(/Character Sheet/i);

    await user.upload(input, file);

    expect(onFileUpload).toHaveBeenCalledOnce();
  });

  it("should disable file input when uploading", () => {
    render(<CharacterSheetUpload {...defaultProps} isUploading={true} />);

    const input = screen.getByLabelText(/Character Sheet/i);
    expect(input).toBeDisabled();
  });

  it("should show attached message when sheet is uploaded", () => {
    render(<CharacterSheetUpload {...defaultProps} characterSheet="base64data" />);

    expect(screen.getByText("Character sheet attached")).toBeInTheDocument();
    expect(screen.queryByLabelText(/Character Sheet/i)).not.toBeInTheDocument();
  });

  it("should render remove button when sheet is uploaded", () => {
    render(<CharacterSheetUpload {...defaultProps} characterSheet="base64data" />);

    const removeButton = screen.getByRole("button");
    expect(removeButton).toBeInTheDocument();
  });

  it("should call onRemoveSheet when remove button is clicked", async () => {
    const user = userEvent.setup();
    const onRemoveSheet = vi.fn();
    render(
      <CharacterSheetUpload
        {...defaultProps}
        characterSheet="base64data"
        onRemoveSheet={onRemoveSheet}
      />
    );

    const removeButton = screen.getByRole("button");
    await user.click(removeButton);

    expect(onRemoveSheet).toHaveBeenCalledOnce();
  });

  it("should have correct button variant and size", () => {
    render(<CharacterSheetUpload {...defaultProps} characterSheet="base64data" />);

    const removeButton = screen.getByRole("button");
    expect(removeButton.className).toContain("outline");
  });
});
