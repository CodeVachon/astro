---
title: Next Version
featured: false
description: I created a Node.js based Command Line Interface tool for creating and updating a Node Projects Version.
image: https://blog.christophervachon.com/content/images/2019/05/next-version.png
date_orig: 2019-05-27T21:48:45.000-04:00
date: 2019-05-27
draft: false
tags: ["devops", "web-development", "git"]
---

It's a common practice in many languages and workflows to create Release Branches to be merged into Staging and/or Production branches. To me automate my workflow, I recently created and published a Node based CLI (Command Line Interface) Tool to help create my Release Branches based on the current version of the application in the master branch of the repository.

## What does this Application Do?

The application follows this workflow.

-   Confirm the Project Path
-   Ask the User the type of Release to Create
-   Ask the User if they want to create and push a Branch
-   If Not on the Master Branch - Checkout master
-   Do a Git Pull to ensure you have have latest copy
-   If creating a new Branch - Confirm the Name, Create, and Checkout
-   Update the version number in the package.json file
-   If applicable and able - Update the ChangeLog
-   If a new branch was created - Push to Origin

## Why did I create this?

I wanted a quick way to ensure that this normally manual task was performed the same way each time.

---

If you interested, you can checkout the project in my GitHub at [github.com/liaodrake/next-version](https://github.com/liaodrake/next-version?ref=blog.christophervachon.com) or on my [Personal NPM Registry](https://npm.christophervachon.com/-/web/detail/@christophervachon/next-version?ref=blog.christophervachon.com).
