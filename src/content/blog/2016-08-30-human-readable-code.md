---
title: Human Readable Code
featured: false
description: I have recently spent a great deal of time reviewing code from externaldevelopers. Some of it is good, some of it is rough, some of it makes my headhurt. Ultimately, if the code produces the expected result, I tend to let thingsslide to be included as part of a later refactor if needed, but this leads me tomy topic of the day; Human Readable Code.No longer do we live in an age where we need to consider how a computer is goingto process a block code, and as such, code for the compiler in t
image: ./../../assets/blog/keyboard.jpg
date_orig: 2016-08-30T16:00:00.000-04:00
date: 2016-08-30
draft: false
tags: ["web-development", "devops"]
---

I have recently spent a great deal of time reviewing code from external developers. Some of it is good, some of it is rough, some of it makes my head hurt. Ultimately, if the code produces the expected result, I tend to let things slide to be included as part of a later refactor if needed, but this leads me to my topic of the day; Human Readable Code.

No longer do we live in an age where we need to consider how a computer is going to process a block code, and as such, code for the compiler in the most efficient way possible. We have more than 64kb to play with. This is especially true in web development.  We now develop in groups of 4 or more as well as in distributed teams. Communication and clarity are key in these types of en4444onments.

So why is it I am continuously seeing this?

```
let thisValue = _getBooleanValue();
if (thisValue !== false) { _doThis(); }
```

This code, although valid, is not particularly readable to human eyes. The main issue here is the double negative: "if not equal to false". Its hard for the brain to comprehend and instantly cause a developer to stop and run the logic in there head step by step. Its far clearer to refactor to code to this:

```
let thisValue = _getBooleanValue();
if (thisValue === true) { _doThis(); }
```

or to make it even easier on the eyes:

```
let valueIsValid = _getBooleanValue();
if (valueIsValid) { _doThis(); }
```

When either of these two statement is read, it's extremely clear what the intent of the conditional is here. It does not cause a slowdown in your reading to process what is actually going on.

This is what I am talking about when I refer to human readable code. It's code written for a developer to read first, and a compiler second. Other developers can quickly read through the code, and understand exactly what is suppose to be happening, and why it is happening that way.

So please... when you are coding, think about how readable it is. It'll make your co-developers much happier in the long run!
