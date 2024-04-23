---
title: ViTest and TypeScript Paths
description: How to set up TypeScript paths in a ViTest project.
image: ../../assets/blog/flask-paths.png
date: 2024-04-15
tags:
    - test
    - devops
---

While setting up a new project with [ViTest](https://vitest.dev/) and TypeScript, I wanted to use paths defined in the `tsconfig.json` file instead of having to duplicate the list in the `vitest.config.ts` file. Being unable to quickly find a way to do this, I decided to try to import the paths directly from the `tsconfig.json` file and modify those values to the one expected by ViTest.

Here is how I set up TypeScript paths in a ViTest project.

```json
// tsconfig.json
{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "~lib/*": ["src/lib/*"],
            "~assets/*": ["src/assets/*"],
            "~ui/*": ["src/ui/*"]
        },
        "types": ["vitest/globals"]
    }
}
```

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import tsconfig from "./tsconfig.json";
import path from "path";

// Create an alias object from the paths in tsconfig.json
const alias = Object.fromEntries(
    // For Each Path in tsconfig.json
    Object.entries(tsconfig.compilerOptions.paths).map(([key, [value]]) => [
        // Remove the "/*" from the key and resolve the path
        key.replace("/*", ""),
        // Remove the "/*" from the value Resolve the relative path
        path.resolve(__dirname, value.replace("/*", ""))
    ])
);

export default defineConfig({
    resolve: {
        alias
    }
});
```
