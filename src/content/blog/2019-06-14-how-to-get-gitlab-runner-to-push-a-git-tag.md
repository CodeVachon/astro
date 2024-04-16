---
title: How to get GitLab Runner to push a Git Tag
featured: false
description: Some thoughts on getting a Gitlab Runner to deploy tags back to a remote.
image: https://images.unsplash.com/photo-1513407135356-a5276958b57e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ
date_orig: 2019-06-14T20:55:04.000-04:00
date: 2019-06-14
draft: false
tags: ["devops"]
---

A significant part of my development methodology is to use `Tags` for my deployments. Apart from the obvious advantages of marking specific commits as specific versions of your application, it allow allows for the ability to quickly rollback to a previous version of your application. [Gitlab](https://about.gitlab.com/) CI, [CircleCI](https://circleci.com/), and [TravisCI](https://travis-ci.org/) all the ability to be triggered off the creation and push of tag to the repository.

The trick is the automation of the creation and push of your tags. When using GitLab CI, the runner itself is given read-only access to your repository. You can easily use the runner to create a git tag, but it does not have the required access to push that tag back into the origin remote. I have found 2 ways to get around this problem.

## The HTTP Approach

One solution is to create a user in Gitlab which has the required access to push your tag back to origin. You can then use the runner to create a new remote on the local repository. However, there are a few issues with this approach.

1.  You must expose the credentials of your user which has permissions to write to your protected branches.
2.  You must complicate your deployment with logic to add and clean up your remotes.
3.  You must either keep your credentials in your repository, or in a separate script run by your runner. This leads to either a security issue, or a potential drift issue.

## Deployment Keys

Another solution is to setup a deployment key which would allow access to your remote repository. This is setup and works similarly to your own `ssh` keys. While this has a bit of upfront overhead, is does not require the exposure of any credential set and it can be limited a single runner. However, there a few issues with this approach as well.

1.  You must have access to the runner server, and the ability to create an ssh key. This may be beyond the skill or access of the developer.
2.  You would need to either create, or duplicate a key for each runner that requires access.
3.  As of the time of this writing, Gitlab deployment keys are limited to RSA keys.

## In Either Case...

Which ever of these potential solutions works for you. You'll need to start by automating the tag creation process. In my case, I usually develop in [Node.js](https://nodejs.org/en/) which keeps version number in its `package.json` file. Because I am node based, and require node to build my assets, I already have node installed on my runner server. I store the value into a variable. We can then use that variable to set a tag to that version.

```
VERSION=$(node -e "var pkg = require('./package.json'); console.log(pkg.version.toLowerCase());")
git tag -a $VERSION -m "Repo Version $VERSION" master
```

We then create a new remote and push our tags

```
git push myremote --tags
```

Once that is complete, your tag pipeline should begin!
