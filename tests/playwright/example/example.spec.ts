import { test, expect } from "@playwright/test";

const baseURL = "http://localhost:3000"; // Replace with your application's base URL
test.describe("Login flow", () => {
  test("valid credentials logs the user in", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("user@example.com");
    await page.getByLabel("Password").fill("correct-password");
    await page.getByRole("button", { name: "Log in" }).click();

    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByText("Welcome back")).toBeVisible();
  });

  test("invalid password shows an error and does not log in", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("user@example.com");
    await page.getByLabel("Password").fill("wrong-password");
    await page.getByRole("button", { name: "Log in" }).click();

    await expect(page.getByRole("alert")).toContainText("Invalid email or password");
    await expect(page).toHaveURL("/login");
  });

  test("account locks after 5 failed attempts", async ({ page }) => {
    await page.goto("/login");

    for (let i = 0; i < 5; i++) {
      await page.getByLabel("Email").fill("user@example.com");
      await page.getByLabel("Password").fill("wrong-password");
      await page.getByRole("button", { name: "Log in" }).click();
    }

    await expect(page.getByRole("alert")).toContainText("Account temporarily locked");

    // Bonus: verify even a correct password is rejected while locked
    await page.getByLabel("Email").fill("user@example.com");
    await page.getByLabel("Password").fill("correct-password");
    await page.getByRole("button", { name: "Log in" }).click();
    await expect(page.getByRole("alert")).toContainText("Account temporarily locked");
  });
});
