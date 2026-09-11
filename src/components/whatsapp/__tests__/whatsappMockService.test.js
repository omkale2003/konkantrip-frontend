import { describe, it, expect } from "vitest";
import {
  getAutomaticReply,
  getScenarioMessages,
  formatMessageTime
} from "../../../services/whatsappMockService";
import { DEMO_PROPERTY, DEMO_ROOM } from "../../../data/whatsappDemoData";

describe("WhatsApp Mock Service Engine", () => {
  it("formats time string correctly", () => {
    const time = formatMessageTime(new Date(2026, 8, 20, 10, 30));
    expect(time).toMatch(/10:30\s*(AM|am)/);
  });

  it("returns availability response for availability enquiries", () => {
    const reply = getAutomaticReply("Is the Deluxe Sea View room available?");
    expect(reply.text).toContain("currently available");
  });

  it("returns price response for tariff enquiries", () => {
    const reply = getAutomaticReply("What is the price for 2 nights?");
    expect(reply.text).toContain("₹4,500");
    expect(reply.text).toContain("breakfast");
  });

  it("returns booking CTA response for book now enquiries", () => {
    const reply = getAutomaticReply("I would like to book this room now");
    expect(reply.isBookingCTA).toBe(true);
    expect(reply.text).toContain("booking confirmation");
  });

  it("returns breakfast response for breakfast enquiries", () => {
    const reply = getAutomaticReply("Does the room include breakfast?");
    expect(reply.text).toContain("complimentary");
    expect(reply.text).toContain("breakfast");
  });

  it("returns parking response for parking enquiries", () => {
    const reply = getAutomaticReply("Is car parking available?");
    expect(reply.text).toContain("parking");
    expect(reply.text).toContain("CCTV");
  });

  it("returns couples welcome policy for couple enquiries", () => {
    const reply = getAutomaticReply("Do you allow couples?");
    expect(reply.text).toContain("couples are welcome");
    expect(reply.text).toContain("ID");
  });

  it("returns beach distance for beach location enquiries", () => {
    const reply = getAutomaticReply("How far is the beach?");
    expect(reply.text).toContain("500 metres");
  });

  it("loads predefined messages for scenarios", () => {
    const messages = getScenarioMessages("scenario_availability");
    expect(messages.length).toBeGreaterThanOrEqual(2);
    expect(messages[0].sender).toBe("customer");
  });
});
