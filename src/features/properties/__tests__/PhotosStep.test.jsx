import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import PhotosStep from "../components/property-wizard/steps/PhotosStep.jsx";
import { renderWithProviders } from "../../../test/testUtils.jsx";
import * as imageHooks from "../hooks/usePropertyImages.js";

vi.mock("../hooks/usePropertyImages.js", () => ({
  usePropertyImages: vi.fn(),
  usePropertyImageTypes: vi.fn(),
  useAddPropertyImage: vi.fn(),
  useUpdatePropertyImage: vi.fn(),
  useDeletePropertyImage: vi.fn(),
}));

describe("PhotosStep Component", () => {
  const mockOnSubmit = vi.fn();
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    imageHooks.usePropertyImages.mockReturnValue({
      data: {
        data: [
          { property_image_id: 10, image_url: "https://example.com/photo1.jpg", is_cover: true, caption: "Main Pool" },
        ],
      },
    });
    imageHooks.usePropertyImageTypes.mockReturnValue({
      data: { data: [{ image_type_id: 1, type_name: "Exterior" }] },
    });
    imageHooks.useAddPropertyImage.mockReturnValue({ mutateAsync: vi.fn().mockResolvedValue({}) });
    imageHooks.useUpdatePropertyImage.mockReturnValue({ mutateAsync: vi.fn().mockResolvedValue({}) });
    imageHooks.useDeletePropertyImage.mockReturnValue({ mutateAsync: vi.fn().mockResolvedValue({}) });
  });

  it("renders uploaded property images and submit controls", () => {
    renderWithProviders(
      <PhotosStep propertyId={42} onSubmit={mockOnSubmit} onBack={mockOnBack} />
    );

    expect(screen.getByRole("heading", { name: /photos/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save & continue/i })).toBeInTheDocument();
  });

  it("navigates forward when clicking Save & Continue", () => {
    renderWithProviders(
      <PhotosStep propertyId={42} onSubmit={mockOnSubmit} onBack={mockOnBack} />
    );

    const submitBtn = screen.getByRole("button", { name: /save & continue/i });
    fireEvent.click(submitBtn);

    expect(mockOnSubmit).toHaveBeenCalled();
  });
});
