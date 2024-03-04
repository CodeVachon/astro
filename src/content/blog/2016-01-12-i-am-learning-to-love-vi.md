---
title: I am learning to love VI
featured: false
description: I will admit that in my early developer days, that I was extremely resistant todoing anything command line. My thought was that we lived in an age where wecould easily make GUI so why wouldn't we create and use them. Now will toolslike GIT, LESS, SASS, Grunt, Gulp, Vagrant, and Docker (just to name a few) Ihave learned to love working in the command line and cant imaging workingwithout it.That being said, the one thing about command line that has always bothered was vi (or vim). I never
image: https://blog.christophervachon.com/content/images/2019/09/Screen-Shot-2019-09-13-at-10.08.08.png
date_orig: 2016-01-12T22:05:00.000-05:00
date: 2016-01-12
draft: false
tags: ["devops"]
---

I will admit that in my early developer days, that I was extremely resistant to doing anything command line. My thought was that we lived in an age where we could easily make GUI so why wouldn't we create and use them. Now will tools like `GIT`, `LESS`, `SASS`, `Grunt`, `Gulp`, `Vagrant`, and `Docker` (just to name a few) I have learned to love working in the command line and cant imaging working without it.

That being said, the one thing about command line that has always bothered was `vi` (or `vim`). I never liked the minimalist non-intuitive workflow, and giving that most system I used already had `nano` (or some version of it), I always preferred to use it.

However, now that I am doing more and more DevOps work, I am using `vi` more and more, and I have to admit that I have come to love using this editor. Especially once I got into turning on syntax highlighting and line numbers. The more I use it, the more I find, the more I like it.

With that said, I am going to share a few of my favourite features.

## My Favourite Features

### 1\. Line Numbers

The main thing I love about modern editors is being able to see the line numbers. It just makes it a lot easier to tell other people which line of code they need to edit, or that you are referring too.

To enable line numbers per instance: `:set number`

### 2\. Colour and Syntax

Syntax Highlighting is by far one of the most useful tools for a programmer. It quickly allows them to find syntax errors by simply glancing at colour changes in the code structure.

To enable line numbers per instance: `:syntax on`

### 3\. Goto Line Number

One of the most used features by me is being able to go directly to a line number. If a debug is telling me I have an error on line 234, it's a huge pain to have to scroll down 234 lines in a terminal window where you do not have a scroll bar or use of a mouse.

To go directly to a line number in an instance: `:[linenumber]` (eg `:234`).

In addition, you tell vim to open a file at a certain line number: `vi +[linenumber] file.path` (eg: `vi +234 file.path`)

---

All these settings can be turned on globally as well via a global settings files in your home directory (`~/.vimrc`).

There are also a good number of features which I have not mentioned which are also very beneficial. Checkout this repository on [Github](https://github.com/?ref=blog.christophervachon.com) at [amix/vimrc](https://github.com/amix/vimrc?ref=blog.christophervachon.com).
