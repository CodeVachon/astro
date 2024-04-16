---
title: Changing the Origin of your Branch
featured: false
description: Today I learned that you can change the origin of your branch in Git.
image: https://images.unsplash.com/photo-1592928038511-20202bdad1fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDZ8fG9yaWdpbnxlbnwwfHx8fDE2Njk4MzAwOTE&ixlib=rb-4.0.3&q=80&w=2000
date_orig: 2022-11-30T12:45:32.000-05:00
date: 2022-11-30
draft: false
tags: ["git", "devops", "github"]
---

Today I learned that you can change the origin of your branch in Git.

<figure class="kg-card kg-bookmark-card"><a class="kg-bookmark-container" href="https://stackoverflow.com/questions/10853935/change-branch-base"><div class="kg-bookmark-content"><div class="kg-bookmark-title">Change branch base</div><div class="kg-bookmark-description">I've a tree like this: (commit 1) - master \-- (commit 2) - (commit 3) - demo \-- (commit 4) - (commit 5) - PRO and I have to move ...</div><div class="kg-bookmark-metadata"><img class="kg-bookmark-icon" src="https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon.png?v=c78bd457575a" alt=""><span class="kg-bookmark-author">Stack Overflow</span><span class="kg-bookmark-publisher">Ivan</span></div></div><div class="kg-bookmark-thumbnail"><img src="https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon@2.png?v=73d79a89bded" alt=""></div></a></figure>

## Use Case

the Developer was meant to create a bug branch off of a specific patch branch, but did it off of the next minor release.

The concern here is that the Pull Request for the bug branch will contain everything from the Release at the point of branch off which may contain breaking changes.

The Resolution is to rebase the bug branch with the Patch branch changing the origin and thus removing the commits from the Release branch.

```sh
git rebase --onto newBase oldBase feature/branch
```
