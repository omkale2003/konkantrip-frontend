import { describe, it, expect } from "vitest";
import { propertyBasicDetailsSchema } from "../schemas/property.schema.js";

describe("propertyBasicDetailsSchema validation", () => {
  it("validates required fields successfully", () => {
    const validData = {
      property_name: "Konkan Palace",
      property_type: "Hotel",
      category: "Luxury",
      description: "Beautiful beachfront luxury stay.",
    };

    const result = propertyBasicDetailsSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("fails when property_name is empty or missing", () => {
    const invalidData = {
      property_name: "",
      property_type: "Hotel",
    };

    const result = propertyBasicDetailsSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/property name is required/i);
    }
  });

  it("fails when property_type is invalid", () => {
    const invalidData = {
      property_name: "Konkan Villa",
      property_type: "Spaceship",
    };

    const result = propertyBasicDetailsSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("handles empty/null optional numeric fields without failing", () => {
    const dataWithNulls = {
      property_name: "Beach Villa",
      property_type: "Villa",
      total_floors: null,
      built_year: "",
      renovated_year: undefined,
    };

    const result = propertyBasicDetailsSchema.safeParse(dataWithNulls);
    expect(result.success).toBe(true);
  });
});

describe("propertyLocationSchema Google Maps validation", () => {
  const { propertyLocationSchema } = require("../schemas/property.schema.js");

  it("accepts valid Google Maps URLs across desktop, shortlink, and app formats", () => {
    const validUrls = [
      "https://maps.google.com/?q=123+Beach+Road",
      "https://www.google.com/maps/place/Goa/@15.2993,74.124,11z",
      "https://goo.gl/maps/abc123xyz",
      "https://maps.app.goo.gl/xyz789abc",
      "https://www.google.co.in/maps/search/Hotels+in+Konkan",
    ];

    validUrls.forEach((url) => {
      const res = propertyLocationSchema.safeParse({
        address_line1: "123 Coastal Road",
        city: "Alibaug",
        state: "Maharashtra",
        country: "India",
        postal_code: "402201",
        google_map_url: url,
      });
      expect(res.success).toBe(true);
    });
  });

  it("rejects non-Google Maps URLs or invalid URLs", () => {
    const invalidUrls = [
      "https://facebook.com/myhotel",
      "https://randomwebsite.com/maps",
      "https://notgoogle.com/maps/place",
      "ftp://maps.google.com",
      "just text",
    ];

    invalidUrls.forEach((url) => {
      const res = propertyLocationSchema.safeParse({
        address_line1: "123 Coastal Road",
        city: "Alibaug",
        state: "Maharashtra",
        country: "India",
        postal_code: "402201",
        google_map_url: url,
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].message).toMatch(/valid Google Maps URL/i);
      }
    });
  });
});
