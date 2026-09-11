import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import WhatsAppSimulator from "../WhatsAppSimulator";

describe("WhatsAppSimulator Component Suite", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllTimers();
  });

  it("renders the simulator with hotel name and customer profile", () => {
    render(<WhatsAppSimulator />);

    // Hotel name visible
    expect(screen.getAllByText(/Konkan Beach Resort/i).length).toBeGreaterThan(0);

    // Location visible
    expect(screen.getAllByText(/Tarkarli, Maharashtra/i).length).toBeGreaterThan(0);

    // Customer name in sidebar
    expect(screen.getAllByText(/Rahul Patil/i).length).toBeGreaterThan(0);

    // Active room in context card
    expect(screen.getAllByText(/Deluxe Sea View/i).length).toBeGreaterThan(0);
  });

  it("renders quick enquiry preset actions", () => {
    render(<WhatsAppSimulator />);

    expect(screen.getByRole("button", { name: /Check Availability/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Ask Price/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Book Now/i })).toBeInTheDocument();
  });

  it("allows customer to type a message and enables the send button", () => {
    render(<WhatsAppSimulator />);

    const input = screen.getByPlaceholderText(/Type an enquiry as Rahul Patil/i);
    expect(input).toBeInTheDocument();

    const sendButton = screen.getByRole("button", { name: /Send message/i });
    expect(sendButton).toBeDisabled();

    fireEvent.change(input, { target: { value: "Is parking available for my car?" } });
    expect(sendButton).not.toBeDisabled();

    fireEvent.click(sendButton);

    // Message should now appear in both the chat thread and sidebar snippet
    expect(screen.getAllByText("Is parking available for my car?").length).toBeGreaterThanOrEqual(2);
  });

  it("opens the hotel info drawer when info button is clicked", () => {
    render(<WhatsAppSimulator />);

    const infoButton = screen.getByRole("button", { name: /View hotel information/i });
    fireEvent.click(infoButton);

    expect(screen.getByText(/Property Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Amenities & Services/i)).toBeInTheDocument();
  });

  it("toggles between customer view and hotel front desk view", () => {
    render(<WhatsAppSimulator />);

    const modeButton = screen.getByTitle(/Click to toggle between Customer View and Hotel Front Desk View/i);
    expect(modeButton).toHaveTextContent(/Customer View/i);

    fireEvent.click(modeButton);
    expect(modeButton).toHaveTextContent(/Hotel Front Desk/i);

    // Input placeholder should reflect hotel perspective
    expect(
      screen.getByPlaceholderText(/Type front desk response as Konkan Beach Resort/i)
    ).toBeInTheDocument();
  });
});
