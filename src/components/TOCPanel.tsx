import { useState, useEffect } from "react";

/**
 * Represents a single heading item in the table of contents
 */
interface TOCItem {
    /** Unique identifier for the heading (used for anchor links) */
    id: string;
    /** The heading text content */
    text: string;
    /** Heading level (2-4 for h2-h4) */
    level: number;
}

/**
 * Props for the TOCPanel component
 */
interface TOCPanelProps {
    /** CSS selector to find headings (default: "article h2, article h3, article h4") */
    selector?: string;
    /** Title displayed in the panel header (default: "TABLE OF CONTENTS") */
    title?: string;
}

/**
 * Interactive table of contents panel with scroll tracking
 *
 * Features:
 * - Auto-generates TOC from article headings (h2, h3, h4)
 * - Assigns IDs to headings if missing
 * - Tracks active section using IntersectionObserver
 * - Smooth scroll navigation on click
 * - Styled with cyber theme (corner accents, status dot)
 *
 * @example
 * ```tsx
 * <TOCPanel client:load />
 * // or with custom selector
 * <TOCPanel selector="main h2, main h3" title="ON THIS PAGE" client:load />
 * ```
 */
export default function TOCPanel({
    selector = "article h2, article h3, article h4",
    title = "TABLE OF CONTENTS"
}: TOCPanelProps) {
    const [items, setItems] = useState<TOCItem[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        // Collect headings
        const headings = document.querySelectorAll(selector);
        const tocItems: TOCItem[] = [];

        headings.forEach((heading) => {
            const id = heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, "-") || "";
            if (!heading.id) {
                heading.id = id;
            }

            tocItems.push({
                id,
                text: heading.textContent || "",
                level: parseInt(heading.tagName[1]) || 2
            });
        });

        setItems(tocItems);

        // Intersection observer for active heading
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            {
                rootMargin: "-20% 0% -60% 0%",
                threshold: 0
            }
        );

        headings.forEach((heading) => observer.observe(heading));

        return () => observer.disconnect();
    }, [selector]);

    if (items.length === 0) {
        return null;
    }

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
            setActiveId(id);
        }
    };

    const minLevel = Math.min(...items.map((item) => item.level));

    return (
        <div className="toc-panel">
            <header className="toc-header">
                <span className="status-dot" aria-hidden="true" />
                <span className="header-text">// {title}</span>
            </header>
            <nav className="toc-nav" aria-label="Table of contents">
                <ol className="toc-list">
                    {items.map((item, index) => (
                        <li
                            key={item.id}
                            className="toc-item"
                            style={{ "--indent": item.level - minLevel } as React.CSSProperties}
                        >
                            <a
                                href={`#${item.id}`}
                                onClick={(e) => handleClick(e, item.id)}
                                className={`toc-link ${activeId === item.id ? "active" : ""}`}
                            >
                                <span className="toc-index">{String(index + 1).padStart(2, "0")}</span>
                                <span className="toc-text">{item.text}</span>
                            </a>
                        </li>
                    ))}
                </ol>
            </nav>
            <style>{`
                .toc-panel {
                    border: 1px solid color-mix(in oklch, var(--color-primary) 20%, transparent);
                    border-radius: 0.5rem;
                    background: color-mix(in oklch, var(--color-bg-panel) 50%, transparent);
                    backdrop-filter: blur(4px);
                    overflow: hidden;
                    position: relative;
                }

                .toc-panel::before,
                .toc-panel::after {
                    content: "";
                    position: absolute;
                    width: 16px;
                    height: 16px;
                    border: 2px solid var(--color-primary);
                    opacity: 0.4;
                    pointer-events: none;
                }

                .toc-panel::before {
                    top: -1px;
                    left: -1px;
                    border-right: none;
                    border-bottom: none;
                }

                .toc-panel::after {
                    bottom: -1px;
                    right: -1px;
                    border-left: none;
                    border-top: none;
                }

                .toc-header {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    border-bottom: 1px solid color-mix(in oklch, var(--color-primary) 15%, transparent);
                    font-family: var(--font-family-mono, "JetBrains Mono", monospace);
                    font-size: 0.7rem;
                    letter-spacing: 0.1em;
                    color: color-mix(in oklch, var(--color-primary) 80%, transparent);
                }

                .status-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: var(--color-primary);
                    box-shadow: 0 0 6px var(--color-primary);
                    animation: toc-pulse 2s ease-in-out infinite;
                }

                @keyframes toc-pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }

                .toc-nav {
                    max-height: 300px;
                    overflow-y: auto;
                    scrollbar-width: thin;
                    scrollbar-color: color-mix(in oklch, var(--color-primary) 30%, transparent) transparent;
                }

                .toc-nav::-webkit-scrollbar {
                    width: 4px;
                }

                .toc-nav::-webkit-scrollbar-track {
                    background: transparent;
                }

                .toc-nav::-webkit-scrollbar-thumb {
                    background: color-mix(in oklch, var(--color-primary) 30%, transparent);
                    border-radius: 2px;
                }

                .toc-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .toc-item {
                    padding-left: calc(var(--indent, 0) * 1rem);
                }

                .toc-link {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                    padding: 0.5rem 1rem;
                    text-decoration: none;
                    transition: all 0.2s ease;
                    border-left: 2px solid transparent;
                }

                .toc-link:hover {
                    background: color-mix(in oklch, var(--color-primary) 10%, transparent);
                    text-shadow: none;
                }

                .toc-link.active {
                    background: color-mix(in oklch, var(--color-primary) 15%, transparent);
                    border-left-color: var(--color-primary);
                }

                .toc-index {
                    font-family: var(--font-family-mono, "JetBrains Mono", monospace);
                    font-size: 0.65rem;
                    color: color-mix(in oklch, var(--color-primary) 50%, transparent);
                    flex-shrink: 0;
                    margin-top: 0.15rem;
                }

                .toc-link.active .toc-index {
                    color: var(--color-primary);
                }

                .toc-text {
                    font-family: var(--font-family-body, "Space Grotesk", system-ui);
                    font-size: 0.8rem;
                    line-height: 1.4;
                    color: var(--color-text-secondary);
                    transition: color 0.2s ease;
                }

                .toc-link:hover .toc-text,
                .toc-link.active .toc-text {
                    color: var(--color-primary);
                }

                /* Light mode */
                :global(html:not(.dark)) .toc-panel {
                    background: color-mix(in oklch, var(--color-bg-light-panel) 80%, transparent);
                }

                :global(html:not(.dark)) .toc-text {
                    color: var(--color-text-muted);
                }

                :global(html:not(.dark)) .toc-link:hover .toc-text,
                :global(html:not(.dark)) .toc-link.active .toc-text {
                    color: var(--color-primary);
                }
            `}</style>
        </div>
    );
}
