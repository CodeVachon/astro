// Theme color definitions for the retro-futuristic cyber aesthetic
// Each theme has a distinct palette with neon colors

export interface ThemeDefinition {
    id: string;
    name: string;
    primary: string; // oklch value
    secondary: string;
    accent: string;
    highlight: string;
    // Preview color for theme switcher (hex)
    preview: string;
}

export const themes: ThemeDefinition[] = [
    {
        id: "cool-cyber",
        name: "Cool Cyber",
        primary: "oklch(0.75 0.18 195)", // Electric Teal
        secondary: "oklch(0.65 0.20 250)", // Deep Blue
        accent: "oklch(0.72 0.22 145)", // Matrix Green
        highlight: "oklch(0.65 0.25 330)", // Hot Pink
        preview: "#00d4ff"
    },
    {
        id: "synthwave",
        name: "Synthwave",
        primary: "oklch(0.65 0.28 330)", // Hot Pink
        secondary: "oklch(0.55 0.25 290)", // Purple
        accent: "oklch(0.75 0.18 195)", // Cyan
        highlight: "oklch(0.80 0.20 85)", // Gold
        preview: "#ff2d95"
    },
    {
        id: "matrix",
        name: "Matrix",
        primary: "oklch(0.72 0.25 140)", // Matrix Green
        secondary: "oklch(0.55 0.20 145)", // Dark Green
        accent: "oklch(0.80 0.22 135)", // Bright Green
        highlight: "oklch(0.65 0.15 150)", // Muted Green
        preview: "#00ff41"
    },
    {
        id: "amber-terminal",
        name: "Amber Terminal",
        primary: "oklch(0.75 0.18 70)", // Amber
        secondary: "oklch(0.60 0.15 55)", // Dark Orange
        accent: "oklch(0.80 0.20 80)", // Yellow-Orange
        highlight: "oklch(0.70 0.22 45)", // Orange
        preview: "#ffb000"
    }
];

// Legacy export for backward compatibility with old theme toggle
export const colors = themes.map((t) => t.preview.replace("#", ""));

// Get theme by ID
export function getThemeById(id: string): ThemeDefinition | undefined {
    return themes.find((t) => t.id === id);
}

// Default theme
export const defaultTheme = themes[0];
