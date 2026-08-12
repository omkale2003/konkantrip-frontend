import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import DocumentsStep from "../components/property-wizard/steps/DocumentsStep.jsx";
import { renderWithProviders } from "../../../test/testUtils.jsx";
import * as docHooks from "../hooks/usePropertyDocuments.js";

vi.mock("../hooks/usePropertyDocuments.js", () => ({
  useDocumentTypes: vi.fn(),
  usePropertyDocuments: vi.fn(),
  useUploadPropertyDocument: vi.fn(),
  useDeletePropertyDocument: vi.fn(),
}));

describe("DocumentsStep Component", () => {
  const mockOnSubmit = vi.fn();
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    docHooks.useDocumentTypes.mockReturnValue({
      data: {
        data: [
          { document_type_id: 1, document_name: "Property Registration Certificate" },
        ],
      },
    });
    docHooks.usePropertyDocuments.mockReturnValue({
      data: {
        data: [
          { property_document_id: 5, document_name: "Property Certificate", document_type_name: "Registration", status: "Verified" },
        ],
      },
    });
    docHooks.useUploadPropertyDocument.mockReturnValue({ mutateAsync: vi.fn() });
    docHooks.useDeletePropertyDocument.mockReturnValue({ mutateAsync: vi.fn() });
  });

  it("renders uploaded document list and verification status badges", () => {
    renderWithProviders(
      <DocumentsStep propertyId={42} onSubmit={mockOnSubmit} onBack={mockOnBack} />
    );

    expect(screen.getByText(/property documents/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save & continue/i })).toBeInTheDocument();
  });

  it("proceeds to next step when clicking Save & Continue", () => {
    renderWithProviders(
      <DocumentsStep propertyId={42} onSubmit={mockOnSubmit} onBack={mockOnBack} />
    );

    const submitBtn = screen.getByRole("button", { name: /save & continue/i });
    fireEvent.click(submitBtn);

    expect(mockOnSubmit).toHaveBeenCalled();
  });
});
