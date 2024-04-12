---
title: Docker Run Internal Container Command
featured: true
description: How to run a command in a Docker container that is not the main running command of the container.
image: ./../../assets/blog/photo-1595587637401-83ff822bd63e.jpg
date_orig: 2022-10-12T17:20:45.000-04:00
date: 2022-10-12
draft: false
tags: ["devops", "docker"]
---

TIL that you can run a command in a docker container without it explicitly running.

## The Use Case

I had a docker container that what restarting at startup because it did not have the required SQL tables needed to run. I had a script that would run the migration files after the container started, but that does not work for a fresh install.

## The Trials

**Attempt #1:** Use \`docker exec\` to enter the container and run the required migration script.

**Result:** This failed because the container was still continuously restarting.

**Attempt #2:** Try to extract the scripts from the container to run externally.

**Result:** this failed because the container would not stay running long enough to successfully mount a volume.

**Attemp #3:** Use \`docker run --entrypoint\` to change the startup script.

**Result:** Success! I was able to have docker to start the container and run the migration script inside.

## Example

```sh
docker run \
  --rm \
  --entrypoint <CMD> \
  <ImageName>:<Tag> <CMD ARGS>

```

In this specific case, I was able to have `yarn` run a `prisma:deploy` script

```sh
docker run \
  --rm \
  --env-file $SWD/api.env \
  --env-file $SWD/apiMigration.env \
  --entrypoint yarn \
  $IMAGENAME:$TAG prisma:deploy || exit 1
```

This allowed me to greatly simplify my container deployment workflow and have data migrations happen before the actual codebase needed to run.
