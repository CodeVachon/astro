---
title: Helpful Docker Scripts
featured: true
description: I am doing a lot of docker experiments today and needed a few scripts for cleaning up.
image: ./../../assets/blog/photo-1547861291-d91c8454f887.jpg
date_orig: 2017-02-13T16:00:00.000-05:00
date: 2017-02-13
draft: false
tags: ["devops", "docker"]
---

I am doing a lot of docker experiments today and needed a few scripts for cleaning up.

Let me know if you have any other helpful docker scripts.

## Remove All Exited Containers

```
docker rm -f $(docker ps -a | grep Exited | awk '{print $1}')
```

## Remove All Created Containers

```
docker rm -f $(docker ps -a | grep Created | awk '{print $1}')
```

## Remove All Dead Containers

```
docker rm -f $(docker ps -a | grep Dead | awk '{print $1}')
```

## Remove All Unnamed Docker Images

```
docker rmi $(docker images | grep "<none>" | awk '{ print $3 }')
```
