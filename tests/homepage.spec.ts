import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
    test("renders correctly with title", async ({ page }) => {
        await page.goto("/");

        // Check page title
        await expect(page).toHaveTitle(/Home/);

        // Check main content area exists
        await expect(page.locator("body")).toBeVisible();
    });

    test("displays recent posts section", async ({ page }) => {
        await page.goto("/");

        // Check for recent posts heading
        await expect(page.getByRole("heading", { name: /recent posts/i })).toBeVisible();

        // Check that blog post links exist
        const postLinks = page.locator('a[href^="/blog/"]');
        await expect(postLinks.first()).toBeVisible();
    });

    test("has working navigation to blog", async ({ page }) => {
        await page.goto("/");

        // Click blog link and verify navigation
        await page.locator('a[href="/blog"]').first().click();
        await expect(page).toHaveURL(/\/blog/);
    });

    test("contains profile section", async ({ page }) => {
        await page.goto("/");

        // Check for profile/sidebar content
        const sidebar = page.locator("#sidebar, aside, [class*='sidebar']");
        await expect(sidebar.first()).toBeVisible();
    });

    test("has social links", async ({ page }) => {
        await page.goto("/");

        // Check for GitHub link (more specific selector)
        const githubLink = page.locator('a[href*="github.com"]');
        await expect(githubLink.first()).toBeVisible();
    });

    test("displays site name", async ({ page }) => {
        await page.goto("/");

        // Check for site name or author name
        await expect(page.getByText(/christopher vachon/i).first()).toBeVisible();
    });
});
