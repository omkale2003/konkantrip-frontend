import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import AuditTrailTab from "../components/AuditTrailTab.jsx";
import EmployeeSessionsModal from "../components/EmployeeSessionsModal.jsx";
import auditApi from "../api/audit.api.js";
import sessionsApi from "../api/sessions.api.js";

vi.mock("../api/audit.api.js");
vi.mock("../api/sessions.api.js");

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

function renderWithProviders(ui) {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
}

describe("Audit Trail & Session Management Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders audit trail logs and opens diff inspector modal", async () => {
    const mockLogs = [
      {
        audit_id: 101,
        created_at: new Date().toISOString(),
        user_name: "Rahul Sawant",
        user_role: "Property Manager",
        module: "Rooms",
        action: "UPDATE",
        record_name: "Deluxe Suite",
        description: "Updated room base_price",
        ip_address: "192.168.1.10",
        changes_diff: {
          base_price: { from: 2000, to: 2500 },
        },
      },
    ];

    auditApi.getAuditLogs.mockResolvedValue({
      success: true,
      total: 1,
      page: 1,
      limit: 25,
      totalPages: 1,
      data: mockLogs,
    });

    renderWithProviders(<AuditTrailTab properties={[]} employees={[]} />);

    expect(screen.getByText(/Enterprise Audit Trail & Change Governance/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Rahul Sawant")).toBeInTheDocument();
      expect(screen.getByText("Updated room base_price")).toBeInTheDocument();
    });

    // Click "View Diff"
    const viewDiffBtn = screen.getByRole("button", { name: /View Diff/i });
    fireEvent.click(viewDiffBtn);

    expect(screen.getByText(/Audit Change Diff Inspector #101/i)).toBeInTheDocument();
    expect(screen.getByText("base_price")).toBeInTheDocument();
    expect(screen.getByText("2000")).toBeInTheDocument();
    expect(screen.getByText("2500")).toBeInTheDocument();
  });

  it("renders employee active sessions and handles revoke session", async () => {
    const mockSessions = [
      {
        session_id: 5,
        employee_id: 1,
        browser: "Chrome",
        os: "Windows",
        device_type: "Desktop",
        ip_address: "10.0.0.1",
        login_at: new Date().toISOString(),
        is_active: 1,
      },
    ];

    sessionsApi.getEmployeeSessions.mockResolvedValue({
      success: true,
      data: mockSessions,
    });
    sessionsApi.revokeSession.mockResolvedValue({
      success: true,
      message: "Session terminated successfully",
    });

    vi.spyOn(window, "confirm").mockReturnValue(true);

    renderWithProviders(
      <EmployeeSessionsModal
        isOpen={true}
        onClose={vi.fn()}
        employee={{ employee_id: 1, first_name: "Rahul", last_name: "Sawant", email: "rahul@example.com" }}
      />
    );

    expect(screen.getByText("Active Login Sessions")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Chrome on Windows/i)).toBeInTheDocument();
      expect(screen.getByText("10.0.0.1")).toBeInTheDocument();
    });

    const revokeBtn = screen.getByRole("button", { name: /Revoke/i });
    fireEvent.click(revokeBtn);

    await waitFor(() => {
      expect(sessionsApi.revokeSession).toHaveBeenCalledWith(5);
    });
  });
});
