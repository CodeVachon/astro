---
title: Some Thoughts on Setting Up a Workflow
featured: false
description: A key component to DevOps is setting up and maintaining a workflow fordevelopers. It's not all about automation and statistics. Having a developmentbackground comes in nice and handy, but system operations is valuable too. Ifyou don't have that experience behind you, find an experienced developer and/orsystems administrator to work with on your workflow.Step 1 - Analyze What You're Already Doing.Lets start by taking some time to analyze your current process. Unless you are aone man shop
image: ./../../assets/blog/devops.jpg
date_orig: 2016-02-29T16:00:00.000-05:00
date: 2016-02-29
draft: false
tags: ["devops"]
---

A key component to DevOps is setting up and maintaining a workflow for developers. It's not all about automation and statistics. Having a development background comes in nice and handy, but system operations is valuable too. If you don't have that experience behind you, find an experienced developer and/or systems administrator to work with on your workflow.

## Step 1 - Analyze What You're Already Doing.

Lets start by taking some time to analyze your current process. Unless you are a one man shop (and I find it hard to believe even if you are) you are already working with some kind workflow for your development. It might just be opening a file in notepad and ftp it to server, or a more complicated workflow using a repository and continuous integration. Identify all the steps from start to finish, then take some time to identify which parts work, the parts that could use improvement, and the parts that just need to go.

This should be a high level discussion, and doesn't need the input of your entire development team. As the people working to implement a workflow, you (or someone helping in the process) should have knowledge required to move forward. If you are part of a larger team, chances are that there are no shortage of comments as what needs to be improved.

## Step 2 - Identify the Tools You're Using.

