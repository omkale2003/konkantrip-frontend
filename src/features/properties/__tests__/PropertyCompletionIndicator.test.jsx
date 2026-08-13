import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { PropertyCompletionIndicator } from "../components/PropertyCompletionIndicator.jsx";
import { usePropertyCompletion } from "../hooks/usePropertyCompletion.js";

// Mock the hook
vi.mock("../hooks/usePropertyCompletion.js", () => ({
  usePropertyCompletion: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("PropertyCompletionIndicator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderComponent = (property) => {
    return render(
      <BrowserRouter>
        <PropertyCompletionIndicator property={property} />
      </BrowserRouter>
    );
  };

  it("renders loading state", () => {
    usePropertyCompletion.mockReturnValue({ isLoading: true });
    
    renderComponent({ property_id: 1 });
    
    expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders completion percentage", () => {
    usePropertyCompletion.mockReturnValue({
      isLoading: false,
      isError: false,
      completionData: {
        percentage: 75,
        nextIncompleteSection: { name: "Rooms", wizardStep: 5 },
      },
    });

    renderComponent({ property_id: 1 });
    
    expect(screen.getByText("75%")).toBeInTheDocument();
    expect(screen.getByText("Rooms")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Complete Your Property/i })).toBeInTheDocument();
  });

  it("navigates to wizard and sets localStorage when Complete Your Property is clicked", () => {
    usePropertyCompletion.mockReturnValue({
      isLoading: false,
      isError: false,
      completionData: {
        percentage: 30,
        nextIncompleteSection: { name: "Contact", wizardStep: 3 },
      },
    });

    renderComponent({ property_id: 123 });
    
    const button = screen.getByRole("button", { name: /Complete Your Property/i });
    fireEvent.click(button);

    // Verify localStorage was set correctly
    const savedDraft = JSON.parse(localStorage.getItem("konkantrip_property_draft"));
    expect(savedDraft).toEqual({
      propertyId: 123,
      currentStep: 3,
    });

    // Verify navigation
    expect(mockNavigate).toHaveBeenCalledWith("/owner/properties/add?resume=true");
  });

  it("navigates to specific route when next section has a route instead of wizardStep", () => {
    usePropertyCompletion.mockReturnValue({
      isLoading: false,
      isError: false,
      completionData: {
        percentage: 80,
        nextIncompleteSection: { name: "Rooms", route: "/owner/rooms" },
      },
    });

    renderComponent({ property_id: 123 });
    
    const button = screen.getByRole("button", { name: /Complete Your Property/i });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/owner/rooms");
  });

  it("shows 100% complete message", () => {
    usePropertyCompletion.mockReturnValue({
      isLoading: false,
      isError: false,
      completionData: {
        percentage: 100,
        nextIncompleteSection: null,
      },
    });

    renderComponent({ property_id: 123 });
    
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Complete Your Property/i })).not.toBeInTheDocument();
    expect(screen.getByText(/Your property profile is 100% complete/i)).toBeInTheDocument();
  });
});
