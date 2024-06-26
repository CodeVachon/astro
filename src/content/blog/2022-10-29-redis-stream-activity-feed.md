---
title: Redis Stream Activity Feed
featured: false
description: I created a new Concept Project utilizing Redis Streams to create an Activity Feed
image: ./../../assets/blog/photo-1474835409173-5dc81aae3faa.jpg
date_orig: 2022-10-29T21:13:43.000-04:00
date: 2022-10-29
draft: false
tags: ["devops", "github", "redis"]
---

I recently built a demo project for the purpose of testing the usage of [Redis](https://redis.io/) as an activity feed of recent changes to a system. As the project this proof of concept already uses [Redis](https://redis.io/) in multiple capacities, we wanted to try to utilize it in this capacity to maintain the current dependency stack.

## Redis Stream

I chose to use [Redis Streams](https://redis.io/docs/data-types/streams/) for multiple reasons:

1.  I can set a Maximum Length of the Stream.
2.  I select from the last ID natively with the Stream.
3.  A Redis Stream is Optimized for this exact use case.

## The Project Overview

The project itself is in [NextJS](https://nextjs.org/) utilizing a single  [API endpoint](https://github.com/CodeVachon/feed-testing/blob/main/src/pages/api/feed.ts) for the Redis Connection. I set up a `POST` action to add a new record to the Stream and a `GET` method to retrieve the latest items of the feed. A simple interface was developed to interact with the feed through the `API` endpoint.

You can check out the full concept project here: [@CodeVachon/feed-testing](https://github.com/CodeVachon/feed-testing)
