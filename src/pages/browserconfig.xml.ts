import type { APIRoute } from "astro";
import coverImage from "./../assets/default-2.png";
import { getImage } from "astro:assets";

import { colors } from "~lib/themeColors";

const sizes = ["70x70", "150x150", "310x150", "310x310"] as const;
type ConfigIconSize = (typeof sizes)[number];
type ConfigIcons = Record<ConfigIconSize, string>;

export const GET: APIRoute = async (context) => {
    const site = new URL(context.site ?? "localhost");

    const tiles = await Promise.all(
        sizes.map(async (size) => {
            const [width, height] = size.split("x").map(Number) as [number, number];
            const tile = await getImage({ src: coverImage, width, height, format: "png" });
            return {
                [size]: new URL(tile.src, site).toString()
            };
        })
    ).then((recordSet: Partial<ConfigIcons>[]) =>
        recordSet.reduce<ConfigIcons>((acc, curr) => {
            return { ...acc, ...curr };
        }, {} as ConfigIcons)
    );

    return new Response(await content(tiles));
};

const content = (tiles: ConfigIcons) =>
    `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            ${Object.entries(tiles)
                .map(([size, src]) => {
                    const [width, height] = size.split("x").map(Number) as [number, number];
                    const type = width === height ? "square" : "wide";
                    return `<${type}${size}logo src="${src}"/>`;
                })
                .join(`\r\n${" ".repeat(12)}`)}
            <TileColor>#${colors[0]}</TileColor>
            <TileImage src="${tiles["150x150"]}" />
        </tile>
    </msapplication>
</browserconfig>
`.trim();
