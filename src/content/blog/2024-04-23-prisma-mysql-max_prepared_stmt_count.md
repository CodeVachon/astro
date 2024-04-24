---
title: Prisma, MySQL, and max_prepared_stmt_count
description: Over the course of a year, we have been fighting with MySQL and Prisma regarding an error referencing max_prepared_stmt_count. This is how we resolved it.
date: 2024-04-23
tags:
    - database
    - devops
    - mysql
image: ../../assets/blog/max-prepared-statements.png
featured: false
draft: false
---

Over the course of a year, we have been fighting with MySQL and Prisma regarding an error referencing `max_prepared_stmt_count`. This error occurred when we pushed an update to our production application with a seemingly light sql query.

```sh
PrismaClientUnknownRequestError: Error occurred during query execution:
ConnectorError(ConnectorError { user_facing_error: None, kind: QueryError(Server(ServerError { code: 1461, message: "Can't create more than max_prepared_stmt_count statements (current value: 16382)", state: "42000" })) })
    at RequestHandler.request (/app/node_modules/.pnpm/@prisma+client@3.15.2_prisma@3.15.2/node_modules/@prisma/client/runtime/index.js:49026:15)
    at async PrismaClient._request (/app/node_modules/.pnpm/@prisma+client@3.15.2_prisma@3.15.2/node_modules/@prisma/client/runtime/index.js:49919:18)
    at async /app/apps/api/dist/application.js:370:50 {
  clientVersion: '3.15.2'
}
```

The application would run for a few mins before crashing with a `500` error. The Application would restart, the database connection would be re-established, and the application would run for a few more minutes before crashing again. This cycle would continue until we rolled back the update.

Upon investigation of the error message, we found that the error was related to the `max_prepared_stmt_count` variable in MySQL. This variable is used to limit the number of prepared statements that can be created on the server which had a default value of `16,384`. The important factor here is that this value is a global constraint and not a session constraint. This means that the value is shared across all connections to the MySQL server. The more sessions created created, the sooner this limit would be hit.

We contacted our managed database provider, and they informed us that there was nothing that they could do on there end to increase this value. So we were left to ourselves to find a solution.

We immediately went into the documentation to learn what exactly a prepared statement was and how it was being used in our application, and what connection options we could set to limit the number of prepared statements being created.

-   [MySQL: 15.5 Prepared Statements](https://dev.mysql.com/doc/refman/8.0/en/sql-prepared-statements.html)
-   [Prisma: Raw Queries](https://www.prisma.io/docs/orm/prisma-client/queries/raw-database-access/raw-queries)
-   [Prisma: Database Setup and Configuration](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections/connection-pool)

Understanding that a prepared statement is a query that is parsed, compiled, and stored in the database, we decided to investigate the queries that were being executed. We found that Prisma was creating a prepared statement for every query that was executed. So the first thread we followed towards a resolution was to reduce the number of dynamic queries in the system, thus reducing the number of prepared statements created.

One of the main queries being his was the listing and joining data from multiple tables. We found that Prisma was creating a prepared statement for every query that was executed. The way an ORM in this case is to create a prepared statement for every joined record.

As an Example, consider the following request:

```ts
const records = prisma.user.findMany({
    include: {
        Avatar: true,
        Classification: true,
        Profile: true
    }
});
```

This query would create 4 prepared statements, one for each of the included tables. So our solution was to reduce the number of included tables in the query. We did this by creating a view in the database that joined the tables and then querying the view instead of the tables. This effectively reduced the number of prepared statements created for this request from 4 to 1.

However, Prisma does not support views natively, so we had to create a reusable method for selecting the dataset and supporting changes and migrations. I'll post more on that in a separate post.

Once we had reduced the number of prepared statements being created, we were able to push the update to production without any issues. The application ran smoothly and we were able to run the application for another few months before we hit the limit again.

The change made at this time was that we had added another production server to the cluster. This meant that the number of connections to the database had doubled. At the time, we had been saving costs by maintaining a single managed database server for all environments. So our next solution was to create a separate database server for the production environments. This created more work for the creation and maintenance of the database, but effectively returned the system to a stable state.

Another few months went by without any issue. We did a significant refactor to the application and added a few more features. We were confident that the issue was resolved. However, we hit the limit again. Running off the previous knowledge, we spent a few days optimizing our queries and views to reduce the number of prepared statements being created. This time, we were able to reduce the number of prepared statements being created by 50%. This was a significant improvement, but we were still hitting the limit cause a 500 series every for every 1 in 50 requests.

We were at a loss. We had optimized the queries and views as much as we could. We had separated the production database from the other environments. We had even increased the number of connections to the database. We were at a loss. We had to find a solution.

I began to investigate this issue further, looking for settings that I could effect on the managed database servers. Scouring the prisma documentations for any information that could help. I eventually found a [GitHub Issue: Prisma: #6872 - Ballooning of Prepared_stmt_count on MYSQL](https://github.com/prisma/prisma/issues/6872) that mentioned the problem, and some had mentioned about a query parameter I could add to the connection string that is listed as an option in the base connection library. I looked deeper in the documentation of that library and found the option to set a `statement_cache_size` parameter. It turns out that the default value for this parameter is `1000` instead of an expected `35`.

This parameter is used to limit the number of prepared statements that are cached per connection, and can even be used to disable the caching of prepared statements. This was the solution we had been looking for. We added the parameter to the connection string and set the value to a low number which would allow the application to cache the most used queries, but drop any others. This effectively disabled the caching of prepared statements and allowed us to run the application without any issues.

```bash
# .env
DATABASE_URL=mysql://${USER}:${PASSWORD}@${HOST}:${PORT}/${DATABASE}?connection_limit=10&statement_cache_size=7
```

When setting this value, it is important to note that the value is per connection. So if you have a connection pool of 10 connections, and you set the value to 7, you will have a total of 70 prepared statements cached across all connections. This is a good value to start with, but you may need to adjust this value based on the number of connections and the number of queries being executed. The more connections you allow to the database, the fewer prepared statements you should cache.

In our case, we have multiple instances of the application connecting the database utilizing the same environment variables. So our max cached statements to be is `${CONNECTION_LIMIT} * ${STATEMENT_CACHE_SIZE} * ${NUMBER_OF_INSTANCES}`. It is also very important to note that the `max_prepared_stmt_count` is a `global` variable and is not affected by the `statement_cache_size`. It is **NOT** limited to the the user connecting the database, or the database schema being connected to. If you have multiple datasets on the same database server, you will need to account for the number of prepared statements being created across all datasets, users, and schemas.
