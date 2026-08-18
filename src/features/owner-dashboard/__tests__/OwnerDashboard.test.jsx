import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../test/testUtils.jsx";

import DashboardHeader from "../components/DashboardHeader.jsx";
import SummaryCard from "../components/SummaryCard.jsx";
import BookingsOverviewChart from "../components/BookingsOverviewChart.jsx";
import RevenueOverviewChart from "../components/RevenueOverviewChart.jsx";
import RecentBookingsTable from "../components/RecentBookingsTable.jsx";
import PropertyPerformanceTable from "../components/PropertyPerformanceTable.jsx";
import TasksReminders from "../components/TasksReminders.jsx";

describe("Owner Dashboard Components Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("DashboardHeader", () => {
    it("renders personalized owner greeting and date range", () => {
      renderWithProviders(<DashboardHeader ownerName="Om Kale" />);
      expect(
        screen.getByRole("heading", { name: /Welcome back, Om Kale!/i })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Here's what's happening with your properties today/i)
      ).toBeInTheDocument();
    });

    it("toggles date range selector dropdown", async () => {
      const user = userEvent.setup();
      renderWithProviders(<DashboardHeader ownerName="Om Kale" />);

      const dateButton = screen.getByRole("button");
      await user.click(dateButton);

      expect(screen.getByText("This Month")).toBeInTheDocument();
      expect(screen.getByText("This Year")).toBeInTheDocument();
    });
  });

  describe("SummaryCard", () => {
    it("renders metric title, value, and active/inactive dots", () => {
      renderWithProviders(
        <SummaryCard
          title="Total Properties"
          value={3}
          subtextType="dots"
          activeCount={2}
          inactiveCount={1}
        />
      );

      expect(screen.getByText("Total Properties")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText(/2 Active/i)).toBeInTheDocument();
      expect(screen.getByText(/1 Inactive/i)).toBeInTheDocument();
    });

    it("renders trend indicator when subtextType is trend", () => {
      renderWithProviders(
        <SummaryCard
          title="Total Bookings"
          value={18}
          subtextType="trend"
          trend="12%"
          subtext="vs last 7 days"
        />
      );

      expect(screen.getByText("Total Bookings")).toBeInTheDocument();
      expect(screen.getByText("18")).toBeInTheDocument();
      expect(screen.getByText(/↑ 12%/i)).toBeInTheDocument();
      expect(screen.getByText(/vs last 7 days/i)).toBeInTheDocument();
    });
  });

  describe("BookingsOverviewChart & RevenueOverviewChart", () => {
    it("renders BookingsOverviewChart with empty state when no bookings exist", () => {
      renderWithProviders(
        <BookingsOverviewChart totalBookings={0} data={[]} />
      );

      expect(screen.getByText("Bookings Overview")).toBeInTheDocument();
      expect(
        screen.getByText("No bookings found for this period.")
      ).toBeInTheDocument();
    });

    it("renders RevenueOverviewChart with formatted revenue when populated", () => {
      renderWithProviders(
        <RevenueOverviewChart
          totalRevenue={68450}
          trend="18%"
          data={[{ label: "8 Aug", value: 10000, date: "2025-08-08" }]}
        />
      );

      expect(screen.getByText("Revenue Overview")).toBeInTheDocument();
      expect(screen.getByText("₹68,450")).toBeInTheDocument();
      expect(screen.getByText(/↑ 18%/i)).toBeInTheDocument();
    });
  });

  describe("RecentBookingsTable", () => {
    it("renders empty state when no bookings are available", () => {
      renderWithProviders(<RecentBookingsTable bookings={[]} />);
      expect(
        screen.getByText("No bookings found for this period.")
      ).toBeInTheDocument();
    });

    it("renders booking rows when real bookings are supplied", () => {
      const bookings = [
        {
          booking_id: 101,
          guest_name: "Rahul Sharma",
          property_name: "Deluxe Sea View",
          check_in_date: "16 Aug 2025",
          check_out_date: "18 Aug 2025",
          total_amount: 6500,
          status: "Confirmed",
        },
      ];

      renderWithProviders(<RecentBookingsTable bookings={bookings} />);
      expect(screen.getByText("Rahul Sharma")).toBeInTheDocument();
      expect(screen.getByText("Deluxe Sea View")).toBeInTheDocument();
      expect(screen.getByText("16 Aug 2025")).toBeInTheDocument();
      expect(screen.getByText("₹6,500")).toBeInTheDocument();
      expect(screen.getByText("Confirmed")).toBeInTheDocument();
    });
  });

  describe("PropertyPerformanceTable", () => {
    it("renders empty state with Add Property action when properties list is empty", () => {
      renderWithProviders(<PropertyPerformanceTable properties={[]} />);
      expect(screen.getByText("No properties found.")).toBeInTheDocument();
      expect(screen.getByText("Add Property")).toBeInTheDocument();
    });

    it("renders property rows with location, rating, and revenue", () => {
      const properties = [
        {
          property_id: 1,
          property_name: "Deluxe Sea View",
          city: "Dapoli",
          total_rooms: 8,
          total_bookings: 10,
          total_revenue: 32450,
          average_rating: 4.6,
          occupancy_rate: 78,
        },
      ];

      renderWithProviders(
        <PropertyPerformanceTable properties={properties} />
      );

      expect(screen.getByText("Deluxe Sea View")).toBeInTheDocument();
      expect(screen.getByText("Dapoli")).toBeInTheDocument();
      expect(screen.getByText("78%")).toBeInTheDocument();
      expect(screen.getByText("₹32,450")).toBeInTheDocument();
      expect(screen.getByText("4.6")).toBeInTheDocument();
    });
  });

  describe("TasksReminders", () => {
    it("generates dynamic actionable tasks based on property verification and photos", () => {
      const properties = [
        {
          property_id: 1,
          property_name: "Holiday Homestay",
          is_verified: false,
          property_status: "Draft",
          cover_image: null,
          cdn_url: null,
        },
      ];

      renderWithProviders(<TasksReminders properties={properties} />);
      expect(
        screen.getByText("Complete property verification")
      ).toBeInTheDocument();
      expect(screen.getAllByText("Holiday Homestay").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("Due in 2 days")).toBeInTheDocument();
    });

    it("renders empty completed state when all properties are verified and configured", () => {
      renderWithProviders(<TasksReminders properties={[]} />);
      expect(
        screen.getByText(/No tasks or reminders available/i)
      ).toBeInTheDocument();
    });
  });
});
