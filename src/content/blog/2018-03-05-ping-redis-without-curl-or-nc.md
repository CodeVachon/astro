---
title: Ping Redis without CURL or NC
featured: false
description: I found this little snippet on Stack Overflow which allowed me to check the Redis connection from inside my container.
image: ./../../assets/blog/photo-1558433916-90a36b44753f.jpg
date_orig: 2018-03-05T16:00:00.000-05:00
date: 2018-03-05
draft: false
tags: ["devops", "redis", "curl"]
---

I recently needed to ping for Redis from a docker container to make sure it was reachable. The issue being that you cant restart a docker container to install anything because the changes will not persists without rebuilding the container.

I found this little snippet on Stack Overflow which allowed me to check the Redis connection from inside my container.

```
exec 3<>/dev/tcp/<YourRedisServerAddress>/6379 && echo -e "PING\r\n" >&3 && head -c 7 <&3
```

assuming you can connect to the server and everything is find, you should be the response `+PONG` to your `PING` endpoint request.

### References

-   [Stack Overflow Answer](https://stackoverflow.com/questions/33243121/abuse-curl-to-communicate-with-redis)
-   [More on Using Bash's Built-in /dev/tcp File (TCP/IP)](https://www.linuxjournal.com/content/more-using-bashs-built-devtcp-file-tcpip)
