import type { APIRoute } from "astro";
import figlet from "figlet";

export const GET: APIRoute = async () => {
    return new Response(
        `
${figlet.textSync("No Ads", { font: "Colossal" })}
    `.trim()
    );
};
