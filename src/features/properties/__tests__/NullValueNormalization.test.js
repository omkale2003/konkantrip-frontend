import { describe, it, expect } from "vitest";
import { propertyBasicDetailsSchema } from "../schemas/property.schema.js";

describe("NULL Value Normalization Tests", () => {
  it("normalizes backend NULL values into valid schema defaults without failing validation", () => {
    const backendPayloadWithNulls = {
      property_name: "Konkan Stay",
      property_type: "Homestay",
      star_rating: null,
      total_floors: null,
      built_year: null,
      renovated_year: null,
      instant_booking: null,
    };

    const parsed = propertyBasicDetailsSchema.safeParse(backendPayloadWithNulls);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.property_name).toBe("Konkan Stay");
      expect(parsed.data.instant_booking).toBe(true);
    }
  });
});
