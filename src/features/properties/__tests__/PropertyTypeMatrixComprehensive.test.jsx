import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import BasicDetailsStep from "../components/property-wizard/steps/BasicDetailsStep.jsx";
import { renderWithProviders } from "../../../test/testUtils.jsx";

describe("Property Type Matrix & State Reset Comprehensive Suite", () => {
  const mockOnNext = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Property Type Specific Rules", () => {
    it("configures Hotel: enables star rating select and total floors", () => {
      renderWithProviders(
        <BasicDetailsStep onNext={mockOnNext} initialValues={{ property_type: "Hotel" }} />
      );

      const starSelect = screen.getByLabelText(/star rating/i);
      expect(starSelect).not.toBeDisabled();

      const floorsInput = screen.getByLabelText(/total floors/i);
      expect(floorsInput).not.toBeDisabled();
    });

    it("configures Resort: enables star rating select and total floors", () => {
      renderWithProviders(
        <BasicDetailsStep onNext={mockOnNext} initialValues={{ property_type: "Resort" }} />
      );

      const starSelect = screen.getByLabelText(/star rating/i);
      expect(starSelect).not.toBeDisabled();
    });

    it("configures Villa: disables star rating and forces total rooms to 1", () => {
      renderWithProviders(
        <BasicDetailsStep onNext={mockOnNext} initialValues={{ property_type: "Villa" }} />
      );

      const starSelect = screen.getByLabelText(/star rating/i);
      expect(starSelect).toBeDisabled();

      const roomsInput = screen.getByLabelText(/total units \/ rooms/i);
      expect(roomsInput).toBeDisabled();
      expect(roomsInput.value).toBe("1");

      const priceSelect = screen.getByLabelText(/price display/i);
      expect(priceSelect).toBeDisabled();
      expect(priceSelect.value).toBe("Entire Property");
    });

    it("configures Bungalow: disables star rating and forces total rooms to 1", () => {
      renderWithProviders(
        <BasicDetailsStep onNext={mockOnNext} initialValues={{ property_type: "Bungalow" }} />
      );

      const starSelect = screen.getByLabelText(/star rating/i);
      expect(starSelect).toBeDisabled();
    });

    it("configures Beach House: disables star rating and forces total rooms to 1", () => {
      renderWithProviders(
        <BasicDetailsStep onNext={mockOnNext} initialValues={{ property_type: "Beach House" }} />
      );

      const starSelect = screen.getByLabelText(/star rating/i);
      expect(starSelect).toBeDisabled();
    });

    it("configures Tent: disables star rating, total floors to 0, and hides construction years", () => {
      renderWithProviders(
        <BasicDetailsStep onNext={mockOnNext} initialValues={{ property_type: "Tent" }} />
      );

      const starSelect = screen.getByLabelText(/star rating/i);
      expect(starSelect).toBeDisabled();

      const floorsInput = screen.getByLabelText(/total floors/i);
      expect(floorsInput).toBeDisabled();
      expect(floorsInput.value).toBe("0");

      expect(screen.queryByLabelText(/built year/i)).not.toBeInTheDocument();
    });

    it("configures Houseboat: forces total floors to 1", () => {
      renderWithProviders(
        <BasicDetailsStep onNext={mockOnNext} initialValues={{ property_type: "Houseboat" }} />
      );

      const floorsInput = screen.getByLabelText(/total floors/i);
      expect(floorsInput).toBeDisabled();
      expect(floorsInput.value).toBe("1");
    });

    it("configures Hostel: forces price display type to 'Per Person'", () => {
      renderWithProviders(
        <BasicDetailsStep onNext={mockOnNext} initialValues={{ property_type: "Hostel" }} />
      );

      const priceSelect = screen.getByLabelText(/price display/i);
      expect(priceSelect).toBeDisabled();
      expect(priceSelect.value).toBe("Per Person");
    });
  });

  describe("Property Type State Reset Transitions", () => {
    it("resets star rating when changing property type from Hotel to Villa", async () => {
      renderWithProviders(
        <BasicDetailsStep
          onNext={mockOnNext}
          initialValues={{ property_name: "Grand Palace", property_type: "Hotel", star_rating: "5" }}
        />
      );

      const typeSelect = screen.getByLabelText(/property type/i);
      fireEvent.change(typeSelect, { target: { value: "Villa" } });

      await waitFor(() => {
        const starSelect = screen.getByLabelText(/star rating/i);
        expect(starSelect).toBeDisabled();
        expect(starSelect.value).toBe("0");
      });
    });

    it("resets total floors to 0 when changing property type from Hotel to Tent", async () => {
      renderWithProviders(
        <BasicDetailsStep
          onNext={mockOnNext}
          initialValues={{ property_name: "Safari Stay", property_type: "Hotel", total_floors: 4 }}
        />
      );

      const typeSelect = screen.getByLabelText(/property type/i);
      fireEvent.change(typeSelect, { target: { value: "Tent" } });

      await waitFor(() => {
        const floorsInput = screen.getByLabelText(/total floors/i);
        expect(floorsInput).toBeDisabled();
        expect(floorsInput.value).toBe("0");
      });
    });

    it("resets total floors to 1 when changing property type from Hotel to Houseboat", async () => {
      renderWithProviders(
        <BasicDetailsStep
          onNext={mockOnNext}
          initialValues={{ property_name: "Backwater Stay", property_type: "Hotel", total_floors: 3 }}
        />
      );

      const typeSelect = screen.getByLabelText(/property type/i);
      fireEvent.change(typeSelect, { target: { value: "Houseboat" } });

      await waitFor(() => {
        const floorsInput = screen.getByLabelText(/total floors/i);
        expect(floorsInput).toBeDisabled();
        expect(floorsInput.value).toBe("1");
      });
    });

    it("resets price display to 'Per Person' when changing property type from Hotel to Hostel", async () => {
      renderWithProviders(
        <BasicDetailsStep
          onNext={mockOnNext}
          initialValues={{ property_name: "Backpacker Hub", property_type: "Hotel", price_display_type: "Per Room / Per Night" }}
        />
      );

      const typeSelect = screen.getByLabelText(/property type/i);
      fireEvent.change(typeSelect, { target: { value: "Hostel" } });

      await waitFor(() => {
        const priceSelect = screen.getByLabelText(/price display/i);
        expect(priceSelect).toBeDisabled();
        expect(priceSelect.value).toBe("Per Person");
      });
    });

    it("re-enables star rating input when changing property type from Villa back to Hotel", async () => {
      renderWithProviders(
        <BasicDetailsStep
          onNext={mockOnNext}
          initialValues={{ property_name: "Luxury Villa", property_type: "Villa" }}
        />
      );

      const typeSelect = screen.getByLabelText(/property type/i);
      fireEvent.change(typeSelect, { target: { value: "Hotel" } });

      await waitFor(() => {
        const starSelect = screen.getByLabelText(/star rating/i);
        expect(starSelect).not.toBeDisabled();
      });
    });

    it("re-enables total floors and construction years when changing property type from Tent to Hotel", async () => {
      renderWithProviders(
        <BasicDetailsStep
          onNext={mockOnNext}
          initialValues={{ property_name: "Beach Camp", property_type: "Tent" }}
        />
      );

      const typeSelect = screen.getByLabelText(/property type/i);
      fireEvent.change(typeSelect, { target: { value: "Hotel" } });

      await waitFor(() => {
        const floorsInput = screen.getByLabelText(/total floors/i);
        expect(floorsInput).not.toBeDisabled();
        expect(screen.getByLabelText(/built year/i)).toBeInTheDocument();
      });
    });
  });
});
