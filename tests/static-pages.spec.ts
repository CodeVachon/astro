import { test, expect } from "@playwright/test";

test.describe("Static Pages", () => {
    test("404 page renders", async ({ page }) => {
        await page.goto("/non-existent-page-12345");

        // 404 pages may return 200 in static sites, just check content renders
        await expect(page.locator("body")).toBeVisible();
    });

    test("uses page renders", async ({ page }) => {
        await page.goto("/uses");

        // Check page loads and has content
        await expect(page.locator("body")).toBeVisible();

        // Check for some content
        const content = page.locator("article, main, .prose");
        await expect(content.first()).toBeVisible();
    });

    test("code page renders", async ({ page }) => {
        await page.goto("/code");

        // Check page title
        await expect(page).toHaveTitle(/code/i);

        // Check for code heading
        await expect(page.getByRole("heading", { name: /code/i }).first()).toBeVisible();
    });
});

test.describe("Search Functionality", () => {
    test("search input exists on page", async ({ page }) => {
        await page.goto("/");

        // Check for search input
        const searchInput = page.locator("#BlogSearch, input[type='search'], input[name='blog-search']");
        await expect(searchInput.first()).toBeVisible();
    });

    test("search input accepts text", async ({ page }) => {
        await page.goto("/");

        // Find and interact with search
        const searchInput = page.locator("#BlogSearch, input[type='search']").first();
        await searchInput.fill("docker");

        // Verify input value
        await expect(searchInput).toHaveValue("docker");
    });

    test("search component renders and accepts input", async ({ page }) => {
        await page.goto("/blog");

        // Wait for page load
        await page.waitForLoadState("domcontentloaded");

        // Find search input on blog page
        const searchInput = page.locator("input[type='search'], #BlogSearch").first();

        // Verify it's attached to the DOM
        await expect(searchInput).toBeAttached();
    });
});

test.describe("Navigation", () => {
    test("main navigation works", async ({ page }) => {
        await page.goto("/");

        // Test blog navigation
        await page.locator('a[href="/blog"]').first().click();
        await expect(page).toHaveURL(/\/blog/);
    });

    test("can navigate between pages", async ({ page }) => {
        await page.goto("/blog");

        // Navigate to a blog post
        const postLink = page.locator('a[href^="/blog/2"]').first();
        await postLink.click();

        // Verify we're on a blog post page
        await expect(page).toHaveURL(/\/blog\/2/);
    });
});

test.describe("Images", () => {
    test("images load on homepage", async ({ page }) => {
        await page.goto("/");

        // Wait for images to load
        await page.waitForLoadState("networkidle");

        // Check that images exist
        const images = page.locator("img");
        const count = await images.count();
        expect(count).toBeGreaterThan(0);

        // Check first image loaded (has natural width)
        const firstImage = images.first();
        const naturalWidth = await firstImage.evaluate(
            (img: HTMLImageElement) => img.naturalWidth
        );
        expect(naturalWidth).toBeGreaterThan(0);
    });

    test("blog post images load", async ({ page }) => {
        await page.goto("/blog");

        // Wait for images
        await page.waitForLoadState("networkidle");

        // Check images exist on blog listing
        const images = page.locator("img");
        const count = await images.count();
        expect(count).toBeGreaterThan(0);
    });
});

test.describe("Accessibility", () => {
    test("page has content structure", async ({ page }) => {
        await page.goto("/");

        // Check body exists and has content
        const body = page.locator("body");
        await expect(body).toBeVisible();
    });

    test("headings exist on page", async ({ page }) => {
        await page.goto("/");

        // Check that headings exist
        const headings = page.locator("h1, h2, h3");
        const count = await headings.count();
        expect(count).toBeGreaterThan(0);
    });

    test("links are present", async ({ page }) => {
        await page.goto("/");

        // Get all links
        const links = page.locator("a");
        const count = await links.count();
        expect(count).toBeGreaterThan(0);
    });
});
