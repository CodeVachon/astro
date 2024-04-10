---
title: Promises Versus Callbacks
featured: false
description: Recently I have been asked about the differences between JavaScript Promise (sometimes called a deferred) and a JavaScript Callback. Over the years, we haveseen many implementations of both these types of infrastructure, and even manylibraries which mix and match between to two.The point of both of these types of programming are that they allow you to codeasynchronously by allowing you to perform actions when your active action iscompleted. The main difference between the two is that prom
image: https://images.unsplash.com/photo-1550063873-ab792950096b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxMTc3M3wwfDF8c2VhcmNofDF8fFByb21pc2VzfGVufDB8fHw&ixlib=rb-1.2.1&q=80&w=2000
date_orig: 2015-06-30T16:00:00.000-04:00
date: 2015-06-30
draft: false
tags: ["web-development"]
---

Recently I have been asked about the differences between JavaScript Promise (sometimes called a deferred) and a JavaScript Callback. Over the years, we have seen many implementations of both these types of infrastructure, and even many libraries which mix and match between to two.

The point of both of these types of programming are that they allow you to code asynchronously by allowing you to perform actions when your active action is completed. The main difference between the two is that promises are more event driven and appear more like Object Orientated code (which can give some developers a little more comfort in what they are looking at).

## Rundown of a Promise

These are objects which are returned by the calling method which have several functions passed along with them which act similar to events.  To use the object, you would call it, and pass in anonymous functions into chained events on the object.

```
myFunction(365)
  .done(function(result) {
    console.log(result);
  })
  .fail(function(error) {
    console.error(error);
  })
;
```

In this example; the system executes `myFunction()` with an argument value of `365`. When the function is completed doing what ever it does with the value, it would then trigger the chained `done` anonymous function. If an error had occurred in the function, than it would have triggered the chained `fail` anonymous function. In the event that nether of these chained method are added to the promise being called, than the applicable function simply would not be called.

Most promise library offer several additional functionality such as `.then()` and `.always()` to expand this functionality.

The main advantage to this type of structure, is that it is much easier to block out your code on the front end. It is very clear the functionality that is going to occur on success and on failure.

The main drawback is that it is a little more verbose, and more difficult when coding the module. It is also not natively supported by JavaScript, so you need to include a 3rd party library such as [simply-deferred](https://github.com/sudhirj/simply-deferred) or write your own.

This [Gist](https://gist.github.com/liaodrake/bcbb8f6dad8c68c195ae) shows the usage and testing of this type of module in a simple express application.

## Rundown of a Callback

These are anonymous functions which are passed into you method as usually the last or sole argument. The idea is that the passed in function as an argument would be run as the final step of the method being called.

```
myFunction(365, function callback(error, result) {
  if (error) {
    console.error(error);
  } else {
    console.log(result);
  }
});
```

In this example; the system executes `myFunction()` with two arguments (argument #1 being `365`, and argument #2 being the `function callback`). When the function is completed, it'll pass in a value as an argument into the callback function.

This is where things get fuzzy, and it up to the developer to document and maintain a standard in there module as there is nothing which requires a specified return in your callback. For Instance; there is nothing to prevent me from passing an error object into your callback where you are expecting to receive an integer.

The standard practice for Node and NPM modules is that callbacks will always return a minimum of two arguments, the first argument should always represent and error value, and the second representing a result. Thus the first thing you should do in your callback is check if error is defined, and handle it accordingly.

The advantage of this type of structure is that it natively supported JavaScript. You can code like this right away without needing to install any additional libraries. Its also fairly quick and easy to develop with.

The drawback is that your resulting nested code and start to get really deep. Too many nested code levers gets to be very hard to follow. You can however break your code down into smaller block, but that can have its own challenges.

This [Gist](https://gist.github.com/liaodrake/019d5eb1c31f1866399f) shows the usage and testing of this type of module in a simple express application.

## So Which Should I Use?

Both of these methodologies have there pros and cons, and ultimately, they handle the same functionality in the end. So to answer the question of which you should use depends entirely on what is already being utilized in your project.  If you are using [express](http://expressjs.com/), which uses callbacks, than it makes sense for you to use callbacks to maintain consistency in the project. If you are using jQuery, than you should use promises.

I hope this sheds some light on things for a few people
