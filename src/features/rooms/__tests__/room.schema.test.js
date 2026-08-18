import { describe, it, expect } from "vitest";
import {
  roomBasicDetailsSchema,
  roomCapacitySchema,
  roomBedSchema,
  roomFacilitySchema,
  roomAmenitySchema,
  roomQuickFormSchema,
  defaultRoomBasicDetailsValues,
  defaultRoomCapacityValues,
  defaultRoomBedValues,
  defaultRoomFacilityValues,
  defaultRoomAmenityValues,
  defaultRoomQuickFormValues,
} from "../schemas/room.schema.js";

describe("Room Schemas Validation", () => {
  describe("roomBasicDetailsSchema", () => {
    it("validates valid room basic details", () => {
      const validData = {
        property_id: "1",
        room_name: "Deluxe Ocean View",
        room_code: "DOC-101",
        price: 2500,
        room_type_id: "1",
        room_status_id: "1",
        room_view_id: "2",
        description: "Spacious deluxe room facing the sea.",
        sort_order: 1,
        is_bookable: true,
        is_published: true,
      };
      const result = roomBasicDetailsSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("fails when required fields are missing", () => {
      const invalidData = {
        property_id: "",
        room_name: "",
        room_code: "",
        room_type_id: "",
        room_status_id: "",
      };
      const result = roomBasicDetailsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const paths = result.error.issues.map((e) => e.path[0]);
        expect(paths).toContain("property_id");
        expect(paths).toContain("room_name");
        expect(paths).toContain("room_code");
      }
    });

    it("provides default values matching expected structure", () => {
      expect(defaultRoomBasicDetailsValues).toHaveProperty("room_name", "");
      expect(defaultRoomBasicDetailsValues).toHaveProperty("room_code", "");
      expect(defaultRoomBasicDetailsValues).toHaveProperty("is_bookable", true);
    });
  });

  describe("roomCapacitySchema", () => {
    it("validates valid capacity settings", () => {
      const validData = {
        maximum_guests: 4,
        maximum_adults: 3,
        maximum_children: 1,
        base_occupancy: 2,
        extra_bed_allowed: 1,
        extra_bed_price: 500,
        extra_bed_count: 1,
        floor_number: "2",
        is_bookable: true,
        is_published: true,
        is_active: true,
        sort_order: 1,
        smoking_allowed: 0,
        pets_allowed: 0,
      };
      const result = roomCapacitySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("fails when maximum_guests is less than 1", () => {
      const invalidData = {
        maximum_guests: 0,
        maximum_adults: 2,
        base_occupancy: 2,
      };
      const result = roomCapacitySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("has valid default capacity values", () => {
      expect(defaultRoomCapacityValues.maximum_guests).toBe(2);
      expect(defaultRoomCapacityValues.base_occupancy).toBe(2);
    });
  });

  describe("roomBedSchema", () => {
    it("validates valid bed configuration", () => {
      const validData = {
        bed_type_id: "1",
        quantity: 2,
        bed_position: "Primary",
        is_default: true,
        is_extra_bed: false,
        additional_charge: 0,
        is_active: true,
        remarks: "King size bed",
      };
      const result = roomBedSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("fails when bed_type_id is empty", () => {
      const invalidData = {
        bed_type_id: "",
        quantity: 1,
      };
      const result = roomBedSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("fails when bed_position is not in allowed list", () => {
      const invalidData = {
        bed_type_id: "1",
        quantity: 1,
        bed_position: "InvalidPosition",
      };
      const result = roomBedSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("roomFacilitySchema", () => {
    it("validates valid room facility", () => {
      const validData = {
        room_facility_id: "1",
        facility_value: "AC available",
        is_available: true,
        is_complimentary: true,
        additional_charge: 0,
      };
      const result = roomFacilitySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("fails when room_facility_id is missing", () => {
      const invalidData = {
        room_facility_id: "",
      };
      const result = roomFacilitySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("roomAmenitySchema", () => {
    it("validates valid room amenity", () => {
      const validData = {
        amenity_id: "1",
        is_available: true,
        is_complimentary: true,
        additional_charge: 0,
        quantity: 1,
        remarks: "Complimentary dental kit",
      };
      const result = roomAmenitySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("fails when amenity_id is missing", () => {
      const invalidData = {
        amenity_id: "",
      };
      const result = roomAmenitySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("roomQuickFormSchema", () => {
    it("validates quick room creation form", () => {
      const validData = {
        room_name: "Standard Double Room",
        room_code: "SDR-101",
        price: 1500,
        room_type_id: "1",
        room_status_id: "1",
        base_occupancy: 2,
        maximum_guests: 3,
        is_bookable: true,
        is_published: true,
      };
      const result = roomQuickFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("fails when maximum_guests is less than base_occupancy", () => {
      const invalidData = {
        room_name: "Standard Double Room",
        room_code: "SDR-101",
        price: 1500,
        room_type_id: "1",
        room_status_id: "1",
        base_occupancy: 3,
        maximum_guests: 2,
        is_bookable: true,
        is_published: true,
      };
      const result = roomQuickFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
