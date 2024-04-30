---
title: Get The FULL Query from MySQL Process List
description: This is how to get the Full Query from the MySQL Process List
date: 2024-04-30
tags:
    - database
    - mysql
image: ../../assets/blog/get-the-full-query-from-mysql-process-list.png
featured: false
draft: false
---

Today we had an interesting situation where the CPU on the managed MySQL server suddenly spike to 100% and became unresponsive. The change made to the application seemed relatively benign and we were stumped as to why the server was suddenly spiked.

Thankfully, this was a staging database and not in production, so I was able to reduce the connections to the database to try and narrow down the issue. I closed several connections, and the CPU was still spiked. I closed more connections, the CPU was still spiked. I closed all connections, and the CPU was still spiked. I shutdown the Applications connecting the database and removed all external connections, and the CPU was still spiked.

I took a look at the connection pool, and saw that there was still 40 connections listed to the database. I doubled checked that I had blocked external connections and that I did not have anything running that was connecting to that database apart from my active connection.

I checked the process list and found that they 40 connections where still running the exact same query. I wanted to see what this offending query was, but all I was able to see was the first 100 characters of the query.

```sql
SHOW PROCESSLIST;
```

Clearly I needed to see the full query, so I ran the following command:

```sql
SHOW FULL PROCESSLIST;
```

Which showed me that the offending query was a Prisma Query doing a `SELECT WHERE IN` on a table with over 10,000 values listed. This was causing the CPU to spike as the query was running for over 10 minutes.

We were quickly able to change the query and the CPU resolved itself back to a normal state.

In regards to Prisma, looking through some old issues, I found that there is an `env` variable that can be set limit the number of values that can be passed in a `WHERE IN` query. This is a good practice to prevent this from happening in the future.

```env
QUERY_BATCH_SIZE=1000
```

This may lead to some performance and data issues if you are not careful, but it is a good quick setting to help prevent this from happening in the future.
