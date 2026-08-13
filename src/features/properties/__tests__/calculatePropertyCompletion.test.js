import { describe, it, expect } from "vitest";
import { calculatePropertyCompletion } from "../utils/calculatePropertyCompletion.js";

describe("calculatePropertyCompletion", () => {
  it("calculates 0% completion for null data", () => {
    const result = calculatePropertyCompletion({});
    expect(result.percentage).toBe(0);
    expect(result.completedSections).toHaveLength(0);
    expect(result.incompleteSections).toHaveLength(8); // 8 sections total
    expect(result.nextIncompleteSection.key).toBe("basic");
  });

  it("calculates completion for basic details only (15%)", () => {
    const result = calculatePropertyCompletion({
      property: { property_name: "Test Hotel", property_type: "Hotel" },
    });
    expect(result.percentage).toBe(15);
    expect(result.completedSections).toHaveLength(1);
    expect(result.completedSections[0].key).toBe("basic");
    expect(result.nextIncompleteSection.key).toBe("location");
  });

  it("calculates completion for basic and location (30%)", () => {
    const result = calculatePropertyCompletion({
      property: { property_name: "Test Hotel", property_type: "Hotel" },
      location: { address_line1: "123 Main St" },
    });
    expect(result.percentage).toBe(30);
    expect(result.completedSections).toHaveLength(2);
    expect(result.nextIncompleteSection.key).toBe("contact");
  });

  it("calculates completion for 100% completed property", () => {
    const result = calculatePropertyCompletion({
      property: { property_name: "Test Hotel", property_type: "Hotel" },
      location: { address_line1: "123 Main St" },
      contacts: [{ contact_name: "John Doe" }],
      amenities: [{ amenity_id: 1 }],
      rooms: [{ room_id: 1 }],
      images: [{ image_id: 1, is_cover_image: true }],
      policies: { policy_id: 1 },
      documents: [{ document_id: 1 }],
    });
    
    expect(result.percentage).toBe(100);
    expect(result.completedSections).toHaveLength(8);
    expect(result.incompleteSections).toHaveLength(0);
    expect(result.nextIncompleteSection).toBeNull();
  });

  it("handles missing arrays correctly", () => {
    const result = calculatePropertyCompletion({
      property: { property_name: "Test Hotel", property_type: "Hotel" },
      location: null,
      contacts: [],
      amenities: undefined,
      rooms: [],
      images: [{ is_cover_image: false }], // Images exist, but no cover image
      policies: {},
      documents: null,
    });
    
    expect(result.percentage).toBe(15); // Only Basic Details
  });

  it("identifies correct next step when random sections are missing", () => {
    const result = calculatePropertyCompletion({
      property: { property_name: "Test Hotel", property_type: "Hotel" },
      location: { address_line1: "123 Main St" },
      // Contact missing
      amenities: [{ amenity_id: 1 }],
    });
    
    expect(result.nextIncompleteSection.key).toBe("contact");
  });
});
