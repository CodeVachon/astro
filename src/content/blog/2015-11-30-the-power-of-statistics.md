---
title: The Power of Statistics
featured: false
description: Over the past couple of weeks I have been exploring Application Monitoring toolswhich has resulting in me playing with StatsD  and Graphite .  I quickly found a Docker  Container, and plugged in an NPM library called node-statsd into an Express RESTful api to see what kind of data I could get.At firs
image: ./../../assets/blog/photo-1518186285589-2f7649de83e0.jpg
date_orig: 2015-11-30T16:00:00.000-05:00
date: 2015-11-30
draft: false
tags: ["devops"]
---

Over the past couple of weeks I have been exploring Application Monitoring tools which has resulting in me playing with [StatsD](https://github.com/etsy/statsd) and [Graphite](https://graphite.readthedocs.org/en/latest/).  I quickly found a [Docker](https://www.docker.com/) Container, and plugged in an [NPM](https://www.npmjs.com/) library called [node-statsd](https://www.npmjs.com/package/node-statsd) into an [Express](https://expressjs.com/) RESTful api to see what kind of data I could get.

At first, I started with only posting API hits.  This was accomplished by sending a `count` into StatsD.

```
var StatsD = require('node-statsd'),
    statsDClient = new StatsD()
;
statsDClient.increment('api.count');
```

This is neat to be able to watch, but ultimately not very useful without more broken down data.  Specifically, I want to be able to watch how long my api calls are taking. This is easily done with the `timing` metric.

```
var StatsD = require('node-statsd'),
    statsDClient = new StatsD()
;
statsDClient.timing('api.timing', duration);
```

Which when coupled with Express becomes:

```
var express = require('express'), // Our FrameWork
    app = express(),
    StatsD = require('node-statsd'),
    statsDClient = new StatsD()
;

app.use(function(request, response, next) {
    var thisStart = +new Date();
    response.on("finish", function() {
        var thisEnd = +new Date();
        statsDClient.timing('api.timing', thisEnd - thisStart);
    });
    next();
});

app.listen(8080, function() {
    console.log("Server Running on Port: 8080");
});
```

so now at the end of every request, I have a timing metric being sent into StatsD.  Where this starts to get cool is that now I can easily track how long my requests are taking verses how many requests are being made to the api.

**For example**

If I have 100 requests per second hitting my api, and each requests takes an average of 50ms to run, then I should expect that at 200 requests per second that I should see only a marginal slowdown in my requests, lets say 55ms.  However, if that increase is actually 100ms, than I know for certain that I have a performance issue somewhere.

But how do we track that down?

I am first and foremost a programmer, and that means that I want to accomplish this kind of thing without having to drop a stats plug into every single express route.

My quick solution to this is to make use of above express middleware. First I break out my path into an array, this will allow me to quickly join together a path to send into StatsD. it'll also allow me to apply a stat to every level of the API so to that I can watch endpoint groupings.  I end up with something like this

```
var express = require('express'), // Our FrameWork
    app = express(),
    StatsD = require('node-statsd'),
    statsDClient = new StatsD()
;

app.use(function(request, response, next) {
    var thisStart = +new Date();
    request.path.split("/").forEach(function(thisPath) {
        if (thisPath.length) {
            pathArray.push(thisPath);
        }
    });

    for (var i=0, x=pathArray.length; i<x; i++) {
        var _thisPathKey = pathArray.slice(0,i+1).join(".");
        statsDClient.increment(_thisPathKey+'.count');
    }

    response.on("finish", function() {
        var thisEnd = +new Date();
        for (var i=0, x=pathArray.length; i<x; i++) {
            var _thisPathKey = pathArray.slice(0,i+1).join(".");
            statsDClient.timing(_thisPathKey+'.timing', thisEnd - thisStart);
        }
    });
    next();
});

// App Routes are Lists here
// ...

app.listen(8080, function() {
    console.log("Server Running on Port: 8080");
});
```

So now on every API Hit, the system will record details for every level of the endpoint which will allow you to quickly analyze where your resources are being tied up.

As a note of caution, this can result in a lot of data very quickly. I would highly recommend if you are going to run this type of thing in production that you utilize the `sampling` argument to filter down the shear volume of data.
