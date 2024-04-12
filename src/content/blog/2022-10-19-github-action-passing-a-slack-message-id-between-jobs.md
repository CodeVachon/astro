---
title: GitHub Action - Passing a Slack Message ID between Jobs
featured: false
description: How to pass a Slack Message ID (or any primitive value) between multiple GitHub Action Jobs.
image: ./../../assets/blog/photo-1521575107034-e0fa0b594529.jpg
date_orig: 2022-10-19T22:00:00.000-04:00
date: 2022-10-19
draft: false
tags: ["devops", "github", "github-actions"]
---

While migrating a project into [GitHub](https://github.com/?ref=blog.christophervachon.com), I have been updating the CI/CD processes of the repositories to use [GitHub Actions](https://docs.github.com/en/actions?ref=blog.christophervachon.com).

One of the updates I wanted to make was to push notifications into a [Slack](https://slack.com/?ref=blog.christophervachon.com) Channel to notify users of the status of deployments but to do so without flooding the channel with multiple notifications of the same event.

Fortunately, the [Slack API](https://api.slack.com/?ref=blog.christophervachon.com) allows you to update a message in a channel. There are already several public actions to post a message into Slack and update them, so I will not go too deep into them. But what I got a little hung up on was how to pass the `ID` of the message being updated between multiple GitHub Action Jobs.

The first step we need to take is to define our action workflow

```yaml
# ./.github/workflows/build-and-deploy.yml
name: Production Build and Deploy Release

on:
    release:
        types: [published]

jobs:
    build:
        runs-on: ubuntu-latest
        steps:
            - name: Build
              run: echo "build step"
            - name: Push to Registry
              run: echo "push to registry step"

    deploy:
        runs-on: ubuntu-latest
        needs: "build"
        steps:
            - name: Deploy
              run: echo "deploy step"
```

This Action runs three steps over 2 jobs. Next, we'll push a message into Slack using the [voxmedia/github-action-slack-notify-build@v1](https://github.com/voxmedia/github-action-slack-notify-build?ref=blog.christophervachon.com) action.

```yaml
# ./.github/workflows/build-and-deploy.yml
name: Production Build and Deploy Release

on:
    release:
        types: [published]

jobs:
    build:
        runs-on: ubuntu-latest
        steps:
            - name: Notify Slack Building
              id: slack
              env:
                  SLACK_BOT_TOKEN: ${{ secrets.SLACK_SECRET }}
              uses: voxmedia/github-action-slack-notify-build@v1
              with:
                  channel: ${{ secrets.SLACK_CHANNEL }}
                  status: BUILDING
                  color: warning

            - name: Build
              run: echo "build step"
            - name: Push to Registry
              run: echo "push to registry step"

    deploy:
        runs-on: ubuntu-latest
        needs: "build"
        steps:
            - name: Notify Slack Deploying
              id: slack
              env:
                  SLACK_BOT_TOKEN: ${{ secrets.SLACK_SECRET }}
              uses: voxmedia/github-action-slack-notify-build@v1
              with:
                  channel: ${{ secrets.SLACK_CHANNEL }}
                  status: DEPLOYING
                  color: warning

            - name: Deploy
              run: echo "deploy step"

            - name: Notify Slack Complete
              id: slack
              env:
                  SLACK_BOT_TOKEN: ${{ secrets.SLACK_SECRET }}
              uses: voxmedia/github-action-slack-notify-build@v1
              with:
                  channel: ${{ secrets.SLACK_CHANNEL }}
                  status: DONE
                  color: success
```

This will push three messages into Slack, but we can capture the message ID and share it between each slack call.

```yaml
# ./.github/workflows/build-and-deploy.yml
name: Production Build and Deploy Release

on:
    release:
        types: [published]

jobs:
    build:
        runs-on: ubuntu-latest
        steps:
            - name: Notify Slack Building
              id: slack-building
              env:
                  SLACK_BOT_TOKEN: ${{ secrets.SLACK_SECRET }}
              uses: voxmedia/github-action-slack-notify-build@v1
              with:
                  channel: ${{ secrets.SLACK_CHANNEL }}
                  status: BUILDING
                  color: warning

            - name: Build
              run: echo "build step"
            - name: Push to Registry
              run: echo "push to registry step"

    deploy:
        runs-on: ubuntu-latest
        needs: "build"
        steps:
            - name: Notify Slack Deploying
              id: slack-deploy
              env:
                  SLACK_BOT_TOKEN: ${{ secrets.SLACK_SECRET }}
              uses: voxmedia/github-action-slack-notify-build@v1
              with:
                  channel: ${{ secrets.SLACK_CHANNEL }}
                  status: DEPLOYING
                  color: warning

            - name: Deploy
              run: echo "deploy step"

            - name: Notify Slack Complete
              id: slack-done
              env:
                  SLACK_BOT_TOKEN: ${{ secrets.SLACK_SECRET }}
              uses: voxmedia/github-action-slack-notify-build@v1
              with:
                  message_id: ${{ steps.slack-deploy.outputs.slack_message_id}}
                  channel: ${{ secrets.SLACK_CHANNEL }}
                  status: DONE
                  color: success
```

this will now Update the \`slack-deploy\` message to the \`slack-done\` message giving us two messages in Slack instead of three.

An important point to mention here is that each Job will run in an isolated environment. Jobs can be made aware of the status of other jobs, but they can not share values or artifacts between themselves without some kind of intervention. This is why my `Build` job pushes the artifact to a registry to be utilized and deployed by other jobs. For Primitive values like `strings`, `numbers`, and `booleans` we can define outputs on a job. Subsequent Jobs and "need" that job will then have access to those outputs.

```yaml
# ./.github/workflows/build-and-deploy.yml
name: Production Build and Deploy Release

on:
    release:
        types: [published]

jobs:
    build:
        runs-on: ubuntu-latest
        outputs:
            slack_message_id: ${{ steps.slack-building.outputs.message_id }}
        steps:
            - name: Notify Slack Building
              id: slack-building
              env:
                  SLACK_BOT_TOKEN: ${{ secrets.SLACK_SECRET }}
              uses: voxmedia/github-action-slack-notify-build@v1
              with:
                  channel: ${{ secrets.SLACK_CHANNEL }}
                  status: BUILDING
                  color: warning

            - name: Build
              run: echo "build step"
            - name: Push to Registry
              run: echo "push to registry step"

    deploy:
        runs-on: ubuntu-latest
        needs: "build"
        steps:
            - name: Notify Slack Deploying
              id: slack-deploy
              env:
                  SLACK_BOT_TOKEN: ${{ secrets.SLACK_SECRET }}
              uses: voxmedia/github-action-slack-notify-build@v1
              with:
                  message_id: ${{ needs.build.outputs.slack_message_id}}
                  channel: ${{ secrets.SLACK_CHANNEL }}
                  status: DEPLOYING
                  color: warning

            - name: Deploy
              run: echo "deploy step"

            - name: Notify Slack Complete
              id: slack-done
              env:
                  SLACK_BOT_TOKEN: ${{ secrets.SLACK_SECRET }}
              uses: voxmedia/github-action-slack-notify-build@v1
              with:
                  message_id: ${{ needs.build.outputs.slack_message_id}}
                  channel: ${{ secrets.SLACK_CHANNEL }}
                  status: DONE
                  color: success
```

The Build Job now specifies an output named `slack_message_id` and is defined as the output of the `message_id` from the `voxmedia/github-action-slack-notify-build@v1` action.

The Deploy Job that "needs" build can now access the `` `slack_message_id` `` value and update the original message in Slack.

The team has found it very helpful to know when and in what state things are happening without having to flood a channel with multiple messages regarding the same process.
