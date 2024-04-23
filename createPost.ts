import inquirer from "inquirer";
import dayjs from "dayjs";
import Bun from "bun";

/**
 * Get all tags from the content directory
 */
const tags: Array<{ label: string; value: string }> = [];
const glob = new Bun.Glob("**/*.md");
const contentPath = "./src/content/tag";
for await (const filePath of glob.scan(contentPath)) {
    const fullFilePath = [contentPath, filePath].join("/");

    const record = Bun.file(fullFilePath);
    const contents = await record.text();

    const title = (contents.match(/name: (.*)/) ?? [])[1];

    tags.push({
        label: String(title) ?? filePath,
        value: filePath.replace(/\.md$/, "")
    });
}

/**
 * Prompt the user for the post details
 */
const answers = await inquirer.prompt([
    {
        type: "input",
        name: "title",
        message: "What is the title of the post?"
    },
    {
        type: "input",
        name: "date",
        message: "what is the date of the post?",
        default: dayjs().format("YYYY-MM-DD"),
        validate: (input) => {
            if (dayjs(input).isValid()) {
                return true;
            }
            return "Please enter a valid date in the format YYYY-MM-DD";
        }
    },
    {
        type: "checkbox",
        name: "tags",
        message: "Select tags for the post",
        choices: tags.sort((a, b) => a.label.localeCompare(b.label))
    }
]);

/**
 * Function to Create YAML Front Matter from Object
 */
const YAML_INDENT = 2;
function YAMLStringify(obj: Record<string, any>) {
    return `---\n${Object.entries(obj)
        .map(([key, value]) => {
            if (Array.isArray(value)) {
                return `${key}:\n${value.map((val) => `${" ".repeat(YAML_INDENT)}- ${val}`).join("\n")}`;
            }

            return `${key}: ${value}`;
        })
        .join("\n")}\n---\n`;
}

/**
 * Create the new blog post
 */
const newBlogPost = YAMLStringify({
    title: "Test Post",
    description: "My Post Description",
    date: dayjs().format("YYYY-MM-DD"),
    tags: ["devops"],
    image: "../../assets/default-1.png",
    featured: false,
    draft: false,
    ...answers
});

/**
 * Write the new blog post to the file system
 */
const fileName = [answers.date, answers.title]
    .join("-")
    .replace(/[^a-z0-9]{1,}/gi, "-")
    .toLowerCase();
await Bun.write(`./src/content/blog/${fileName}.md`, newBlogPost);
