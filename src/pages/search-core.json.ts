import type { APIRoute } from "astro";
import { getImage } from "astro:assets";
import { getCollection } from "astro:content";
import { stopWords } from "~lib/stopWords";

// import filterPkg from "bloom-filters";
// const { BloomFilter } = filterPkg;

export const GET: APIRoute = async (context) => {
    const core: {
        articles: Array<{
            title: string;
            description: string;
            image?: { width: number; height: number; src: string };
            link: string;
            tags: Array<string>;
            bloom: Array<string>;
        }>;
    } = {
        articles: []
    };

    const blog = await getCollection("blog");
    let maxSize = 0;
    for (const post of blog) {
        const title = post.data.title;
        const description = post.data.description;
        const image = post.data.image
            ? await getImage({ src: post.data.image, width: 100, height: "auto" })
            : null;
        const link = `/blog/${post.slug}/`;

        const uniqueWords = new Set<string>();
        for (const word of post.body.split(new RegExp("[\\s]{1,}", "g"))) {
            const cleanedWords = word
                .replace(/[^a-zA-Z0-9]/g, " ")
                .trim()
                .split(" ");
            for (const cleanedWord of cleanedWords) {
                if (stopWords.includes(cleanedWord.toLowerCase()) || cleanedWord.length === 0) {
                    continue;
                }
                uniqueWords.add(cleanedWord);
                uniqueWords.add(cleanedWord.toLowerCase());
                maxSize += cleanedWord.length;
            }
        }

        // const filter = new BloomFilter(maxSize, 2);
        // for (const word of uniqueWords) {
        //     filter.add(word);
        // }

        core.articles.push({
            title,
            description,
            image: image
                ? {
                      src: image.src,
                      width: image.attributes.width,
                      height: image.attributes.height
                  }
                : undefined,
            link,
            tags: post.data.tags.map((tag) => tag.slug),
            bloom: Array.from(uniqueWords) //filter.saveAsJSON()
        });
    }

    return new Response(JSON.stringify(core));
};
