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
