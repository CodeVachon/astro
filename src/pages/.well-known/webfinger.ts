import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
    const site = new URL(context.site ?? "localhost");

    return new Response(
        JSON.stringify(
            {
                subject: "acct:code@christophervachon.com",
                links: [
                    {
                        rel: "http://webfinger.net/rel/avatar",
                        type: "image/png",
                        href: new URL("me-300.png", site)
                    },
                    {
                        rel: "http://webfinger.net/rel/profile-page",
                        href: new URL(site)
                    }
                ]
            },
            null,
            " ".repeat(4)
        )
    );
};
