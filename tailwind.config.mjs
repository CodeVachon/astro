const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{astro,md,mdx,ts,tsx}"],
    darkMode: "selector",
    theme: {
        extend: {
            fontSize: {
                "2xs": ".6875rem"
            },
            fontFamily: {
                sans: "var(--font-inter)",
                display: "var(--font-mona-sans)"
            },
            opacity: {
                2.5: "0.025",
                7.5: "0.075",
                15: "0.15"
            }
        }
    },
    plugins: [
        require("@tailwindcss/typography"),
        plugin(function ({ addComponents, theme }) {
            addComponents({
                ".kg-card": {
                    backgroundColor: theme("colors.white"),
                    borderRadius: theme("borderRadius.lg"),
                    boxShadow: theme("boxShadow.sm"),
                    overflow: "hidden"
                },
                ".kg-card img": {
                    margin: "0"
                },
                ".kg-bookmark-container": {
                    width: "100%",
                    display: "flex",
                    gap: theme("spacing.4"),
                    alignItems: "center",
                    textDecoration: "none"
                },
                ".kg-bookmark-content": {
                    flexGrow: "1",
                    paddingTop: theme("spacing.2"),
                    paddingBottom: theme("spacing.2"),
                    paddingLeft: theme("spacing.4"),
                    paddingRight: theme("spacing.4")
                },
                ".kg-bookmark-title": {
                    fontWeight: "bold"
                },
                ".kg-bookmark-description": {
                    fontSize: "0.8em",
                    color: theme("colors.slate.500")
                },
                ".kg-bookmark-metadata": {
                    display: "flex",
                    fontSize: "0.8em",
                    gap: "0.5rem",
                    alignItems: "center",
                    marginTop: theme("spacing.4")
                },
                ".kg-bookmark-metadata .kg-bookmark-publisher": {
                    opacity: theme("opacity.50")
                },
                ".kg-bookmark-icon": {
                    width: theme("spacing.10"),
                    height: theme("spacing.10")
                },
                ".kg-bookmark-thumbnail img": {
                    width: theme("spacing.64"),
                    objectFit: "cover"
                }
            });
        }),
        plugin(function ({ addComponents, theme }) {
            addComponents({
                ".kg-card": {
                    backgroundColor: theme("colors.white"),
                    borderRadius: theme("borderRadius.lg"),
                    boxShadow: theme("boxShadow.sm"),
                    overflow: "hidden"
                },
                ".kg-card img": {
                    margin: "0"
                },
                ".kg-bookmark-container": {
                    width: "100%",
                    display: "flex",
                    gap: theme("spacing.4"),
                    alignItems: "center",
                    textDecoration: "none"
                },
                ".kg-bookmark-content": {
                    flexGrow: "1",
                    paddingTop: theme("spacing.2"),
                    paddingBottom: theme("spacing.2"),
                    paddingLeft: theme("spacing.4"),
                    paddingRight: theme("spacing.4")
                },
                ".kg-bookmark-title": {
                    fontWeight: "bold"
                },
                ".kg-bookmark-description": {
                    fontSize: "0.8em",
                    color: theme("colors.slate.500")
                },
                ".kg-bookmark-metadata": {
                    display: "flex",
                    fontSize: "0.8em",
                    gap: "0.5rem",
                    alignItems: "center",
                    marginTop: theme("spacing.4")
                },
                ".kg-bookmark-metadata .kg-bookmark-publisher": {
                    opacity: theme("opacity.50")
                },
                ".kg-bookmark-icon": {
                    width: theme("spacing.10"),
                    height: theme("spacing.10")
                },
                ".kg-bookmark-thumbnail img": {
                    width: theme("spacing.64"),
                    objectFit: "cover"
                }
            });
        })
    ]
};
