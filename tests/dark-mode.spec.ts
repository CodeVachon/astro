import { test, expect } from "@playwright/test";

test.describe("Dark Mode", () => {
    test("dark mode toggle button exists", async ({ page }) => {
        await page.goto("/");

        // Check for theme toggle button (use first() to handle duplicates)
        const toggleButton = page.locator(".mode-toggle").first();
        await expect(toggleButton).toBeVisible();
    });

    test("clicking toggle switches theme", async ({ page }) => {
        await page.goto("/");

        // Wait for page to load and script to run
        await page.waitForLoadState("networkidle");

        // Get initial theme
        const initialTheme = await page.evaluate(() => localStorage.getItem("theme"));

        // Click the dark mode toggle
        await page.locator(".mode-toggle").first().click();

        // Wait for the class change
        await page.waitForTimeout(300);

        // Verify the toggle worked by checking localStorage changed
        const newTheme = await page.evaluate(() => localStorage.getItem("theme"));
        expect(newTheme).toBeTruthy();
        expect(newTheme).not.toBe(initialTheme);
    });

    test("theme persists after navigation", async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");

        // Get initial theme
        const initialTheme = await page.evaluate(() => localStorage.getItem("theme"));

        // Toggle the mode
        await page.locator(".mode-toggle").first().click();
        await page.waitForTimeout(300);

        // Get the new theme
        const toggledTheme = await page.evaluate(() => localStorage.getItem("theme"));
        expect(toggledTheme).not.toBe(initialTheme);

        // Navigate to another page
        await page.goto("/blog");
        await page.waitForLoadState("networkidle");

        // Check that the theme is still the toggled value
        const persistedTheme = await page.evaluate(() => localStorage.getItem("theme"));
        expect(persistedTheme).toBe(toggledTheme);
    });

    test("html class matches theme state", async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");

        // Get the current theme
        const theme = await page.evaluate(() => localStorage.getItem("theme"));

        // Check that html class matches
        const html = page.locator("html");
        if (theme === "dark") {
            await expect(html).toHaveClass(/dark/);
        } else {
            // In light mode, dark class should not be present
            const classes = await html.getAttribute("class");
            expect(classes).not.toContain("dark");
        }
    });

    test("can toggle between modes", async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");

        // Get initial state
        let theme = await page.evaluate(() => localStorage.getItem("theme"));
        const initialTheme = theme;

        // Toggle
        await page.locator(".mode-toggle").first().click();
        await page.waitForTimeout(300);

        // Verify toggled
        theme = await page.evaluate(() => localStorage.getItem("theme"));
        expect(theme).not.toBe(initialTheme);

        // Toggle back
        await page.locator(".mode-toggle").first().click();
        await page.waitForTimeout(300);

        // Verify back to initial
        theme = await page.evaluate(() => localStorage.getItem("theme"));
        expect(theme).toBe(initialTheme);
    });

    test("theme color buttons exist", async ({ page }) => {
        await page.goto("/");

        // Check for theme color buttons
        const themeButtons = page.locator(".theme-button");
        const count = await themeButtons.count();
        // Should have 4 theme buttons (Cool Cyber, Synthwave, Matrix, Amber Terminal)
        expect(count).toBeGreaterThanOrEqual(4);
    });

    test("clicking theme button changes theme color", async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");

        // Click the second theme button (Synthwave)
        await page.locator(".theme-button").nth(1).click();
        await page.waitForTimeout(300);

        // Verify the theme was set in localStorage
        const themeColor = await page.evaluate(() => localStorage.getItem("theme-color"));
        expect(themeColor).toBe("synthwave");

        // Verify the data-theme attribute was set
        const dataTheme = await page.evaluate(() =>
            document.documentElement.getAttribute("data-theme")
        );
        expect(dataTheme).toBe("synthwave");
    });
});
