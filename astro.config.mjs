import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import remarkToc from "remark-toc";
import a11yEmoji from "@fec/remark-a11y-emoji";
import { remarkReadingTime } from "./src/lib/readingTime";
import sitemap from "@astrojs/sitemap";
import metaTags from "astro-meta-tags";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

const runningPort = 4006;

const url =
    process.env.NODE_ENV === "development"
        ? `http://localhost:${runningPort}`
        : "https://christophervachon.com";

// https://astro.build/config
export default defineConfig({
    server: {
        port: runningPort
    },
    site: url,
    prefetch: true,
    redirects: {
        "/old-page": "/new-page"
    },
    // Required to Add Buffer Polyfill to the Browser for Bloom Filters
    // vite: {
    //     optimizeDeps: {
    //         esbuildOptions: {
    //             // Node.js global to browser globalThis
    //             define: {
    //                 global: "globalThis"
    //             },
    //             // Enable esbuild polyfill plugins
    //             plugins: [
    //                 NodeGlobalsPolyfillPlugin({
    //                     buffer: true
    //                 })
    //             ]
    //         }
    //     }
    // },
    integrations: [
        sitemap(),
        react(),
        tailwind({
            nesting: true,
            applyBaseStyles: false
        }),
        metaTags()
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
    },
    image: {
        domains: [
            "images.unsplash.com",
            "blog.christophervachon.com",
            "christophervachon.s3.amazonaws.com"
        ],
        remotePatterns: [
            {
                protocol: "https"
            }
        ]
    }
});
