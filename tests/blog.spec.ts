import { test, expect } from "@playwright/test";

test.describe("Blog Index", () => {
    test("renders blog listing page", async ({ page }) => {
        await page.goto("/blog");

        // Check page title
        await expect(page).toHaveTitle(/Blog/i);

        // Check for blog archive heading (terminal-style header)
        await expect(page.getByRole("heading", { name: /blog archive/i })).toBeVisible();
    });

    test("displays multiple blog posts", async ({ page }) => {
        await page.goto("/blog");

        // Check that multiple post links exist
        const postLinks = page.locator('a[href^="/blog/2"]');
        const count = await postLinks.count();
        expect(count).toBeGreaterThan(5);
    });

    test("has link to tags page", async ({ page }) => {
        await page.goto("/blog");

        // Check for tags link
        await expect(page.getByRole("link", { name: /tags/i }).first()).toBeVisible();
    });
});

test.describe("Blog Post", () => {
    test("renders individual blog post with content", async ({ page }) => {
        await page.goto("/blog/2014-12-03-what-is-devops/");

        // Check page has title
        await expect(page).toHaveTitle(/DevOps/i);

        // Check article heading exists
        const articleHeading = page.locator("article h1, .article-title");
        await expect(articleHeading.first()).toBeVisible();

        // Check article content exists
        const article = page.locator("article").first();
        await expect(article).toBeVisible();
    });

    test("displays post metadata", async ({ page }) => {
        await page.goto("/blog/2014-12-03-what-is-devops/");

        // Check that the article header section exists
        const header = page.locator("article header, .article-header");
        await expect(header.first()).toBeVisible();
    });

    test("displays tags on blog post", async ({ page }) => {
        await page.goto("/blog/2014-12-03-what-is-devops/");

        // Check for tags section
        await expect(page.getByText(/tags/i).first()).toBeVisible();

        // Check for tag links
        const tagLinks = page.locator('a[href^="/blog/tags/"]');
        await expect(tagLinks.first()).toBeVisible();
    });

    test("has related articles section", async ({ page }) => {
        await page.goto("/blog/2014-12-03-what-is-devops/");

        // Check for related articles
        await expect(page.getByRole("heading", { name: /related articles/i })).toBeVisible();
    });

    test("has GitHub source link", async ({ page }) => {
        await page.goto("/blog/2014-12-03-what-is-devops/");

        // Check for View source on GitHub link (in article footer, more specific)
        const githubLink = page.locator("a.github-link, a[href*='github.com/CodeVachon/astro/blob']");
        await expect(githubLink.first()).toBeVisible();
    });

    test("renders code blocks with syntax highlighting", async ({ page }) => {
        // Navigate to a post known to have code blocks
        await page.goto("/blog/2016-05-06-react-with-gulp-babel-and-browserify/");

        // Check for code blocks (Shiki adds classes for highlighting)
        const codeBlocks = page.locator("pre code, .astro-code");
        const count = await codeBlocks.count();
        expect(count).toBeGreaterThan(0);
    });
});
