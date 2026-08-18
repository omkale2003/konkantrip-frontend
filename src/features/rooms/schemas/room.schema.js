import { z } from "zod";

export const BED_POSITIONS = ["Primary", "Secondary", "Extra", "Optional"];

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
 * Room Basic Details Schema (used in RoomBasicDetailsStep)
 */
export const roomBasicDetailsSchema = z.object({
  property_id: z.preprocess(
    (val) => (val === null || val === undefined ? "" : String(val).trim()),
    z.string().min(1, "Property selection is required")
  ),
  room_name: z.preprocess(
    (val) => (val === null || val === undefined ? "" : String(val).trim()),
    z.string().min(1, "Room name is required").max(150, "Room name must be less than 150 characters")
  ),
  room_code: z.preprocess(
    (val) => (val === null || val === undefined ? "" : String(val).trim()),
    z.string().min(1, "Room code is required").max(50, "Room code must be less than 50 characters")
  ),
  price: z.coerce.number().min(0, "Price must be at least 0").optional().default(0),
  room_type_id: z.preprocess(
    (val) => (val === null || val === undefined ? "" : String(val).trim()),
    z.string().min(1, "Room type is required")
  ),
  room_status_id: z.preprocess(
    (val) => (val === null || val === undefined ? "" : String(val).trim()),
    z.string().min(1, "Room status is required")
  ),
  room_view_id: optionalString(),
  description: optionalString(),
  sort_order: z.coerce.number().min(0).default(1),
  is_bookable: optionalBoolean(true),
  is_published: optionalBoolean(true),
});

export const defaultRoomBasicDetailsValues = {
  property_id: "",
  room_name: "",
  room_code: "",
  price: 0,
  room_type_id: "",
  room_status_id: "",
  room_view_id: "",
  description: "",
  sort_order: 1,
  is_bookable: true,
  is_published: true,
};

/**
 * Room Capacity Schema (used in RoomCapacityStep)
 */
export const roomCapacitySchema = z.object({
  maximum_guests: z.coerce.number().min(1, "Max guests must be at least 1").default(2),
  maximum_adults: z.coerce.number().min(1, "Max adults must be at least 1").default(2),
  maximum_children: z.coerce.number().min(0).default(0),
  base_occupancy: z.coerce.number().min(1, "Base occupancy must be at least 1").default(2),
  extra_bed_allowed: z.coerce.number().default(1),
  extra_bed_price: z.coerce.number().min(0).default(0),
  extra_bed_count: z.coerce.number().min(0).default(1),
  floor_number: optionalString(),
  is_bookable: optionalBoolean(true),
  is_published: optionalBoolean(true),
  is_active: optionalBoolean(true),
  sort_order: z.coerce.number().min(0).default(1),
  smoking_allowed: z.coerce.number().default(0),
  pets_allowed: z.coerce.number().default(0),
});

export const defaultRoomCapacityValues = {
  maximum_guests: 2,
  maximum_adults: 2,
  maximum_children: 0,
  base_occupancy: 2,
  extra_bed_allowed: 1,
  extra_bed_price: 0,
  extra_bed_count: 1,
  floor_number: "",
  is_bookable: true,
  is_published: true,
  is_active: true,
  sort_order: 1,
  smoking_allowed: 0,
  pets_allowed: 0,
};

/**
 * Room Bed Schema (used in RoomBedsStep and RoomBeds)
 */
export const roomBedSchema = z.object({
  bed_type_id: z.preprocess(
    (val) => (val === null || val === undefined ? "" : String(val).trim()),
    z.string().min(1, "Bed type is required")
  ),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1").default(1),
  bed_position: z.enum(BED_POSITIONS).default("Primary"),
  is_default: optionalBoolean(false),
  is_extra_bed: optionalBoolean(false),
  additional_charge: z.coerce.number().min(0).default(0),
  is_active: optionalBoolean(true),
  remarks: optionalString(),
});

export const defaultRoomBedValues = {
  bed_type_id: "",
  quantity: 1,
  bed_position: "Primary",
  is_default: false,
  is_extra_bed: false,
  additional_charge: 0,
  is_active: true,
  remarks: "",
};

/**
 * Room Facility Schema (used in RoomFacilitiesStep and RoomFacilities)
 */
export const roomFacilitySchema = z.object({
  room_facility_id: z.preprocess(
    (val) => (val === null || val === undefined ? "" : String(val).trim()),
    z.string().min(1, "Facility selection is required")
  ),
  facility_value: optionalString(),
  is_available: optionalBoolean(true),
  is_complimentary: optionalBoolean(true),
  additional_charge: z.coerce.number().min(0).default(0),
  remarks: optionalString(),
});

export const defaultRoomFacilityValues = {
  room_facility_id: "",
  facility_value: "",
  is_available: true,
  is_complimentary: true,
  additional_charge: 0,
  remarks: "",
};

/**
 * Room Amenity Schema (used in RoomAmenitiesStep and RoomAmenities)
 */
export const roomAmenitySchema = z.object({
  amenity_id: z.preprocess(
    (val) => (val === null || val === undefined ? "" : String(val).trim()),
    z.string().min(1, "Amenity selection is required")
  ),
  is_available: optionalBoolean(true),
  is_complimentary: optionalBoolean(true),
  additional_charge: z.coerce.number().min(0).default(0),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1").default(1),
  remarks: optionalString(),
});

export const defaultRoomAmenityValues = {
  amenity_id: "",
  is_available: true,
  is_complimentary: true,
  additional_charge: 0,
  quantity: 1,
  remarks: "",
};

/**
 * Room Quick Form Schema (used in standalone RoomForm modal)
 */
export const roomQuickFormSchema = z
  .object({
    room_name: z.preprocess(
      (val) => (val === null || val === undefined ? "" : String(val).trim()),
      z.string().min(1, "Room name is required").max(100, "Room name must be less than 100 characters")
    ),
    room_code: z.preprocess(
      (val) => (val === null || val === undefined ? "" : String(val).trim()),
      z.string().min(1, "Room code is required").max(20, "Room code must be less than 20 characters")
    ),
    price: z.coerce.number().min(0, "Price must be at least 0").optional().default(0),
    room_type_id: z.preprocess(
      (val) => (val === null || val === undefined ? "" : String(val).trim()),
      z.string().min(1, "Room type is required")
    ),
    room_status_id: z.preprocess(
      (val) => (val === null || val === undefined ? "" : String(val).trim()),
      z.string().min(1, "Room status is required")
    ),
    base_occupancy: z.coerce.number().min(1, "At least 1 base guest").default(2),
    maximum_guests: z.coerce.number().min(1, "At least 1 max guest").default(2),
    is_bookable: optionalBoolean(true),
    is_published: optionalBoolean(true),
  })
  .refine((data) => data.maximum_guests >= data.base_occupancy, {
    message: "Max guests must be >= base guests",
    path: ["maximum_guests"],
  });

export const defaultRoomQuickFormValues = {
  room_name: "",
  room_code: "",
  price: 0,
  room_type_id: "",
  room_status_id: "",
  base_occupancy: 2,
  maximum_guests: 2,
  is_bookable: true,
  is_published: true,
};
