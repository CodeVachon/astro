import { test, expect } from "@playwright/test";

test.describe("Tags Index", () => {
    test("renders tags listing page", async ({ page }) => {
        await page.goto("/blog/tags");

        // Check page title
        await expect(page).toHaveTitle(/Tags/i);

        // Check for all tags heading
        await expect(page.getByRole("heading", { name: /all tags/i })).toBeVisible();
    });

    test("displays tags sections", async ({ page }) => {
        await page.goto("/blog/tags");

        // Check for tags headings (Popular or Less Popular)
        const headings = page.locator("h2");
        const count = await headings.count();
        expect(count).toBeGreaterThan(0);
    });

    test("lists multiple tags", async ({ page }) => {
        await page.goto("/blog/tags");

        // Check that multiple tag links exist
        const tagLinks = page.locator('a[href*="/blog/tags/"], a[href*="tags/"]');
        const count = await tagLinks.count();
        expect(count).toBeGreaterThan(5);
    });

    test("tag links navigate to tag pages", async ({ page }) => {
        await page.goto("/blog/tags");

        // Click on devops tag
        await page.locator('a[href*="devops"]').first().click();

        // Verify navigation to tag page
        await expect(page).toHaveURL(/\/blog\/tags\/devops/);
    });
});

test.describe("Individual Tag Page", () => {
    test("renders tag page with filtered posts", async ({ page }) => {
        await page.goto("/blog/tags/devops");

        // Check page title contains tag name
        await expect(page).toHaveTitle(/devops/i);

        // Check for tag heading
        await expect(page.getByRole("heading", { name: /devops/i }).first()).toBeVisible();
    });

    test("displays articles for the tag", async ({ page }) => {
        await page.goto("/blog/tags/devops");

        // Check for articles section
        await expect(page.getByRole("heading", { name: /articles/i })).toBeVisible();

        // Check that post links exist
        const postLinks = page.locator('a[href^="/blog/2"]');
        await expect(postLinks.first()).toBeVisible();
    });

    test("has breadcrumb navigation", async ({ page }) => {
        await page.goto("/blog/tags/devops");

        // Check for breadcrumb component (more specific selector)
        const breadcrumb = page.locator('a[href="/"]').filter({ hasText: /^Home$/ });
        await expect(breadcrumb).toBeVisible();
    });

    test("docker tag page shows docker posts", async ({ page }) => {
        await page.goto("/blog/tags/docker");

        // Check page loads
        await expect(page).toHaveTitle(/docker/i);

        // Verify docker-related content
        await expect(page.getByRole("heading", { name: /docker/i }).first()).toBeVisible();
    });

    test("react tag page shows react posts", async ({ page }) => {
        await page.goto("/blog/tags/react");

        // Check page loads
        await expect(page).toHaveTitle(/react/i);
    });
});
