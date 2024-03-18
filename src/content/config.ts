// 1. Import utilities from `astro:content`
import { z, defineCollection, reference } from "astro:content";

const imageConfig =z.string().or(
    z.object({
        src: z.string(),
        alt: z.string()
    })
);

// 2. Define your collection(s)
const blogCollection = defineCollection({
    /* ... */
    type: "content",
    schema: z.object({
        draft: z.boolean(),
        title: z.string(),
        description: z.string(),
        image: imageConfig,
        tags: z.array(reference("tag")),
        // An optional frontmatter property. Very common!
        footnote: z.string().optional(),
        // In frontmatter, dates written without quotes around them are interpreted as Date objects
        date: z.date(),
        featured: z.boolean().optional().default(false)
    })
});

const tagCollection = defineCollection({
    type: "content",
    schema: z.object({
        name: z.string(),
        description: z.string().optional()
    })
});

const pageContentCollection = defineCollection({
    type:"content",
    schema: z.object({
        name:z.string(),
        description: z.string().optional(),
        image: imageConfig.optional(),
    })
})

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
    blog: blogCollection,
    tag: tagCollection,
    page: pageContentCollection
};
