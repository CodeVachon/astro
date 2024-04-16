---
title: SCSS Mixin for Media Queries
featured: false
description: I created a SCSS Mixin for creating media queries based on a keywords.
image: https://images.unsplash.com/photo-1468070454955-c5b6932bd08d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ
date_orig: 2019-05-14T21:38:13.000-04:00
date: 2019-05-14
draft: true
tags: ["web-development", "scss"]
---

While updating my online presence, I needed to create multiple media queries for the style sheets. This gets to be very tedious to do of course, even in a pre-compiler like [SCSS](https://sass-lang.com/).

Doing a little digging around, I found that SCSS has a Map function, which got me thinking about passing a label into a mixin to create my media queries. This lead me into several new areas in SCSS I had yet to dive into.

This was the Result of that.
