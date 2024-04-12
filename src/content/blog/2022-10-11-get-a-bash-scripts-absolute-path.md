---
title: Get a Bash Scripts Absolute Path
featured: false
description: How to find a bash script absolute path without the use of realpath.
image: ./../../assets/blog/photo-1562504208-03d85cc8c23e.jpg
date_orig: 2022-10-11T15:43:00.000-04:00
date: 2022-10-11
draft: false
tags: ["devops"]
---

While migrating an application from one CD process to another, I have been updating my deployment scripts for the application. Part of that has been updating the workflows and Dockerfiles, but also the actual scripts I use to start the docker containers themselves.

I wanted to make the new scripts are generic and reusable as possible so that they were not dependent on a path structure for linking to relatively linked files and paths. eg: A Docker volume mapping does not like relative paths, and because the script can be called from anywhere on the server, the `pwd` command is not a good solution. The `realpath` command is also not consistently available across all platforms.

I eventually came across this [stackoverflow](https://stackoverflow.com/questions/4774054/reliable-way-for-a-bash-script-to-get-the-full-path-to-itself?ref=blog.christophervachon.com) post, which gave me the solution I was looking for

```shell
#!/bin/bash
# /opt/deployment/restart.sh

SWD="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
docker run -d \
    -p $THISPORTNO:$GUESTPORT \
    --env HOST_NAME=$CONTAINER \
    --restart always \
    --volume $SWD/data:/www/data \
    --log-opt max-size=1m \
    --log-opt max-file=3 \
    --name $CONTAINER \
    $IMAGENAME:$TAG || exit 1
```

The `SWD` variable is the absolute path to the file running containing the script.
