import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
    const blog = await getCollection("blog");

    return rss({
        // `<title>` field in output xml
        title: "Christopher Vachon's Blog",
        // `<description>` field in output xml
        description: "A Web Developer's Blog about DevOps, Databases, and more!",
        // Pull in your project "site" from the endpoint context
        // https://docs.astro.build/en/reference/api-reference/#contextsite
        site: new URL(context.site ?? "localhost"),
        // Array of `<item>`s in output xml
        // See "Generating items" section for examples using content collections and glob imports
        items: blog.map((post) => ({
            title: post.data.title,
            pubDate: post.data.date,
            description: post.data.description,
            image:
                typeof post.data.image !== "undefined"
                    ? typeof post.data.image === "string"
                        ? post.data.image
                        : post.data.image.src
                    : undefined,
            // Compute RSS link from post `slug`
            // This example assumes all posts are rendered as `/blog/[slug]` routes
            link: `/blog/${post.slug}/`
        })),
        // (optional) inject custom xml
        customData: `<language>en-us</language>`
    });
};
