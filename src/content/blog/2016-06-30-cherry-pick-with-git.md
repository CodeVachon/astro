---
title: Cherry-Pick with Git
featured: false
description: Sometimes things don't quite work out as planned. Okies, lets be honest, Most ofthe time things don't work out as planned from the start. But with a properworkflow, this is not always detrimental.For one of my office projects, I had a transition over to DoubleClick forPublishers (DFP). This was completed, and entered into a merge release for thestart of the month along with a few other patches and small features. However,that transition was to be pulled from the upcoming release for inter
image: ./../../assets/blog/bg-git-1.jpg
date_orig: 2016-06-30T16:00:00.000-04:00
date: 2016-06-30
draft: false
tags: ["devops", "git"]
---

Sometimes things don't quite work out as planned. Okies, lets be honest, Most of the time things don't work out as planned from the start. But with a proper workflow, this is not always detrimental.

For one of my office projects, I had a transition over to DoubleClick for Publishers (DFP). This was completed, and entered into a merge release for the start of the month along with a few other patches and small features. However, that transition was to be pulled from the upcoming release for internal readiness reasons.  Therefor, we have to pull all the DFP related commits from the release.

There are several ways to go about this, but for me the simplest was to create a new release and `cherry-pick` the commits were keeping into.

## Step 1 - Find the Commits you want to keep

First we need to identify the commits that we want to keep. If you do to no which ones you want off hand, you can use `log` to list out all your commits.

```
git log
```

**Tip**: press the `q` key to exit git log

Copy and paste the commit hashs you want to keep in a text file.

## Step 2 - Create your New Branch

Next we will want to create your new branch for your release.

```
git checkout master
git checkout -b New-Release
```

## Step 3 - Cherry Pick your commits

In our new branch, we will then want to `cherry-pick` your  selected commits in.  For each commit hash, run the following.

```
git cherry-pick <commit-hash>
```

**Note**: that your commits have now moved into your new branch and removed from its old branch.

Our commits have now been separated, run your tests and check your code to make sure that you have everything you need. Than we are good to go.
