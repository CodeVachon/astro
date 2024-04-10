---
title: React with Gulp, Babel, and Browserify
featured: false
description: Recently I have started working with React  for a prototype for an upcoming project. I have found a large community outthere, and have started using Browserify , Babel, and Gulp  to streamline the process oftranspiling the react code.However I have found it slightly frustrating that with most of the workflows Ihave found, that my with poor working knowledge of react at this time, thatbrowse
image: https://blog.christophervachon.com/content/images/2019/05/bg-react-1.jpg
date_orig: 2016-05-06T16:00:00.000-04:00
date: 2016-05-06
draft: false
tags: ["web-development", "react"]
---

Recently I have started working with [React](https://facebook.github.io/react/) for a prototype for an upcoming project. I have found a large community out there, and have started using [Browserify](http://browserify.org/), [Babel](http://babeljs.io/), and [Gulp](http://gulpjs.com/) to streamline the process of transpiling the react code.

However I have found it slightly frustrating that with most of the workflows I have found, that my with poor working knowledge of react at this time, that browserify bundle method was crashing and kicking me out of `gulp watch` and `browser sync`.

This was driving me nuts, so I did some research and have amended what was the working files I had started from. This took a fair of scrounging to get work out, which is why I am writing this post.

I have added 2 components to the setup.

## Bundle Error Handling

Adding this small bit of code to the begining of the pipe allowed for a graceful stop when a transpil error was found.

```
browserify('...', {}).bundle().on('error', function (err) {
  console.error(err.toString());
  this.emit("end");
})
```

## JSX File Handling

I also wanted to clarify my files, and seeing as though react uses `jsx` instead of `js` (not a requirement by the way, just a lot nicer to do), I wanted to use the `jsx` file extension and syntax highlighting schemes (atom has more than a few of them available).

However, I found that `babel` could not natively find the imported files when using `import`.  This was solved with the following configuration.

```
var bundler = browserify('src/jsx/app.jsx', {
  extensions: ['.js', '.jsx'],
  debug: true
});
```

## Final Setup

With these found and added, here is my resulting `package.json` and `gulp.babel.js` files.
