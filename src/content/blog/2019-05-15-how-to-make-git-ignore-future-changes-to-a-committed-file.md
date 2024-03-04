---
title: How to make GIT ignore future changes to a committed file.
featured: false
description: A quick command to tell Git to ignore future changes to a tracked file.
image: https://blog.christophervachon.com/content/images/2019/05/bg-git-2.jpg
date_orig: 2019-05-15T22:36:07.000-04:00
date: 2019-05-15
draft: false
tags: ["devops", "git"]
---

As I am currently working on my online profile, I have started adding in connections to various api's and integrations. Most of the credentials for these will be kept in environment variables, so they do not need to be recorded in my GIT repository.

With that said, I still need to have this values in my application while I am developing. This raises the risk of accidentally committing my credentials which becomes a pain later on to pull them back out (I know this from experience...).

The best solution I have found has been to commit a file with empty values for these keys, commit that file without the values, and then proceed to tell git not to track any future changes to that file.

Here's how we do that.

```
git update-index --skip-worktree [path-to-file]
```

To allow git to track changes to the file again, we use this

```
git update-index --no-skip-worktree [path-to-file]
```

And to see which files are currently being skipped, we can use this

```
git ls-files -v . | grep ^S
```
