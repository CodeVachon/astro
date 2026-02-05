import { test, expect } from "@playwright/test";

test.describe("Search Component", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");
    });

    test("search input is accessible via Cmd+K shortcut", async ({ page }) => {
        // Use keyboard shortcut to open search
        await page.keyboard.press("Meta+k");
        await page.waitForTimeout(300);

        // Check that the search input is visible and focused
        const searchInput = page.locator("#BlogSearch");
        await expect(searchInput).toBeVisible();
    });

    test("search input is accessible via menu toggle on mobile", async ({ page }) => {
        // Set mobile viewport since menu toggle is hidden on desktop
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto("/");
        await page.waitForLoadState("networkidle");

        // Click the menu toggle button
        await page.locator("#menu-open-toggle").click();
        await page.waitForTimeout(300);

        // Check that the search input is visible
        const searchInput = page.locator("#BlogSearch");
        await expect(searchInput).toBeVisible();
    });

    test("search input has correct attributes", async ({ page }) => {
        await page.keyboard.press("Meta+k");
        await page.waitForTimeout(300);

        const searchInput = page.locator("#BlogSearch");

        // Verify search input attributes for accessibility
        await expect(searchInput).toHaveAttribute("type", "search");
        await expect(searchInput).toHaveAttribute("placeholder", "Search Blog Posts...");
        await expect(searchInput).toHaveAttribute("autocomplete", "off");
    });

    test("typing in search shows results", async ({ page }) => {
        await page.keyboard.press("Meta+k");
        await page.waitForTimeout(300);

        const searchInput = page.locator("#BlogSearch");

        // Type a search term that should match blog posts
        await searchInput.fill("react");
        await page.waitForTimeout(500);

        // Check that results appear
        const resultsList = page.locator("#BlogSearchResult");
        await expect(resultsList).toBeVisible();

        // Verify there are result items
        const resultItems = resultsList.locator("li");
        const count = await resultItems.count();
        expect(count).toBeGreaterThan(0);
    });

    test("search results contain post information", async ({ page }) => {
        await page.keyboard.press("Meta+k");
        await page.waitForTimeout(300);

        const searchInput = page.locator("#BlogSearch");
        await searchInput.fill("javascript");
        await page.waitForTimeout(500);

        // Check first result has expected structure
        const firstResult = page.locator("#BlogSearchResult li").first();
        await expect(firstResult).toBeVisible();

        // Result should have a link
        const link = firstResult.locator("a");
        await expect(link).toHaveAttribute("href", /\/blog\//);

        // Result should display title
        const title = firstResult.locator("p.text-primary");
        await expect(title).toBeVisible();
    });

    test("empty search shows no results", async ({ page }) => {
        await page.keyboard.press("Meta+k");
        await page.waitForTimeout(300);

        const searchInput = page.locator("#BlogSearch");

        // Ensure input is empty
        await searchInput.fill("");
        await page.waitForTimeout(300);

        // Results list should not be visible
        const resultsList = page.locator("#BlogSearchResult");
        await expect(resultsList).not.toBeVisible();
    });

    test("no matching results shows empty list", async ({ page }) => {
        await page.keyboard.press("Meta+k");
        await page.waitForTimeout(300);

        const searchInput = page.locator("#BlogSearch");

        // Type a search term that shouldn't match anything
        await searchInput.fill("xyznonexistent12345");
        await page.waitForTimeout(500);

        // Results list should appear but be empty
        const resultItems = page.locator("#BlogSearchResult li");
        const count = await resultItems.count();
        expect(count).toBe(0);
    });

    test("keyboard navigation with arrow keys", async ({ page }) => {
        await page.keyboard.press("Meta+k");
        await page.waitForTimeout(300);

        const searchInput = page.locator("#BlogSearch");
        await searchInput.fill("react");
        await page.waitForTimeout(500);

        // Press down arrow to select first result
        await searchInput.press("ArrowDown");
        await page.waitForTimeout(100);

        // First item should be selected (have 'selected' class)
        const firstResult = page.locator("#BlogSearchResult li").first();
        await expect(firstResult).toHaveClass(/selected/);
    });

    test("arrow down cycles through results", async ({ page }) => {
        await page.keyboard.press("Meta+k");
        await page.waitForTimeout(300);

        const searchInput = page.locator("#BlogSearch");
        await searchInput.fill("react");
        await page.waitForTimeout(500);

        // Press down multiple times to cycle through results
        await searchInput.press("ArrowDown");
        await page.waitForTimeout(100);

        const firstResult = page.locator("#BlogSearchResult li").first();
        await expect(firstResult).toHaveClass(/selected/);

        // Press down again to move to second
        await searchInput.press("ArrowDown");
        await page.waitForTimeout(100);

        const secondResult = page.locator("#BlogSearchResult li").nth(1);
        await expect(secondResult).toHaveClass(/selected/);
    });

    test("escape closes the search menu", async ({ page }) => {
        await page.keyboard.press("Meta+k");
        await page.waitForTimeout(300);

        // Verify menu is open
        const menuToggle = page.locator("#menu-toggle");
        await expect(menuToggle).toBeChecked();

        // Press escape
        await page.keyboard.press("Escape");
        await page.waitForTimeout(300);

        // Menu should be closed
        await expect(menuToggle).not.toBeChecked();
    });

    test("search loads index on page load", async ({ page }) => {
        // Wait for the search index to load
        await page.keyboard.press("Meta+k");
        await page.waitForTimeout(500);

        const searchInput = page.locator("#BlogSearch");

        // The spinner should not be visible once loaded
        const spinner = page.locator(".animate-spin");
        await expect(spinner).not.toBeVisible();

        // Search should be functional
        await searchInput.fill("web");
        await page.waitForTimeout(500);

        const resultItems = page.locator("#BlogSearchResult li");
        const count = await resultItems.count();
        expect(count).toBeGreaterThan(0);
    });

    test("clicking a search result navigates to the post", async ({ page }) => {
        await page.keyboard.press("Meta+k");
        await page.waitForTimeout(300);

        const searchInput = page.locator("#BlogSearch");
        await searchInput.fill("devops");
        await page.waitForTimeout(500);

        // Get the href of the first result
        const firstResultLink = page.locator("#BlogSearchResult li a").first();
        const href = await firstResultLink.getAttribute("href");

        // Click the first result
        await firstResultLink.click();

        // Verify navigation occurred
        await page.waitForURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
        expect(page.url()).toContain(href);
    });

    test("search results limit to 5 items", async ({ page }) => {
        await page.keyboard.press("Meta+k");
        await page.waitForTimeout(300);

        const searchInput = page.locator("#BlogSearch");

        // Use a common term that should match many posts
        await searchInput.fill("the");
        await page.waitForTimeout(500);

        // Should have at most 5 results
        const resultItems = page.locator("#BlogSearchResult li");
        const count = await resultItems.count();
        expect(count).toBeLessThanOrEqual(5);
    });
});
