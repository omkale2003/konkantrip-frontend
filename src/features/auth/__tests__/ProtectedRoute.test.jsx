import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import tokenService from "../../../services/token.service.js";
import { renderWithProviders } from "../../../test/testUtils.jsx";

describe("ProtectedRoute", () => {
  beforeEach(() => {
    tokenService.removeToken();
  });

  it("redirects unauthenticated user to /login", () => {
    tokenService.removeToken();

    renderWithProviders(
      <Routes>
        <Route path="/login" element={<div>Login Page Screen</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/protected" element={<div>Secret Dashboard</div>} />
        </Route>
      </Routes>,
      { route: "/protected" }
    );

    expect(screen.getByText("Login Page Screen")).toBeInTheDocument();
    expect(screen.queryByText("Secret Dashboard")).not.toBeInTheDocument();
  });

  it("renders protected outlet when user is authenticated with token", () => {
    tokenService.setToken("valid-token");

    renderWithProviders(
      <Routes>
        <Route path="/login" element={<div>Login Page Screen</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/protected" element={<div>Secret Dashboard</div>} />
        </Route>
      </Routes>,
      { route: "/protected" }
    );

    expect(screen.getByText("Secret Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Login Page Screen")).not.toBeInTheDocument();
  });
});
