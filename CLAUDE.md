# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio and blog built with Astro 5, featuring a retro-futuristic cyber aesthetic. Static site deployed via Docker/Nginx.

**Site**: https://christophervachon.com
**Runtime**: Bun (not npm)

## Commands

```bash
bun install              # Install dependencies
bun dev                  # Dev server at http://localhost:4006
bun build                # Production build to /dist
bun preview              # Preview production build
bun check                # TypeScript/Astro type checking
bun test                 # Run Playwright e2e tests
bun test:ui              # Run tests with interactive UI
bun test:headed          # Run tests in headed browser
```

## Architecture

### Tech Stack
- **Astro 5** with Content Layer API for static generation
- **React 19** for interactive components only (Search, TOC)
- **Tailwind CSS 4** with CSS-based configuration
- **TypeScript** in strict mode
- **Playwright** for e2e testing

### Path Aliases (tsconfig.json)
```
~components/* → src/components/*
~layouts/*    → src/layouts/*
~lib/*        → src/lib/*
```

### Key Directories
- `src/content/blog/` - 500+ markdown posts with frontmatter
- `src/content/page/` - Static pages (homepage content)
- `src/content/tag/` - Tag definitions
- `src/lib/themeColors.ts` - Four cyber theme definitions (OKLCH colors)
- `tests/` - Playwright e2e tests

### Component Philosophy
- **Astro components** for layout, structure, and static content
- **React components** only for interactivity (Search.tsx, TOCPanel.tsx)
- Prefer Astro over React for SSR content

### Theme System
Four themes defined in `src/lib/themeColors.ts`: Cool Cyber, Synthwave, Matrix, Amber Terminal. Applied via `data-theme` attribute and CSS custom properties, persisted in localStorage.

### Search Implementation
Pre-built index at `/search-core.json`. React Search component with keyword scoring and keyboard navigation (Cmd+K).

### Content Collections
Blog posts use frontmatter:
```yaml
---
title: "Article Title"
date: 2024-02-04
tags: [web, astro, development]
draft: false
minutesRead: "5 min read"  # Auto-generated
---
```

### Image Handling
Use Astro's `<Picture>` component with responsive widths. OG images generated per post at `/blog/[slug]/og.png`. Allowed domains: Unsplash, S3, blog.christophervachon.com.

## Testing

Playwright runs against the production build (`bun preview`). Tests cover:
- Blog pages and post rendering
- Theme persistence
- Homepage and static pages
- Tags functionality
- RSS/Sitemap feeds

## Build Scripts

```bash
bun buildBlogMap.ts      # Generate nginx URL rewrite map
bun createPost.ts        # CLI to create new blog post
bun importBlogImages.ts  # Import/optimize blog images
bun linkCheck.ts         # Check for broken links
```

## Deployment

GitHub Actions builds Docker image on release. Nginx Alpine serves `/dist` with URL rewrite map for clean blog URLs.