Identify the tools you have. List out everything thing from issue tracking, repositories, to editors. Any virtualizaions like [Vagrant](https://www.vagrantup.com/?ref=blog.christophervachon.com) and [Docker](https://www.docker.com/?ref=blog.christophervachon.com) should be listed here as well. You can even get as far as task automation systems like [Grunt](http://gruntjs.com/?ref=blog.christophervachon.com) or [Gulp](http://gulpjs.com/?ref=blog.christophervachon.com), and preprocessors like [LESS](http://lesscss.org/?ref=blog.christophervachon.com) and [CoffeeScript](http://coffeescript.org/?ref=blog.christophervachon.com).

If you are not using a repository, this is definitely the time to start. There are several free services available including what is probably the most popular tool, [GitHub](http://www.github.com/?ref=blog.christophervachon.com). If you are interested in having your own locally hosted service, you can use something like [GitLab](http://gitlab.org/?ref=blog.christophervachon.com) to handle that, but again, there are several other solutions available for that. But git is not your only options for a repository, just the most popular, take some time to research the options available to you and your team.

Once you have the tools you are using identified, find what you need to close any holes, or what you can update/upgrade/remove. Is the code editor you are using the best ones for your needs?

## Step 3 - Workflows.

Even if you are just a small one man shop, your workflow should start with some kind of documented request. In the simplest forms, you can use what ever issue management is available for your repository management system. This request can be a bug report or a request for a new feature, and should be identified as such. That'll help you when identifying priorities and planning for future iterations.

You're organizations complexity and requirements will dictate what comes next, but a typical workflow will consist of creating a new branch off of your stable code branch, making your changes on that branch, and merge that branch back into stable code to be deployed or distributed.  Your workflow would then be completed by closing the request the started the workflow.

### Example Workflow.

This workflow represents a typical small online project.

-   Susie finds a bug in the system, and creates an issue on the GitHub Repository.
-   Trevor sees Susie's issue, and starts to work on the issue. After getting any additional information needed from Susie, he marks the request as in progress. He creates a new branch off of the master branch and names it after the request.
-   Trevor resolves the issue, and pushes his branch back up to GitHub.  He then creates a `pull request` to merge his work into master to be deployed.
-   Samantha, the project leader, reviews the change Trevor made, and accepts the `pull request` merging the fix into the master branch. This triggers a deployment process which updates the live product.
-   Trevor verifies his fix, and closes the request. This informs Susie of the update.

Susie is your requester, Trevor is your Developer, and Samantha is your Senior Developer or Project Leader.  Depending on the systems you put into place, this can scale very easily.  However it starts to break down as soon as you add multiple projects due to a lack of clarity. This is where you want to think about what tools you want use with your workflow. It's not a simple matter of spending more gets you a better system. You need to evaluate your entire workflow, and those who are expected to interact with it.

For example; We have three different Work Management Systems: [Jira](https://www.atlassian.com/software/jira?ref=blog.christophervachon.com), [Wrike](https://www.wrike.com/?ref=blog.christophervachon.com), and [Trello](https://trello.com/?ref=blog.christophervachon.com). These all take in issues/tasks/requests into the system, and allow you to transition and track work done as part of the issue/task into completion. In this way, all three of these are very effective for workflow management. However, they differ in how that workflow and issues/tasks are managed. It's important to evaluate these and other solutions, their strengths and weaknesses, and how well they fit your scenario and budget.

## Step 4 - Automation.

I am sure you have all seen the meme by now:

<figure class="kg-card kg-image-card"><img src="https://blog.christophervachon.com/content/images/2019/05/automate-all-the-things.jpg" class="kg-image" alt="" loading="lazy"></figure>

This can be a lot of fun, and extremely frustrating at the same time.

Before you jump in, start by looking at your workflow and start with the most repeatable task. It could be anything from code deployments, building shippable code, to running testing scripts. Pick one thing and look at how you can automate.

Three things you should look at:

1.  What will trigger this automation?
2.  How do you make this automation repeatable?
3.  What do you do if the automation breaks?

Most repository management systems will have a Continuous Integration component or plugin which you can leverage to trigger the automation on a repository event such as a push, tag, or a merge request.

Making things repeatable is key, you are going to want to run a single simple command for your automation, and the last thing you are going to want is to have a series of conditionals deciding what happens when. You will want look at configuration and/or environment files where possible. That will allow you to reuse your script with multiple projects.

Ensure you are handling errors and/or failures. The last thing you are going to want to string a testing task followed by an automated deployment only to have the testing fail, and end up deploying broken code. If for any reason something fails, make sure the automation stops, and the people who need to be notified are notified. Do not assume that everything is going to run perfectly every time, that is just a recipe for disaster.

When making your automation scripts, it help to sharping your Bash skills or find someone who has. Most of this work is going to take place in a Linux type environment. Although most of the scripts themselves can be written in many different languages and styles, chances are it'll still be a bash script somewhere that triggers them to fire.

Most important, automate in stages. Do not try to automate your entire workflow in one pass. Find the most repeatable, automate that, test it, tweak it, and move on two the next most repeatable task. The more time you take with each task, typically the more robust it will become, and ultimately, that is what you want to get out of an automation process. Simplicity and Reusability.

## Step 5 - Discuss with your Team.

You have now spent a fare bit of team working on your new workflow, the last thing you want is for your team to reject it outright because they do not like some small part of it.

Your team doesn't need to be involved throughout the entire process, but if you want to have buy in from your team, include them in some decision making, or at the very least, in some of the discussions. Teams will more readily adopt a process in which they feel some ownership of and/or had some say in.

Ultimately, this is what you want. A new workflow should benefit all members of the team involved with it.

## Step 6 - Start Again!

Workflows and Automation are ever changing and evolving, so don't think that the perfect solution for you today is going to be the perfect solution for you tomorrow, or a year from now. You should be re-evaluating your workflow at minimum once a year, if only to show that your workflow is still valid.

This is especially important with the tools you are using. Languages and systems are releasing updates and upgrades on a yearly basis if not faster. It worth evaluating the changes made as they happen before they get away from you. It is very easy to get left behind and find yourself playing catch up.

---

I hope this guideline helps you with a new workflow. Some of these have been hard lessons learned by me over the many workflows I have implemented in my workplace.

If you have any questions, please leave a comment and I'll answer as soon as I can.
