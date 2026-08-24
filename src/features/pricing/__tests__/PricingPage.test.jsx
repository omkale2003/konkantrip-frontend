import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

import PricingPage from "../../owner/pages/PricingPage.jsx";
import * as pricingApi from "../api/pricing.api.js";
import * as roomsApi from "../../rooms/api/rooms.api.js";
import * as propertiesApi from "../../properties/api/properties.api.js";

vi.mock("../api/pricing.api.js");
vi.mock("../../rooms/api/rooms.api.js");
vi.mock("../../properties/api/properties.api.js");

const mockProperties = [
  { property_id: 1, property_name: "Konkan Pearl Resort", property_type: "Resort" },
];

const mockRooms = [
  {
    room_id: 1,
    property_id: 1,
    room_name: "Deluxe Sea View Suite 101",
    room_code: "DSV-101",
    base_price: 3500.0,
    discount_price: 2999.0,
    extra_adult_price: 500.0,
    extra_child_price: 250.0,
    is_active: true,
  },
  {
    room_id: 2,
    property_id: 1,
    room_name: "Beachfront Wooden Cottage 201",
    room_code: "BWC-201",
    base_price: 4500.0,
    discount_price: null,
    extra_adult_price: 600.0,
    extra_child_price: 300.0,
    is_active: true,
  },
];

const mockRates = [
  {
    rate_id: 1,
    room_id: 1,
    property_id: 1,
    room_name: "Deluxe Sea View Suite 101",
    room_code: "DSV-101",
    property_name: "Konkan Pearl Resort",
    rate_name: "Diwali Weekend Surge",
    start_date: "2026-11-01T00:00:00.000Z",
    end_date: "2026-11-10T00:00:00.000Z",
    base_price: 4800.0,
    discount_price: null,
    days_of_week: "Friday,Saturday,Sunday",
    is_active: true,
    delete_status: false,
  },
];

function renderWithProviders(ui) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
}

describe("Pricing Module & Bulk Update Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    propertiesApi.getProperties.mockResolvedValue({
      success: true,
      data: mockProperties,
    });

    roomsApi.getRooms.mockResolvedValue({
      success: true,
      count: mockRooms.length,
      data: mockRooms,
    });

    roomsApi.getRoomLookups.mockResolvedValue({
      success: true,
      data: [{ room_type_id: 1, room_type_name: "Deluxe" }],
    });

    pricingApi.getPricingRates.mockResolvedValue({
      success: true,
      count: mockRates.length,
      data: mockRates,
    });

    pricingApi.bulkUpdatePricing.mockResolvedValue({
      success: true,
      message: "Updated successfully",
    });
  });

  it("renders the Pricing page with KPI stats cards and room list", async () => {
    renderWithProviders(<PricingPage />);

    expect(screen.getByText(/Pricing & Rate Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Bulk Engine Active/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Average Base Rate")).toBeInTheDocument();
      expect(screen.getByText("Deluxe Sea View Suite 101")).toBeInTheDocument();
      expect(screen.getByText("Beachfront Wooden Cottage 201")).toBeInTheDocument();
    });
  });

  it("opens the Bulk Pricing modal when clicking Bulk Price Update button", async () => {
    renderWithProviders(<PricingPage />);

    await waitFor(() => {
      expect(screen.getByText("Deluxe Sea View Suite 101")).toBeInTheDocument();
    });

    const bulkBtns = screen.getAllByRole("button", { name: /Bulk Price Update/i });
    fireEvent.click(bulkBtns[0]);

    await waitFor(() => {
      expect(screen.getByText(/Bulk Pricing & Rate Adjuster/i)).toBeInTheDocument();
      expect(screen.getByText(/Live Calculation Impact Preview/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Execute Bulk Update/i })).toBeInTheDocument();
    });
  });

  it("switches to Seasonal & Holiday Rules tab and displays rate rules", async () => {
    renderWithProviders(<PricingPage />);

    await waitFor(() => {
      expect(screen.getByText("Deluxe Sea View Suite 101")).toBeInTheDocument();
    });

    const seasonalTabBtn = screen.getByRole("button", {
      name: /Seasonal & Holiday Rules/i,
    });
    fireEvent.click(seasonalTabBtn);

    await waitFor(() => {
      expect(screen.getByText("Diwali Weekend Surge")).toBeInTheDocument();
      expect(screen.getByText("New Seasonal Rule")).toBeInTheDocument();
      expect(screen.getByText("Bulk Seasonal Rules")).toBeInTheDocument();
    });

    // Test Upcoming tab filter
    const upcomingBtn = screen.getByRole("button", { name: /^Upcoming$/i });
    fireEvent.click(upcomingBtn);

    await waitFor(() => {
      expect(screen.getByText("Diwali Weekend Surge")).toBeInTheDocument();
    });
  });

  it("opens Bulk Seasonal modal with seasonal mode enabled from Seasonal Rules tab", async () => {
    renderWithProviders(<PricingPage />);

    await waitFor(() => {
      expect(screen.getByText("Deluxe Sea View Suite 101")).toBeInTheDocument();
    });

    const seasonalTabBtn = screen.getByRole("button", {
      name: /Seasonal & Holiday Rules/i,
    });
    fireEvent.click(seasonalTabBtn);

    await waitFor(() => {
      expect(screen.getByText("Bulk Seasonal Rules")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Bulk Seasonal Rules"));

    await waitFor(() => {
      expect(screen.getByText(/Bulk Pricing & Rate Adjuster/i)).toBeInTheDocument();
      expect(screen.getByText(/Scheduled Seasonal \/ Upcoming Rule/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Create Scheduled Seasonal Rules/i })).toBeInTheDocument();
    });
  });
});
