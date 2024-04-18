import { getCollection, type CollectionEntry } from "astro:content";
import fs from "fs";
import path from "path";
import { ImageResponse } from "@vercel/og";
import { type ReactElement } from "react";

import myImage from "../../../assets/me.png";

interface Props {
    params: { slug: string };
    props: { post: CollectionEntry<"blog"> };
}

export async function GET({ props }: Props) {
    const { post } = props;

    // using custom font files
    const SansBold = fs.readFileSync(path.resolve("./public/fonts/PTSans-Bold.ttf"));
    const SansReqular = fs.readFileSync(path.resolve("./public/fonts/PTSans-Regular.ttf"));

    const img = post.data.image ?? { src: "/@fs/blog/og.png", alt: "Blog post cover" };

    // post cover with Image is pretty tricky for dev and build phase
    const postCover = fs.readFileSync(
        process.env.NODE_ENV === "development"
            ? path.resolve(img.src.replace(/\?.*/, "").replace("/@fs", ""))
            : path.resolve(img.src.replace("/", "dist/"))
    );
    const meImage = fs.readFileSync(
        process.env.NODE_ENV === "development"
            ? path.resolve(myImage.src.replace(/\?.*/, "").replace("/@fs", ""))
            : path.resolve(myImage.src.replace("/", "dist/"))
    );

    // Astro doesn't support tsx endpoints so using React-element objects
    const maxLines = 4;
    const html = {
        type: "div",
        props: {
            tw: "w-[1200px] h-[600px] flex items-center justify-center relative bg-white",
            children: [
                {
                    type: "div",
                    props: {
                        tw: "flex bottom-[24px] left-[424px] items-center absolute",
                        children: [
                            {
                                type: "img",
                                props: {
                                    tw: "object-cover object-center h-[36px] w-[36px] rounded",
                                    src: meImage.buffer
                                }
                            },
                            {
                                type: "p",
                                props: {
                                    style: {
                                        marginLeft: "16px",
                                        fontSize: "24px",
                                        fontFamily: "PTSans Regular"
                                    },
                                    children: "Christopher Vachon | Blog"
                                }
                            }
                        ]
                    }
                },
                {
                    type: "figure",
                    props: {
                        tw: "w-[400px] h-[600px] flex-shrink-0 overflow-hidden flex items-center justify-center",
                        children: [
                            {
                                type: "img",
                                props: {
                                    tw: "object-cover object-center h-[600px]",
                                    src: postCover.buffer
                                }
                            }
                        ]
                    }
                },
                {
                    type: "div",
                    props: {
                        tw: "flex flex-col flex-grow p-[24px] overflow-hidden w-[800px]",
                        children: [
                            {
                                type: "div",
                                props: {
                                    style: {
                                        fontSize: "48px",
                                        fontFamily: "PTSans Bold"
                                    },
                                    children: post.data.title
                                }
                            },
                            {
                                type: "div",
                                props: {
                                    tw: `line-clamp-3 overflow-hidden max-h-[${maxLines * 46}px]`,
                                    style: {
                                        fontSize: "36px",
                                        fontFamily: "PTSans Regular"
                                    },
                                    children: post.data.description
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };

    return new ImageResponse(html as ReactElement, {
        width: 1200,
        height: 600,
        fonts: [
            {
                name: "PTSans Bold",
                data: SansBold.buffer as unknown as Buffer,
                style: "normal"
            },
            {
                name: "PTSans Regular",
                data: SansReqular.buffer as unknown as Buffer,
                style: "normal"
            }
        ]
    });
}

// to generate an image for each blog posts in a collection
export async function getStaticPaths() {
    const blogPosts = await getCollection("blog");
    return blogPosts.map((post) => ({
        params: { slug: post.slug },
        props: { post }
    }));
}
