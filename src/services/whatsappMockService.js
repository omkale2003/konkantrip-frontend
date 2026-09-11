/**
 * WhatsApp Local Mock Response Engine
 * 
 * Simulates intelligent hotel front desk responses using local keyword heuristics.
 * DOES NOT CALL ANY EXTERNAL MESSAGING APIS (Meta Cloud, WATI, Twilio, etc.).
 * Designed so that it can be cleanly swapped for a real provider in future phases.
 */

import { DEMO_SCENARIOS, DEMO_PROPERTY, DEMO_ROOM, DEFAULT_BOOKING_ENQUIRY } from "../data/whatsappDemoData";

/**
 * Format current timestamp in WhatsApp standard format (e.g., "11:42 AM")
 */
export const formatMessageTime = (date = new Date()) => {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "numeric",
    hour12: true
  }).format(date);
};

/**
 * Generates an automatic hotel reply based on message keywords and context.
 * 
 * @param {string} rawMessage - Customer's query text
 * @param {object} context - Context containing hotel, room, and booking enquiry details
 * @returns {{ text: string, isBookingCTA?: boolean }}
 */
export const getAutomaticReply = (rawMessage = "", context = {}) => {
  const text = rawMessage.toLowerCase().trim();
  const propertyName = context.property?.name || DEMO_PROPERTY.name;
  const roomName = context.room?.name || DEMO_ROOM.name;
  const price = context.room?.pricePerNight || DEMO_ROOM.pricePerNight;
  const dates = context.bookingEnquiry?.formattedDates || DEFAULT_BOOKING_ENQUIRY.formattedDates;

  // 1. Booking Action / Intent
  if (
    text.includes("book now") ||
    text.includes("book this") ||
    text.includes("reserve") ||
    text.includes("confirm booking") ||
    text.includes("want to book") ||
    text.includes("like to book")
  ) {
    return {
      text: `Thank you! Your booking enquiry has been received for ${propertyName}. Please continue to booking confirmation.`,
      isBookingCTA: true
    };
  }

  // 2. Price / Tariff / Cost Keywords
  if (
    text.includes("price") ||
    text.includes("rate") ||
    text.includes("cost") ||
    text.includes("tariff") ||
    text.includes("how much") ||
    text.includes("charges")
  ) {
    return {
      text: `The current tariff for the ${roomName} is ₹${price.toLocaleString("en-IN")} per night, subject to availability. For 2 nights, total room cost is ₹${(price * 2).toLocaleString("en-IN")} plus taxes, inclusive of complimentary breakfast.`
    };
  }

  // 3. Breakfast / Meals Keywords
  if (
    text.includes("breakfast") ||
    text.includes("food") ||
    text.includes("meal") ||
    text.includes("dinner") ||
    text.includes("lunch") ||
    text.includes("restaurant") ||
    text.includes("malvani")
  ) {
    return {
      text: `Yes. The ${roomName} rate currently includes complimentary daily breakfast for 2 guests. Our in-house restaurant also serves authentic freshly caught Malvani Surmai & Pomfret thalis!`
    };
  }

  // 4. Parking Keywords
  if (
    text.includes("parking") ||
    text.includes("car") ||
    text.includes("vehicle") ||
    text.includes("park")
  ) {
    return {
      text: `Yes, complimentary on-site private parking with round-the-clock CCTV surveillance is available for all hotel guests.`
    };
  }

  // 5. Early Check-in / Timings
  if (
    text.includes("early check") ||
    text.includes("timing") ||
    (text.includes("check-in") && !text.includes("available")) ||
    text.includes("checkin") ||
    text.includes("checkout")
  ) {
    return {
      text: `Our standard check-in is 12:00 PM and check-out is 10:00 AM. Early check-in is subject to availability on the day of arrival. Please contact the front desk before arrival so we can prioritize your room preparation.`
    };
  }

  // 6. Couples / Unmarried Couples Policy
  if (
    text.includes("couple") ||
    text.includes("unmarried") ||
    text.includes("bachelor")
  ) {
    return {
      text: `Yes, couples are welcome at ${propertyName}, subject to presenting valid government-issued photo identification (Aadhaar, Passport, or Voter ID) at check-in.`
    };
  }

  // 7. Swimming Pool Keywords
  if (
    text.includes("pool") ||
    text.includes("swimming")
  ) {
    return {
      text: `Yes, we have an outdoor swimming pool surrounded by coconut trees, accessible for all resident guests from 7:00 AM to 8:00 PM daily.`
    };
  }

  // 8. Beach Distance / Location / Sightseeing
  if (
    text.includes("beach") ||
    text.includes("distance") ||
    text.includes("how far") ||
    text.includes("scuba") ||
    text.includes("watersport") ||
    (text.includes("sea") && !text.includes("sea view"))
  ) {
    return {
      text: `The nearest beach access is approximately 500 metres from the property (about a 5-minute leisurely stroll through coconut palms). Tarkarli Scuba diving and water sports points are just 1.5 km away!`
    };
  }

  // 9. Location / Address / Directions
  if (
    text.includes("location") ||
    text.includes("address") ||
    text.includes("where") ||
    text.includes("direction") ||
    text.includes("reach") ||
    text.includes("station")
  ) {
    return {
      text: `${propertyName} is situated on Wairy Bhutnath Beach Road in Tarkarli, Malvan. The nearest railway stations are Kudal (32 km) and Sindhudurg (30 km). Auto-rickshaws and cabs are readily available.`
    };
  }

  // 10. Photos / Pictures / Video
  if (
    text.includes("photo") ||
    text.includes("picture") ||
    text.includes("image") ||
    text.includes("gallery") ||
    text.includes("look like")
  ) {
    return {
      text: `You can view our verified room and property photos in the "Hotel Info" drawer by clicking the ℹ️ icon in the chat header, or on the KonkanTrip official property page.`
    };
  }

  // 11. Facilities / Amenities
  if (
    text.includes("facility") ||
    text.includes("facilities") ||
    text.includes("amenity") ||
    text.includes("amenities") ||
    text.includes("wifi") ||
    text.includes("ac")
  ) {
    return {
      text: `The ${roomName} features: King Bed, Air Conditioning, High-speed Wi-Fi, Private Balcony with Sea View, En-suite Bathroom with 24/7 hot water, LED TV, and 100% generator power backup.`
    };
  }

  // 12. Cancellation / Refund / Modification
  if (
    text.includes("cancel") ||
    text.includes("cancellation") ||
    text.includes("refund") ||
    text.includes("reschedule")
  ) {
    return {
      text: `We offer 100% free cancellation up to 48 hours prior to check-in date. Full refund is processed back to the original source. Date modifications are also accommodated subject to seasonal tariff differences.`
    };
  }

  // 13. Generic Room Availability (checked after specific amenities)
  if (
    text.includes("available") ||
    text.includes("availability") ||
    text.includes("vacancy") ||
    text.includes("rooms left") ||
    text.includes("dates open")
  ) {
    return {
      text: `Yes, the ${roomName} room is currently available for ${dates} for 2 adults. Would you like us to hold the room or proceed with the booking?`
    };
  }

  // Default Fallback
  return {
    text: `Thank you for your enquiry. Our front desk team at ${propertyName} will assist you shortly. You can also tap any of the quick options above for instant information.`
  };
};

/**
 * Simulates hotel typing and delivers response after delay.
 * 
 * @param {string} customerMessage - Text sent by customer
 * @param {object} context - Hotel and enquiry context
 * @param {function} onReply - Callback receiving { text, isBookingCTA }
 * @param {number} delayMs - Simulated typing delay in milliseconds
 * @returns {number} timeoutId for cancellation
 */
export const simulateHotelReply = (
  customerMessage,
  context,
  onReply,
  delayMs = 1100
) => {
  return setTimeout(() => {
    const reply = getAutomaticReply(customerMessage, context);
    onReply(reply);
  }, delayMs);
};

/**
 * Returns deep-cloned initial messages for a given scenario ID.
 * 
 * @param {string} scenarioId 
 * @returns {Array} Array of message objects
 */
export const getScenarioMessages = (scenarioId) => {
  const scenario = DEMO_SCENARIOS.find((s) => s.id === scenarioId) || DEMO_SCENARIOS[0];
  return JSON.parse(JSON.stringify(scenario.initialMessages));
};
