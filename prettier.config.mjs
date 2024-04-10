export default {
    printWidth: 100,
    tabWidth: 4,
    useTabs: false,
    singleQuote: false,
    semi: true,
    bracketSpacing: true,
    arrowParens: "always",
    endOfLine: "lf",
    trailingComma: "none",
    plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
    overrides: [
        {
            files: "*.astro",
            options: {
                parser: "astro"
            }
        },
        {
            files: "*.json",
            options: {
                tabWidth: 2
            }
        },
        {
            files: "*.yml",
            options: {
                tabWidth: 2
            }
        }
    ]
};
