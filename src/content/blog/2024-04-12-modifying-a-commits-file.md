---
title: Modifying a commit's file
description: How to modify a file in a commit
date: 2024-04-12
tags: git
---

I have recently made a commit and I realized that I added files and changes that I not mean to stage. This is a common issue that stems from a bit of code blindness where I'll just use the `git commit -am "<msg>"` command and not review the changes that I am committing.

To fix this issue, I can use the following commands to modify the commit.

```bash
git reset --soft HEAD^
```

This will reset the commit and keep the changes staged. I can then unstage the files that I do not want to commit and then commit the changes again using the original commit details.

```bash
git commit -c ORIG_HEAD
```

This will open the commit message in the editor and I can modify the message if needed. Once I save and close the editor, the commit will be updated with the new changes.

If the commit was pushed to a remote repository, I will need to force push the changes to update the remote repository.

```bash
git push origin <branch> --force
```
