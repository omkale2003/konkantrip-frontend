import { z } from "zod";

export const BLOCK_TYPES = [
  "Operational",
  "Maintenance",
  "Renovation",
  "Owner Use",
  "Other",
];

export const BLOCK_STATUSES = ["Scheduled", "Active", "Completed", "Cancelled"];

export const STOP_SELL_TYPES = ["Room", "Property", "Channel"];

export const REASON_TYPES = [
  "Operational",
  "Maintenance",
  "Rate Parity",
  "Overbooking Prevention",
  "Other",
];

export const STOP_SELL_STATUSES = ["Scheduled", "Active", "Inactive", "Cancelled"];

export const INVENTORY_STATUSES = [
  "Available",
  "Sold Out",
  "Blocked",
  "Maintenance",
  "Stop Sell",
];

// Helper to preprocess null/undefined strings to ""
const optionalString = () =>
  z.preprocess(
    (val) => (val === null || val === undefined ? "" : String(val)),
    z.string().optional().or(z.literal(""))
  );

// Helper to preprocess null/undefined/empty numbers to undefined
const optionalNumber = (schema) =>
  z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    schema.optional()
  );

// Helper to preprocess null/undefined booleans
const optionalBoolean = (defaultVal = false) =>
  z.preprocess(
    (val) => (val === null || val === undefined ? defaultVal : Boolean(val)),
    z.boolean().optional()
  );

/**
 * Room Block Schema (used in CreateBlockModal & RoomBlocksPage)
 */
export const roomBlockSchema = z
  .object({
    property_id: z.preprocess(
      (val) => (val === null || val === undefined ? "" : String(val).trim()),
      z.string().min(1, "Property selection is required")
    ),
    room_id: z.preprocess(
      (val) => (val === null || val === undefined ? "" : String(val).trim()),
      z.string().min(1, "Room selection is required")
    ),
    block_reference: optionalString(),
    block_type: z.enum(BLOCK_TYPES).default("Operational"),
    block_reason: optionalString(),
    start_date: z.preprocess(
      (val) => (val === null || val === undefined ? "" : String(val).trim()),
      z.string().min(1, "Start date is required")
    ),
    end_date: z.preprocess(
      (val) => (val === null || val === undefined ? "" : String(val).trim()),
      z.string().min(1, "End date is required")
    ),
    blocked_units: z.coerce.number().min(1, "Blocked units must be at least 1").default(1),
    release_automatically: optionalBoolean(false),
    status: z.enum(BLOCK_STATUSES).default("Scheduled"),
    affects_inventory: optionalBoolean(true),
    affects_booking: optionalBoolean(true),
    affects_checkin: optionalBoolean(true),
    remarks: optionalString(),
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return new Date(data.end_date) >= new Date(data.start_date);
      }
      return true;
    },
    {
      message: "End date must be on or after start date",
      path: ["end_date"],
    }
  );

export const defaultRoomBlockValues = {
  property_id: "",
  room_id: "",
  block_reference: "",
  block_type: "Operational",
  block_reason: "",
  start_date: new Date().toISOString().split("T")[0],
  end_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
  blocked_units: 1,
  release_automatically: false,
  status: "Scheduled",
  affects_inventory: true,
  affects_booking: true,
  affects_checkin: true,
  remarks: "",
};

/**
 * Stop Sell Rule Schema (used in CreateStopSellModal & StopSellPage)
 */
export const stopSellSchema = z
  .object({
    property_id: z.preprocess(
      (val) => (val === null || val === undefined ? "" : String(val).trim()),
      z.string().min(1, "Property selection is required")
    ),
    room_id: optionalString(),
    stop_sell_type: z.enum(STOP_SELL_TYPES).default("Room"),
    reason_type: z.enum(REASON_TYPES).default("Operational"),
    reason: optionalString(),
    start_date: z.preprocess(
      (val) => (val === null || val === undefined ? "" : String(val).trim()),
      z.string().min(1, "Start date is required")
    ),
    end_date: z.preprocess(
      (val) => (val === null || val === undefined ? "" : String(val).trim()),
      z.string().min(1, "End date is required")
    ),
    start_time: optionalString(),
    end_time: optionalString(),
    affects_new_bookings: optionalBoolean(true),
    affects_modifications: optionalBoolean(false),
    affects_existing_bookings: optionalBoolean(false),
    affects_all_channels: optionalBoolean(true),
    status: z.enum(STOP_SELL_STATUSES).default("Scheduled"),
    release_automatically: optionalBoolean(false),
    remarks: optionalString(),
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return new Date(data.end_date) >= new Date(data.start_date);
      }
      return true;
    },
    {
      message: "End date must be on or after start date",
      path: ["end_date"],
    }
  );

