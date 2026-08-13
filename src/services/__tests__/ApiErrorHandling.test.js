import { describe, it, expect } from "vitest";

function getFriendlyErrorMessage(error, defaultMessage) {
  if (!error) return "";
  const status = error?.response?.status;
  if (status === 401) return "Your session has expired. Please login again.";
  if (status === 403) return "You do not have permission to submit this property.";
  if (status === 404) return "Property not found.";
  if (status === 409) return "Your property cannot be submitted in its current state.";
  if (status === 400 || status === 422) {
    const backendMsg = error?.response?.data?.message;
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors) && errors.length > 0) {
      const detail = errors.map((e) => (typeof e === "string" ? e : e.message)).join(", ");
      return `${backendMsg || "Validation failed"}: ${detail}`;
    }
    return backendMsg || "Validation failed. Please check your entries.";
  }
  return defaultMessage || "Unable to save property details. Please try again.";
}

describe("API Error Handling Utilities", () => {
  it("formats 401 status error to session expired message", () => {
    const err = { response: { status: 401 } };
    expect(getFriendlyErrorMessage(err, "Default")).toBe("Your session has expired. Please login again.");
  });

  it("formats 403 status error to permission denied message", () => {
    const err = { response: { status: 403 } };
    expect(getFriendlyErrorMessage(err, "Default")).toBe("You do not have permission to submit this property.");
  });

  it("formats 404 status error to property not found message", () => {
    const err = { response: { status: 404 } };
    expect(getFriendlyErrorMessage(err, "Default")).toBe("Property not found.");
  });

  it("formats 409 status error to conflict message", () => {
    const err = { response: { status: 409 } };
    expect(getFriendlyErrorMessage(err, "Default")).toBe("Your property cannot be submitted in its current state.");
  });

  it("formats 500 status error to fallback default message", () => {
    const err = { response: { status: 500 } };
    expect(getFriendlyErrorMessage(err, "Server failure")).toBe("Server failure");
  });
});
