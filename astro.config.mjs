import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import remarkToc from "remark-toc";
import a11yEmoji from "@fec/remark-a11y-emoji";
import { remarkReadingTime } from "./src/lib/readingTime";

// https://astro.build/config
export default defineConfig({
    server: {
        port: 4006
    },
    prefetch: true,
    integrations: [
        react(),
        tailwind({
            nesting: true,
            applyBaseStyles: false
        })
    ],
    markdown: {
        // Applied to .md and .mdx files
        remarkPlugins: [remarkReadingTime, remarkToc, a11yEmoji],
        shikiConfig: {
            // Choose from Shiki's built-in themes (or add your own)
            // https://github.com/shikijs/shiki/blob/main/docs/themes.md
            // theme: "material-theme-palenight",
            theme: "nord",
            // Add custom languages
            // Note: Shiki has countless langs built-in, including .astro!
            // https://github.com/shikijs/shiki/blob/main/docs/languages.md
            langs: [],
            // Enable word wrap to prevent horizontal scrolling
            wrap: true
        }
    }
});
