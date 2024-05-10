import type { APIRoute } from "astro";
import dayjs from "dayjs";

export const GET: APIRoute = async (context) => {
    const site = new URL(context.site ?? "localhost");

    return new Response(
        `
Contact: mailto:code@christophervachon.com
Expires: ${dayjs().add(1, "year").endOf("day").toISOString()}
Preferred-Languages: en
Canonical: ${site}.well-known/security.txt
    `.trim()
    );
};
