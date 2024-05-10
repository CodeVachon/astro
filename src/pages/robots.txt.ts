import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
    return new Response(content(new URL(context.site ?? "localhost")));
};

const content = (site: URL) => `
User-agent: *
Allow: /
Sitemap: ${site.origin}/sitemap.xml
`;
