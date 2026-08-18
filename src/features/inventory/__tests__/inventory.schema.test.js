import { describe, it, expect } from "vitest";
import {
  roomBlockSchema,
  stopSellSchema,
  dailyInventoryCalendarSchema,
  inventorySetupSchema,
  defaultRoomBlockValues,
  defaultStopSellValues,
  defaultDailyInventoryCalendarValues,
  defaultInventorySetupValues,
  BLOCK_TYPES,
  STOP_SELL_TYPES,
  INVENTORY_STATUSES,
} from "../schemas/inventory.schema.js";

describe("Inventory Schemas Validation", () => {
  describe("roomBlockSchema", () => {
    it("validates valid room block payload", () => {
      const validData = {
        property_id: "1",
        room_id: "2",
        block_reference: "BLK-2026-001",
        block_type: "Operational",
        block_reason: "Painting work",
        start_date: "2026-09-01",
        end_date: "2026-09-05",
        blocked_units: 2,
        release_automatically: true,
        status: "Scheduled",
        affects_inventory: true,
        affects_booking: true,
        affects_checkin: true,
        remarks: "Internal maintenance",
      };
      const result = roomBlockSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("fails when end_date is before start_date", () => {
      const invalidData = {
        property_id: "1",
        room_id: "2",
        start_date: "2026-09-10",
        end_date: "2026-09-05",
        blocked_units: 1,
      };
      const result = roomBlockSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toMatch(/end date must be on or after start date/i);
      }
    });

    it("fails when required fields are missing", () => {
      const invalidData = {
        property_id: "",
        room_id: "",
        start_date: "",
        end_date: "",
      };
      const result = roomBlockSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("contains expected default values and constants", () => {
      expect(BLOCK_TYPES).toContain("Operational");
      expect(BLOCK_TYPES).toContain("Maintenance");
      expect(defaultRoomBlockValues.blocked_units).toBe(1);
    });
  });

  describe("stopSellSchema", () => {
    it("validates valid stop sell rule", () => {
      const validData = {
        property_id: "1",
        room_id: "2",
        stop_sell_type: "Room",
        reason_type: "Operational",
        reason: "Renovation",
        start_date: "2026-09-01",
        end_date: "2026-09-03",
        affects_new_bookings: true,
        affects_modifications: false,
        affects_existing_bookings: false,
        affects_all_channels: true,
        status: "Scheduled",
      };
      const result = stopSellSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("fails when end_date is before start_date", () => {
      const invalidData = {
        property_id: "1",
        start_date: "2026-09-10",
        end_date: "2026-09-01",
      };
      const result = stopSellSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("contains expected STOP_SELL_TYPES", () => {
      expect(STOP_SELL_TYPES).toContain("Room");
      expect(STOP_SELL_TYPES).toContain("Property");
      expect(defaultStopSellValues.stop_sell_type).toBe("Room");
    });
  });

  describe("dailyInventoryCalendarSchema", () => {
    it("validates daily calendar day update", () => {
      const validData = {
        inventory_id: 10,
        room_id: 2,
        property_id: 1,
        inventory_date: "2026-08-20",
        total_units: 5,
        available_units: 3,
        booked_units: 2,
        blocked_units: 0,
        maintenance_units: 0,
        stop_sell_units: 0,
        daily_price: 3000,
        daily_discount_price: 2700,
        is_sellable: true,
        is_available: true,
        minimum_stay_nights: 1,
        inventory_status: "Available",
      };
      const result = dailyInventoryCalendarSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("fails on negative units or prices", () => {
      const invalidData = {
        total_units: -1,
        available_units: -5,
        daily_price: -100,
      };
      const result = dailyInventoryCalendarSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("contains valid INVENTORY_STATUSES", () => {
      expect(INVENTORY_STATUSES).toContain("Available");
      expect(INVENTORY_STATUSES).toContain("Sold Out");
      expect(INVENTORY_STATUSES).toContain("Blocked");
      expect(defaultDailyInventoryCalendarValues.total_units).toBe(1);
    });
  });

  describe("inventorySetupSchema", () => {
    it("validates inventory setup defaults", () => {
      const validData = {
        property_id: "1",
        room_id: "2",
        total_units: 10,
        default_daily_price: 2500,
        default_min_stay: 1,
        auto_replenish: true,
        buffer_units: 1,
      };
      const result = inventorySetupSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("fails when property_id or room_id is missing", () => {
      const invalidData = {
        property_id: "",
        room_id: "",
        total_units: 1,
      };
      const result = inventorySetupSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