export const defaultStopSellValues = {
  property_id: "",
  room_id: "",
  stop_sell_type: "Room",
  reason_type: "Operational",
  reason: "",
  start_date: new Date().toISOString().split("T")[0],
  end_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
  start_time: "",
  end_time: "",
  affects_new_bookings: true,
  affects_modifications: false,
  affects_existing_bookings: false,
  affects_all_channels: true,
  status: "Scheduled",
  release_automatically: false,
  remarks: "",
};

/**
 * Daily Inventory Calendar Day Schema (used in DailyInventoryDrawer)
 */
export const dailyInventoryCalendarSchema = z.object({
  inventory_id: optionalNumber(z.number()),
  room_id: optionalNumber(z.number()),
  property_id: optionalNumber(z.number()),
  inventory_date: optionalString(),
  total_units: z.coerce.number().min(0, "Total units cannot be negative").default(1),
  available_units: z.coerce.number().min(0, "Available units cannot be negative").default(1),
  booked_units: z.coerce.number().min(0).default(0),
  blocked_units: z.coerce.number().min(0).default(0),
  maintenance_units: z.coerce.number().min(0).default(0),
  stop_sell_units: z.coerce.number().min(0).default(0),
  daily_price: optionalNumber(z.number().min(0, "Price cannot be negative")),
  daily_discount_price: optionalNumber(z.number().min(0, "Discount price cannot be negative")),
  is_sellable: optionalBoolean(true),
  is_available: optionalBoolean(true),
  closed_for_arrival: optionalBoolean(false),
  closed_for_departure: optionalBoolean(false),
  minimum_stay_nights: z.coerce.number().min(1, "Minimum stay must be at least 1 night").default(1),
  maximum_stay_nights: optionalNumber(z.number().min(1)),
  inventory_status: z.enum(INVENTORY_STATUSES).default("Available"),
});

export const defaultDailyInventoryCalendarValues = {
  total_units: 1,
  available_units: 1,
  booked_units: 0,
  blocked_units: 0,
  maintenance_units: 0,
  stop_sell_units: 0,
  daily_price: "",
  daily_discount_price: "",
  is_sellable: true,
  is_available: true,
  closed_for_arrival: false,
  closed_for_departure: false,
  minimum_stay_nights: 1,
  maximum_stay_nights: "",
  inventory_status: "Available",
};

/**
 * Inventory Setup / Defaults Schema (used in InventorySetupPage)
 */
export const inventorySetupSchema = z.object({
  property_id: z.preprocess(
    (val) => (val === null || val === undefined ? "" : String(val).trim()),
    z.string().min(1, "Property is required")
  ),
  room_id: z.preprocess(
    (val) => (val === null || val === undefined ? "" : String(val).trim()),
    z.string().min(1, "Room is required")
  ),
  total_units: z.coerce.number().min(1, "Total units must be at least 1").default(1),
  default_daily_price: optionalNumber(z.number().min(0, "Price cannot be negative")),
  default_min_stay: z.coerce.number().min(1, "Minimum stay must be at least 1 night").default(1),
  default_max_stay: optionalNumber(z.number().min(1)),
  auto_replenish: optionalBoolean(true),
  buffer_units: z.coerce.number().min(0).default(0),
});

export const defaultInventorySetupValues = {
  property_id: "",
  room_id: "",
  total_units: 1,
  default_daily_price: "",
  default_min_stay: 1,
  default_max_stay: "",
  auto_replenish: true,
  buffer_units: 0,
};
