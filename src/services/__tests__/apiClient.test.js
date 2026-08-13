import { describe, it, expect, beforeEach, afterEach } from "vitest";
import apiClient from "../apiClient.js";
import tokenService from "../token.service.js";

describe("apiClient", () => {
  beforeEach(() => {
    tokenService.removeToken();
  });

  afterEach(() => {
    tokenService.removeToken();
  });

  it("configures correct baseURL and Content-Type header", () => {
    expect(apiClient.defaults.headers["Content-Type"]).toBe("application/json");
  });

  it("attaches Bearer token in Authorization header when token exists", async () => {
    tokenService.setToken("test-jwt-token");
    
    const requestInterceptor = apiClient.interceptors.request.handlers[0];
    const mockConfig = { headers: {} };
    const result = await requestInterceptor.fulfilled(mockConfig);

    expect(result.headers.Authorization).toBe("Bearer test-jwt-token");
  });

  it("does not attach Authorization header when token does not exist", async () => {
    tokenService.removeToken();

    const requestInterceptor = apiClient.interceptors.request.handlers[0];
    const mockConfig = { headers: {} };
    const result = await requestInterceptor.fulfilled(mockConfig);

    expect(result.headers.Authorization).toBeUndefined();
  });
});
