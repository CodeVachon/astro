---
title: Giving a Presentation with Git Commits
featured: false
description: recently I have been creating and giving presentations on how to use certaintechnologies. Event expanding some to be more like workshops.I decided that rather than writing all my code on the fly while giving thepresentation, which would undoubtedly lead to a number of errors as I go, that Iwould pre-write all the code and stores changes as git commits.This leads me this post.  How to navigate those commits quickly and easilyduring my presentation.My solution was to create three bash al
image: https://blog.christophervachon.com/content/images/2019/05/bg-git.jpg
date_orig: 2017-01-31T16:00:00.000-05:00
date: 2017-01-31
draft: false
tags: ["devops", "git", "web-development"]
---

recently I have been creating and giving presentations on how to use certain technologies. Event expanding some to be more like workshops.

I decided that rather than writing all my code on the fly while giving the presentation, which would undoubtedly lead to a number of errors as I go, that I would pre-write all the code and stores changes as git commits.

This leads me this post.  How to navigate those commits quickly and easily during my presentation.

My solution was to create three bash aliases to store git commands.

1.  Goto the first commit of the git log.
2.  Goto the next commit.
3.  Goto the previous commit.

Which resulted in the following commands

1.  `git checkout $(git rev-list --max-parents=0 --abbrev-commit HEAD)`
2.  `git log --reverse --pretty=%H master | grep -A 1 $(git rev-parse HEAD) | tail -n1 | xargs git checkout`
3.  `git checkout HEAD^1`

I then added the following to my bash profile

```
function git-reset() {
    git checkout $(git rev-list --max-parents=0 --abbrev-commit HEAD)
}

function git-next() {
    git log --reverse --pretty=%H master | grep -A 1 $(git rev-parse HEAD) | tail -n1 | xargs git checkout
}

function git-prev() {
    git checkout HEAD^1
}
```

With this in place, I can now simply enter `git-reset` in my command line to goto the first commit, followed by `git-next` to goto the next commit.  If I need to go back a commit, I can use the `git-prev` command.

These command names made sense to me for my presentations, and do not represent any kind of standard or research done on my part.

Hope someone finds this useful out there.
