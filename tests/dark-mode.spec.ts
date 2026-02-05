import { test, expect } from "@playwright/test";

test.describe("Dark Mode", () => {
    test("dark mode toggle button exists", async ({ page }) => {
        await page.goto("/");

        // Check for theme toggle button (use first() to handle duplicates)
        const toggleButton = page.locator(".light-dark-toggle").first();
        await expect(toggleButton).toBeVisible();
    });

    test("clicking toggle switches theme", async ({ page }) => {
        await page.goto("/");

        // Click the dark mode toggle
        await page.locator(".light-dark-toggle").first().click();

        // Wait for the class change
        await page.waitForTimeout(300);

        // Verify the toggle worked by checking localStorage
        const theme = await page.evaluate(() => localStorage.getItem("theme"));
        expect(theme).toBeTruthy();
    });

    test("dark mode persists after navigation", async ({ page }) => {
        await page.goto("/");

        // Enable dark mode
        await page.locator(".light-dark-toggle").first().click();
        await page.waitForTimeout(300);

        // Navigate to another page
        await page.goto("/blog");

        // Check that dark mode is still active (via localStorage)
        const theme = await page.evaluate(() => localStorage.getItem("theme"));
        expect(theme).toBe("dark");
    });

    test("dark mode adds class to html element", async ({ page }) => {
        await page.goto("/");

        // Toggle to dark mode
        await page.locator(".light-dark-toggle").first().click();
        await page.waitForTimeout(300);

        // Check that html has dark class
        const html = page.locator("html");
        await expect(html).toHaveClass(/dark/);
    });

    test("can toggle back to light mode", async ({ page }) => {
        await page.goto("/");

        // Enable dark mode
        await page.locator(".light-dark-toggle").first().click();
        await page.waitForTimeout(300);

        // Verify dark mode
        let theme = await page.evaluate(() => localStorage.getItem("theme"));
        expect(theme).toBe("dark");

        // Toggle back to light mode
        await page.locator(".light-dark-toggle").first().click();
        await page.waitForTimeout(300);

        // Verify light mode
        theme = await page.evaluate(() => localStorage.getItem("theme"));
        expect(theme).toBe("light");
    });

    test("theme color buttons exist", async ({ page }) => {
        await page.goto("/");

        // Check for theme color buttons
        const themeButtons = page.locator(".theme-button");
        const count = await themeButtons.count();
        expect(count).toBeGreaterThan(0);
    });
});
