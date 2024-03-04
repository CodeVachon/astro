---
title: How to make macOS remember my ssh password
featured: false
description: You can follow these steps to mimic the older functionality of macOS remembering your password between sessions and restarts.
image: https://images.unsplash.com/photo-1523484489927-4aa8bf9a99d8?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ
date_orig: 2017-03-17T16:00:00.000-04:00
date: 2017-03-17
draft: false
tags: ["devops", "web-development", "git"]
---

As part of a recent update to macOS Sierra (formally OSX), git users have started being annoyed by the frequent and sudden request for there ssh key password.

You can follow these steps to mimic the older functionality of macOS remembering your password between sessions and restarts.

```sh
ssh-add -K ~/.ssh/id_rsa
```

_Note: change `id_rsa` to match the you want to have remembered (`id_rsa` is the default)_

```sh
ssh-add -A
```

Add the following to your `~/.ssh/config` file:

```sh
Host *
  UseKeychain yes
  AddKeysToAgent yes
  IdentityFile ~/.ssh/id_rsa
```

If the file does not exists, create an empty file for it.

---

As git version 2.10.x, you can also set a key per project using the following command.

```sh
git config core.sshCommand "ssh -i ~/.ssh/id_rsa -F /dev/null"
```

Note that you would still replace the \`id_rsa\` with the key you wanted to use with that repository.

---

Original Sources content by:

> Apple purposely changed the behaviour for ssh-agent in macOS 10.12 Sierra to no longer automatically load the previous SSH keys, as noted in this [OpenRadar](https://github.com/lionheart/openradar-mirror/issues/15361?ref=blog.christophervachon.com) and [Twitter discussion](https://twitter.com/lorentey/status/753581927412686850?ref=blog.christophervachon.com). The solution above will mimic the old behaviour of El Capitan and remember your password.
>
> [ChrisJF](http://superuser.com/users/70792/chrisjf?ref=blog.christophervachon.com) on [superuser.com](http://superuser.com/questions/88470/how-to-use-mac-os-x-keychain-with-ssh-keys/1163862?ref=blog.christophervachon.com#1163862)

> Configuration `core.sshCommand`:
> From Git version 2.10.0, you can configure this per repo or globally, so you don't have to set the environment variable any more!
>
> [Flimm](https://superuser.com/users/90668/flimm?ref=blog.christophervachon.com) on [superuser.com](https://superuser.com/questions/232373/how-to-tell-git-which-private-key-to-use?ref=blog.christophervachon.com)
