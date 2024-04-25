---
title: MySQL, Prisma, and Views
description: Sometimes you need to use a view in your database schema. Here is how we chose to manage views with Prisma.
date: 2024-04-24
tags:
    - database
    - devops
    - mysql
image: ./../../assets/blog/mysql-prisma-and-views.png
featured: false
draft: false
related:
    - 2024-04-23-prisma-mysql-max_prepared_stmt_count
---

Before I start with some of the details, I want to mention that this is not a tutorial on how to create a view in MySQL. This is more about what we did to manage views with Prisma in our project. A lot of this was conceived before the Prisma 4 release, and so some of these concepts may no longer be relevant.

Please refer to the [Prisma documentation](https://www.prisma.io/docs/concepts/components/prisma-client) for the most up-to-date information.

---

Let's start with identifying the problem. In the post I wrote regarding `max_prepared_stmt_count` ([Prisma, MySQL, and max_prepared_stmt_count](/blog/2024-04-23-prisma-mysql-max_prepared_stmt_count)) and how we were hitting the limit, I mentioned that we were using views to help with some of the queries. This was a good solution for us at the time, but we quickly realized that managing views in Prisma was not as straightforward as we had hoped.

## First Problem - How to Query a View

The first issue we encountered was that Prisma does not support views out of the box. But did provide a means of creating raw queries with its client API. Utilizing the `prisma.$queryRaw` method, we were able to access the views in our data effectively.

```ts
import { Prisma } from "@prisma/client";
const prisma = new PrismaClient();

// Assume this is passed in from the client
const params = {
    columns: ["id", "name", "description"],
    isArchived: false,
    orderBy: "name",
    orderDirection: "asc"
};

// Create a function to handle the wether to use AND or WHERE clause
let whereWasUsed = false;
const andWhere = () => {
    if (whereWasUsed) {
        return Prisma.raw(`AND`);
    } else {
        whereWasUsed = true;
        return Prisma.raw(`WHERE`);
    }
};

// Get the data from the view
const tableAlias = "plf";
const feedData = await prisma.$queryRaw<Array<IProjectListRecord>>`
    SELECT DISTINCT
        ${Prisma.raw(params.columns.map((v) => `${tableAlias}.${v}`).join(",\n"))}
    FROM ProjectListFeed ${Prisma.raw(tableAlias)}
    ${
        params.isArchived !== undefined
            ? Prisma.sql`${andWhere()} ${Prisma.raw(tableAlias)}.isArchived = ${extendedWhere.isArchived}`
            : Prisma.empty
    }
    ${
        params.id !== undefined && extendedWhere.id.length > 0
            ? Prisma.sql`${andWhere()} ${Prisma.raw(tableAlias)}.id IN (${Prisma.join(extendedWhere.id)})`
            : Prisma.empty
    }
    ${Prisma.raw(`ORDER BY ${orderByLabel} ${orderByValue}`)}
`;
```

The resulting query would look something like this:

```sql
SELECT DISTINCT
    plf.id,
    plf.name,
    plf.description
FROM ProjectListFeed plf
WHERE plf.isArchived = ?
ORDER BY name asc
```

Where the `isArchived` value (`?`) is passed to via the prepared statement params. We felt it was important to maintain the use of prepared statements in the system to prevent SQL injection attacks and to help optimize the queries.

## Second Problem - How to Manage Changes

Initially, we used the native prisma migration files to manage the creation and modifications of the views that we now had in the system. This worked only for a short time before we started running into issue of conflicts with modifications to the views.

Multiple views were being created and updated as functionality was added to the system and view needed to have additional columns added, removed, or corrected due to an error with a linked table.

Because multiple developers were working on the system at the same time, we started running into conflicts with the views. Where one developer would create a migration file to add a column to a view, and another developer would create a migration file to and unrelated column to the same view. If the developers had not pulled, communicated or worked off the same starting view, both migrations would miss the other's changes and the system would be left in an inconsistent state. Only the last migration to be applied would be in effect.

```sql
-- Migration File 1
CREATE OR REPLACE VIEW ProjectListFeed AS
SELECT
  -- ...
  j.addedColumnA
FROM Project p
LEFT JOIN Job j ON p.id = j.projectId

-- Migration File 2
CREATE OR REPLACE VIEW ProjectListFeed AS
SELECT
  -- ...
  j.addedColumnB
FROM Project p
LEFT JOIN Job j ON p.id = j.projectId
```

The resulting view would only have `addedColumnB` and `addedColumnA` would be lost which result in a third migration file to be created to add `addedColumnA` back to the view. After a few months, we had generated over 90 migrations files for the views alone. This was not sustainable and we needed to find a better way to manage the views.

Prisma however, did not have a way to manage views natively. So we had to create a custom solution to manage the views in the system. We created a `views` folder in the `prisma` directory and created a file for each view that we needed to manage. This file contained the SQL for the view and a method to create the view in the database. This allowed for the changes to be tracked by git and greatly reduced the number of issues we were having with deploying the updated views to the databases.

The next step to this was to create a method to apply the views to the database. We created a script that would read the files in the `views` directory and apply the views to the database. This script would be run as part of the deployment process and would ensure that the views updated after the native migrations were run.

```ts
// prisma/updateViews.ts
const mysql2 = require("mysql2/promise");
const fs = require("node:fs");
const path = require("node:path");

const mysqlConnectionSettings = {
    host: process.env.MYSQL_URL ?? "",
    port: process.env.MYSQL_PORT ?? 3306,
    database: process.env.MYSQL_DATABASE ?? "",
    user: process.env.MYSQL_USER ?? "",
    password: process.env.MYSQL_PASSWORD ?? ""
};

const run = async () => {
    console.log("Searching for SQL files...");
    const fullPath = path.join(__dirname, "views");
    const allFiles = fs.readdirSync(fullPath);
    const files = allFiles.filter((file) => file.endsWith(".sql")).sort();

    console.log(`Found ${files.length} Files at ${fullPath}`);
    console.log(
        `\n\rConnecting to MySQL "${mysqlConnectionSettings.host}:${mysqlConnectionSettings.port}/${mysqlConnectionSettings.database}" ...`
    );

    const connection = await mysql2.createConnection(mysqlConnectionSettings);
    console.log("Connected to MySQL\n\r");

    await connection.connect();

    const disconnect = async () => {
        console.log("\n\rDisconnecting from MySQL...");
        await connection.end();
    };

    try {
        const totalFiles = files.length;
        const pad = String(totalFiles).length;
        for (let i = 0; i < totalFiles; i++) {
            const file = files[i];
            console.log(`Applying File ${String(i + 1).padStart(pad, "0")} of ${totalFiles}`, file);
            const filePath = path.join(fullPath, file);
            const sql = fs.readFileSync(filePath, "utf-8");

            await connection.query(sql);
        }
    } catch (error) {
        console.error(error);
        await disconnect();
        throw error;
    }

    await disconnect();
};

/**
 * Checks if the given error is related to database connection.
 *
 * @param {Error} error - The error object to check.
 * @returns {boolean} Returns true if the error is related to database connection, false otherwise.
 */
function isErrorConnectionRelated(error) {
    const errorCodes = [
        "ECONNREFUSED", // Connection refused: The server refused the connection request.
        "ENOTFOUND", // Not found: The server could not be found.
        "ER_BAD_DB_ERROR", // Bad database error: The specified database does not exist.
        "ER_ACCESS_DENIED_ERROR", // Access denied error: The user does not have permission to access the database.
        "ER_CON_COUNT_ERROR", // Too many connections: The server has reached the maximum number of connections it supports.
        "ER_HOST_NOT_PRIVILEGED", // Host not privileged: The host from which you are connecting is not permitted to connect to the MySQL server.
        "ER_SERVER_SHUTDOWN", // Server shutdown in progress: The server is currently shutting down.
        "ER_PASSWORD_EXPIRED" // Your password has expired: To log in you must change it using a client that supports expired passwords.
    ];
    return (
        error instanceof Error && error.code && errorCodes.some((code) => error.code.includes(code))
    );
}

run()
    .then(() => {
        console.log("\n\rDone");
    })
    .catch((error) => {
        if (error instanceof Error) {
            if (isErrorConnectionRelated(error)) {
                console.log("Error Connecting to Database.\n\r");
                console.log("Connection Details", {
                    ...mysqlConnectionSettings,
                    password: "******"
                });
            } else {
                console.error(error);
            }
        } else {
            console.error(error);
        }

        process.exit(1); // Exit with error
    })
    .finally(() => {
        process.exit(0); // Exit without error
    });
```

This script would be run as part of the deployment process and would ensure that the views were updated after the native migrations were run. In the event that any error was connection related, that error would be handled differently so that the connection details would not be exposed in the logs.

Because the Prisma Client is Generated, and I did not want to generate the client every time the views needed to be updated, the `mysql2` library was used to directly to connect to the database and apply the changes.

This method worked well for us and we were able to manage the views in the system effectively. We were able to reduce the number of migrations files that were being generated and the number of conflicts that were occurring with the views.
