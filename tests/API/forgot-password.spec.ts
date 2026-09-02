import { describe, it, expect } from "vitest";

describe("Forgot Password API", () => {
  it("should send a password reset email for a valid email", async () => {
    const response = await fetch("http://localhost:3000/api/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: "user@example.com" }),
    });
    expect(response.status).toBe(200);
  });
});
