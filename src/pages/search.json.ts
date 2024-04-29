import { getCollection } from "astro:content";
import { getImage } from "astro:assets";

export async function GET() {
    const blogPosts = await getCollection("blog")
        .then((posts) =>
            posts.filter((post) => {
                return post.data.draft === false;
            })
        )
        .then((posts) =>
            Promise.all(
                posts.map(async (post) => {
                    const imageSrc = await getImage({
                        src: post.data.image as any,
                        format: "webp",
                        width: 200
                    });

                    return {
                        id: post.id,
                        title: post.data.title,
                        slug: post.slug,
                        description: post.data.description,
                        image: imageSrc.src,
                        text: post.body,
                        tags: post.data.tags.map((tag) => tag.slug)
                    };
                })
            )
        );

    const tags = await getCollection("tag").then((tags) => {
        return tags.map((tag) => {
            return {
                id: tag.id,
                title: tag.data.name,
                slug: tag.slug,
                text: tag.body
            };
        });
    });

    return new Response(
        JSON.stringify(
            { posts: blogPosts, tags },

            null,
            4
        )
    );
}
