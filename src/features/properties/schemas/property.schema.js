import { z } from "zod";

export const PROPERTY_TYPES = [
  "Hotel",
  "Resort",
  "Homestay",
  "Villa",
  "Apartment",
  "Guest House",
  "Hostel",
  "Cottage",
  "Farm Stay",
  "Beach House",
  "Bungalow",
  "Tent",
  "Camping",
  "Houseboat",
];

export const PROPERTY_CATEGORIES = [
  "Budget",
  "Economy",
  "Standard",
  "Premium",
  "Luxury",
  "Boutique",
];

export const PRICE_DISPLAY_TYPES = [
  "Per Night",
  "Per Person",
  "Entire Property",
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

export const propertyBasicDetailsSchema = z.object({
  property_name: z.preprocess(
    (val) => (val === null || val === undefined ? "" : String(val).trim()),
    z.string().min(1, "Property name is required")
  ),

  property_type: z.preprocess(
    (val) => (val === null || val === undefined ? "" : String(val)),
    z
      .string()
      .min(1, "Property type is required")
      .refine(
        (value) => PROPERTY_TYPES.includes(value),
        "Please select a valid property type"
      )
  ),

  property_category: optionalString(),
  short_description: optionalString(),
  property_description: optionalString(),

  star_rating: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? 0 : Number(val)),
    z
      .number()
      .min(0, "Star rating cannot be less than 0")
      .max(5, "Star rating cannot be greater than 5")
      .optional()
  ),

  check_in_time: optionalString(),
  check_out_time: optionalString(),

  total_rooms: optionalNumber(
    z
      .number()
      .int("Total rooms must be a whole number")
      .min(0, "Total rooms cannot be negative")
  ),

  total_floors: optionalNumber(
    z
      .number()
      .int("Total floors must be a whole number")
      .min(0, "Total floors cannot be negative")
  ),

  built_year: optionalNumber(
    z
      .number()
      .int("Built year must be a whole number")
      .min(1000, "Enter a valid year")
      .max(9999, "Enter a valid year")
  ),

  renovated_year: optionalNumber(
    z
      .number()
      .int("Renovated year must be a whole number")
      .min(1000, "Enter a valid year")
      .max(9999, "Enter a valid year")
  ),

  currency_code: optionalString(),
  price_display_type: optionalString(),
  instant_booking: optionalBoolean(true),
});

export const defaultBasicDetailsValues = {
  property_name: "",
  property_type: "",
  property_category: "Standard",
  short_description: "",
  property_description: "",
  star_rating: 0,
  check_in_time: "12:00",
  check_out_time: "10:00",
  total_rooms: 0,
  total_floors: 0,
  built_year: "",
  renovated_year: "",
  currency_code: "INR",
  price_display_type: "Per Night",
  instant_booking: true,
};

export const propertyLocationSchema = z.object({
  address_line1: z.preprocess(
    (val) => (val === null || val === undefined ? "" : String(val).trim()),
    z.string().min(1, "Address Line 1 is required")
  ),

  address_line2: optionalString(),
  landmark: optionalString(),
  village: optionalString(),
  taluka: optionalString(),
  district: optionalString(),
  city: optionalString(),
  state: optionalString(),
  country: optionalString(),

  postal_code: z.preprocess(
    (val) => (val === null || val === undefined ? "" : String(val)),
    z
      .string()
      .optional()
      .or(z.literal(""))
      .refine(
        (val) => !val || /^[1-9][0-9]{5}$/.test(val.trim()),
        "Enter a valid 6-digit postal code"
      )
  ),

  latitude: optionalNumber(
    z
      .number()
      .min(-90, "Latitude must be between -90 and 90")
      .max(90, "Latitude must be between -90 and 90")
  ),

  longitude: optionalNumber(
    z
      .number()
      .min(-180, "Longitude must be between -180 and 180")
      .max(180, "Longitude must be between -180 and 180")
  ),

  google_map_url: z.preprocess(
    (val) => (val === null || val === undefined ? "" : String(val).trim()),
    z
      .string()
      .min(1, "Google Maps URL is required")
      .refine(
        (val) => /^https?:\/\/.+/i.test(val.trim()),
        "Enter a valid Map URL (e.g. https://maps.google.com/...)"
      )
  ),
});

export const defaultLocationValues = {
  address_line1: "",
  address_line2: "",
  landmark: "",
  village: "",
  taluka: "",
  district: "",
  city: "",
  state: "Maharashtra",
  country: "India",
  postal_code: "",
  latitude: "",
  longitude: "",
  google_map_url: "",
};

