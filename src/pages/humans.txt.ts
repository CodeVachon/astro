import type { APIRoute } from "astro";
import figlet from "figlet";
import { getEntry } from "astro:content";

export const GET: APIRoute = async () => {
    const homepageData = await getEntry("page", "homepage");

    return new Response(
        `
${figlet.textSync("Christopher Vachon", { font: "Colossal" })}

${figlet.textSync("Dev Blog", {})}

${homepageData.body}
    `.trim()
    );
};
