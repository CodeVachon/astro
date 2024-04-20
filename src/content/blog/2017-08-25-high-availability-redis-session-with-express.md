---
title: High Availability Redis Session with Express
featured: false
description: Recently we have needed update our session solution with Redis to use Redis as a cluster, increasing the availability of our sites in the event that we have to cycle our Redis servers.
image: ./../../assets/blog/photo-1563639115997-1eac7f574628.jpg
date_orig: 2017-08-25T16:00:00.000-04:00
date: 2017-08-25
draft: false
tags: ["devops", "redis"]
---

Recently we have needed update our session solution with Redis to use Redis as a cluster, increasing the availability of our sites in the event that we have to cycle our Redis servers.

The current solution connect to a single Redis service, however we can not update that system because it'll take down systems that are dependent on that system. Yes, this is very bad practice, and this is why we are now addressing it.

The solution moving forward is to create a cluster of Redis servers using [Redis Sentinel](https://redis.io/topics/sentinel) (that setup is outside the scope of this post). We then need to update our systems to use sentinel as a client instead of connecting directly to Redis.

To do this, we needed to change from using Redis module to create a client to using the [redis-sentinel](https://www.npmjs.com/package/redis-sentinel) module. Because sentinel returns a Redis Client as if I was manually creating one from the redis module, the update was simply to swap out Redis clients. We went from this

```js
// app.js
const express = require("express"),
    app = express(),
    session = require("express-session"),
    redisStore = require("connect-redis")(session),
    redis = require("redis"),
    redisClient = redis.createClient({
        host: "...",
        port: 6379
    });

//...

app.use(session({
    secret: "...",
    store: new redisStore({
        client: redisClient,
        ttl: 900
    })
}));

//...
```

to this

```js
// app.js
const express = require("express"),
    app = express(),
    session = require("express-session"),
    redisStore = require("connect-redis")(session),
    sentinel = require("redis-sentinel"),
    sentinelMaterName = "mymaster",
    sentinelEndpoints = [
        { host: "...", port: 26379 },
        { host: "...", port: 26379 },
        { host: "...", port: 26379 }
    ]
    redisClient = sentinel.createClient(sentinelEndpoints, sentinelMaterName);

//...

app.use(session({
    secret: "...",
    store: new redisStore({
        client: redisClient,
        ttl: 900
    })
}));

//...
```

Upon testing, we have found that the system will fail over gracefully, though it will throw an error into the express error handler when swapping masters. We setup out systems to handle that error by reloading the page. The system will hold all requests until it establishes a new Redis connection.