export const propertyContactSchema = z.object({
  contact_type_id: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? 1 : Number(val)),
    z.number().min(1, "Contact type is required")
  ),

  contact_name: z.preprocess(
    (val) => (val === null || val === undefined ? "" : String(val).trim()),
    z
      .string()
      .min(1, "Contact name is required")
      .min(2, "Contact name must be at least 2 characters")
  ),

  designation: optionalString(),

  mobile_number: z.preprocess(
    (val) => (val === null || val === undefined ? "" : String(val)),
    z
      .string()
      .optional()
      .or(z.literal(""))
      .refine(
        (val) => !val || /^[0-9+\-\s()]{7,15}$/.test(val.trim()),
        "Enter a valid phone number (7-15 digits)"
      )
  ),

  alternate_number: z.preprocess(
    (val) => (val === null || val === undefined ? "" : String(val)),
    z
      .string()
      .optional()
      .or(z.literal(""))
      .refine(
        (val) => !val || /^[0-9+\-\s()]{7,15}$/.test(val.trim()),
        "Enter a valid phone number (7-15 digits)"
      )
  ),

  whatsapp_number: z.preprocess(
    (val) => (val === null || val === undefined ? "" : String(val)),
    z
      .string()
      .optional()
      .or(z.literal(""))
      .refine(
        (val) => !val || /^[0-9+\-\s()]{7,15}$/.test(val.trim()),
        "Enter a valid phone number (7-15 digits)"
      )
  ),

  email: z.preprocess(
    (val) => (val === null || val === undefined ? "" : String(val)),
    z
      .string()
      .optional()
      .or(z.literal(""))
      .refine(
        (val) => !val || z.string().email().safeParse(val.trim()).success,
        "Enter a valid email address"
      )
  ),

  website: z.preprocess(
    (val) => (val === null || val === undefined ? "" : String(val)),
    z
      .string()
      .optional()
      .or(z.literal(""))
      .refine(
        (val) => !val || /^https?:\/\/.+/i.test(val.trim()),
        "Enter a valid website URL starting with http:// or https://"
      )
  ),

  is_primary: optionalBoolean(true),
});

export const defaultContactValues = {
  contact_type_id: 1,
  contact_name: "",
  designation: "",
  mobile_number: "",
  alternate_number: "",
  whatsapp_number: "",
  email: "",
  website: "",
  is_primary: true,
};

export const propertyPolicySchema = z.object({
  check_in_from: optionalString(),
  check_in_to: optionalString(),
  check_out_from: optionalString(),
  check_out_to: optionalString(),
  early_checkin_allowed: optionalBoolean(false),
  late_checkout_allowed: optionalBoolean(false),
  early_checkin_fee: optionalNumber(z.number().min(0)),
  late_checkout_fee: optionalNumber(z.number().min(0)),

  cancellation_policy: optionalString(),
  free_cancellation_hours: optionalNumber(z.number().min(0)),
  refund_policy: optionalString(),
  no_show_policy: optionalString(),

  id_proof_required: optionalBoolean(true),
  unmarried_couples_allowed: optionalBoolean(true),
  local_ids_allowed: optionalBoolean(true),
  foreign_guests_allowed: optionalBoolean(true),

  children_allowed: optionalBoolean(true),
  child_age_limit: optionalNumber(z.number().min(0)),
  child_policy: optionalString(),
  extra_bed_available: optionalBoolean(false),
  extra_bed_charge: optionalNumber(z.number().min(0)),

  pets_allowed: optionalBoolean(false),
  pet_policy: optionalString(),
  pet_charges: optionalNumber(z.number().min(0)),

  smoking_allowed: optionalBoolean(false),
  smoking_policy: optionalString(),
  alcohol_allowed: optionalBoolean(true),
  alcohol_policy: optionalString(),
  outside_food_allowed: optionalBoolean(true),
  outside_food_policy: optionalString(),
  visitors_allowed: optionalBoolean(true),
  visitor_policy: optionalString(),
  parties_allowed: optionalBoolean(false),
  party_policy: optionalString(),
  quiet_hours_start: optionalString(),
  quiet_hours_end: optionalString(),

  parking_available: optionalBoolean(true),
  parking_charges: optionalNumber(z.number().min(0)),
  security_deposit_required: optionalBoolean(false),
  security_deposit_amount: optionalNumber(z.number().min(0)),
});

export const defaultPolicyValues = {
  check_in_from: "12:00",
  check_in_to: "23:59",
  check_out_from: "00:00",
  check_out_to: "10:00",
  early_checkin_allowed: false,
  late_checkout_allowed: false,
  early_checkin_fee: 0,
  late_checkout_fee: 0,

  cancellation_policy: "Free cancellation up to 48 hours before check-in.",
  free_cancellation_hours: 48,
  refund_policy: "100% refund for cancellations made within free cancellation window.",
  no_show_policy: "100% booking charge for no-show guests.",

  id_proof_required: true,
  unmarried_couples_allowed: true,
  local_ids_allowed: true,
  foreign_guests_allowed: true,

  children_allowed: true,
  child_age_limit: 6,
  child_policy: "Children up to 6 years stay free without an extra bed.",
  extra_bed_available: false,
  extra_bed_charge: 0,

  pets_allowed: false,
  pet_policy: "",
  pet_charges: 0,

  smoking_allowed: false,
  smoking_policy: "Smoking is strictly prohibited inside the rooms.",
  alcohol_allowed: true,
  alcohol_policy: "Alcohol is allowed in private rooms only.",
  outside_food_allowed: true,
  outside_food_policy: "",
  visitors_allowed: true,
  visitor_policy: "",
  parties_allowed: false,
  party_policy: "No loud parties or events allowed after quiet hours.",
  quiet_hours_start: "22:00",
  quiet_hours_end: "06:00",

  parking_available: true,
  parking_charges: 0,
  security_deposit_required: false,
  security_deposit_amount: 0,
};