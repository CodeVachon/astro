import Bun from "bun";

const glob = new Bun.Glob("**/*.md");
const contentPath = "./src/content/blog";

const records: Array<[string, string]> = [];
for await (const filePath of glob.scan(contentPath)) {
    const slug = filePath.replace(/\.md$/, "");

    records.push([
        ["/", slug.replace(new RegExp("[0-9]{4}-[0-9]{2}-[0-9]{2}-"), ""), "/"].join(""),
        ["/blog", slug, ""].join("/")
    ]);
}
await Bun.write(
    "./nginx/blog.map",
    records.map(([from, to]) => `${from} ${to}`).join(";\n") + ";\n"
);
