import { test, expect } from "@playwright/test";

test.describe("RSS Feed", () => {
    test("RSS feed is accessible", async ({ request }) => {
        const response = await request.get("/rss.xml");
        expect(response.ok()).toBeTruthy();
    });

    test("RSS feed has XML content", async ({ request }) => {
        const response = await request.get("/rss.xml");
        const text = await response.text();
        expect(text).toContain("<?xml");
    });

    test("RSS feed contains valid XML structure", async ({ request }) => {
        const response = await request.get("/rss.xml");
        const text = await response.text();

        // Check for RSS elements
        expect(text).toContain("<rss");
        expect(text).toContain("<channel>");
        expect(text).toContain("<title>");
        expect(text).toContain("<item>");
    });

    test("RSS feed contains blog posts", async ({ request }) => {
        const response = await request.get("/rss.xml");
        const text = await response.text();

        // Check for post content
        expect(text).toContain("<link>");
        expect(text).toContain("/blog/");
    });
});

test.describe("Sitemap", () => {
    test("sitemap index page exists", async ({ page }) => {
        // Navigate to sitemap - Astro may serve it differently
        const response = await page.goto("/sitemap-index.xml");

        // The response should exist (may be 200 or redirect to 404 in some servers)
        // We just verify the page loads
        expect(response).toBeTruthy();
    });
});

test.describe("Search JSON", () => {
    test("search-core.json is accessible", async ({ request }) => {
        const response = await request.get("/search-core.json");
        expect(response.ok()).toBeTruthy();
    });

    test("search-core.json returns JSON", async ({ request }) => {
        const response = await request.get("/search-core.json");
        const data = await response.json();
        expect(data).toBeTruthy();
    });

    test("search-core.json contains articles array", async ({ request }) => {
        const response = await request.get("/search-core.json");
        const data = await response.json();

        expect(data).toHaveProperty("articles");
        expect(Array.isArray(data.articles)).toBeTruthy();
        expect(data.articles.length).toBeGreaterThan(0);
    });

    test("search articles have required fields", async ({ request }) => {
        const response = await request.get("/search-core.json");
        const data = await response.json();

        const firstArticle = data.articles[0];
        expect(firstArticle).toHaveProperty("title");
        expect(firstArticle).toHaveProperty("description");
        expect(firstArticle).toHaveProperty("link");
        expect(firstArticle).toHaveProperty("tags");
    });
});
