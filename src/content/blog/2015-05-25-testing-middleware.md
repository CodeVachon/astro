---
title: Testing Middleware
featured: false
description: Recently I wrote a small custom piece of middleware for an express applicationto consume on its requests. It takes a query parameter and reworks it for lateruse in the event loop. Nothing too fancy or overly complicated.But as is the good practice, and because this was for a production application,I wanted to test this bit of middleware with mocha . Buthow?A brief google search did not return to me any relevant information, so that'swhat prompted this post.Writing
image: https://images.unsplash.com/photo-1512851685250-bfa0aa982a1c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ
date_orig: 2015-05-25T16:00:00.000-04:00
date: 2015-05-25
draft: false
tags: ["web-development", "devops"]
---

Recently I wrote a small custom piece of middleware for an express application to consume on its requests. It takes a query parameter and reworks it for later use in the event loop. Nothing too fancy or overly complicated.

But as is the good practice, and because this was for a production application, I wanted to test this bit of middleware with [mocha](http://mochajs.org/). But how?

A brief google search did not return to me any relevant information, so that's what prompted this post.

## Writing Middleware

Middleware works off of a promise event loop.  When a task is completed, its expected that something tell the framework to move on to the next event in the event loop. In [express](http://expressjs.com/), and indeed with most node frameworks, middleware assumes that are going to pass in a minimum three arguments (`request`, `response`, and `next`), and that the last argument is the callback or the promise which will tell the framework to fire its next event.

## Testing Middleware

But how do we test the middleware?  Typical mocha with supertest testing makes a call to your application, and evaluates the resulting response.  This isnt what we want to do in this case. We want to test the individual isolated middleware.

What I found to be good result was to manually call the middleware itself and pass in `request`, `response`, and `next`. Fortunately, there is already a module on [npm](https://www.npmjs.com/) called [node-mocks-http](https://www.npmjs.com/package/node-mocks-http) which can be used to quickly setup both `request` and `response` for us to pass into our middleware.

With `request` and `response` mock'd and ready to pass in, the question is how do we test the result of our middleware.  The answer to that is to pass in a callback function as `next` into the middleware.

Because middleware calls the next function by default (or at least it should be), by passing in a function as the `next` argument, we are telling the system run our callback instead of running the next item in what would be the event loop. This means that we can run our actual tests in the `next` callback, and have access to all the resulting changes to our `request` and `response` global variables.

I have written a quick [gist](https://gist.github.com/liaodrake/c91e6108cb7df48ba506) to demonstrate this in action.

## Conclusion

With mocha testing able to run individual tests on middleware, there is absolutely no need for overly complicated testing schemes for your node applications. Middleware makes it easy to inject manageable blocks of code into your event loop make bugs easier to find, your code more easily tested, and of course, more enjoyable to work it.
