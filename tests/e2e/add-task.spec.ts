// Generated by Copilot
import { test, expect } from "@playwright/test";

test("Add a new task and verify it appears in the list", async ({ page }) => {
  // Go to the Task Manager app
  await page.goto("http://localhost:8080");

  // Ensure the page loaded
  await expect(page).toHaveTitle(/Task Manager/);

  // Fill in the new task input
  const taskInput = await page.waitForSelector('input[name="title"]');
  await taskInput.fill("Buy groceries");

  // Click the Add Task button
  await page.click('button[type="submit"]');

  // Wait for the page to reload and show the new task
  await page.waitForSelector('.task-title:has-text("Buy groceries")');

  // Assert the new task is visible in the list
  await expect(
    page.locator(".task-title", { hasText: "Buy groceries" })
  ).toBeVisible();

  // Take a screenshot for reference
  await page.screenshot({ path: "../test-results/add-task-results.png" });
});
