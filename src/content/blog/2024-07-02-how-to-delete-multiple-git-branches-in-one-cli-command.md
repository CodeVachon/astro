---
title: How to Delete Multiple Git Branches in One CLI Command
description: In this post I show you how to delete multiple git branches in one command with a filter prefix.
date: 2024-07-02
tags:
    - git
    - github
image: ../../assets/blog/git-blow-up-branches.png
featured: false
draft: false
---

Today I was cleaning out some repositories of some branches that I no longer needed. I had a bunch of branches that started with `task/` that I wanted to delete. I could have gone through and deleted each one individually, but that would have taken a while. Instead, I found a way to delete all of them in one command.

```sh
git branch -D `git branch --list 'task/*'`
```

This command will delete all branches that start with `task/`. The `-D` flag is used to force delete the branches. If you want to be prompted before deleting each branch, you can use the `-d` flag instead.

I hope this helps you clean up your repositories a little faster!
