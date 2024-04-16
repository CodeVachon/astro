---
title: What's my IP Address
featured: false
description: I have recently been giving a new 15inch MacBook Pro by the office, and havespent a fair bit of time moving things over from a MacMini to it to be my newprimary console. Although there are several tools available to transition fromone mac to another, I have decided to do this as a fresh/clean install as themini has been around for 4 years. It's also allowed me to mark down everythingfor a new on-boarding process I am starting.One of the main issues in switching from a desktop unit to a la
image: ./../../assets/blog/Screen-Shot-2019-09-13-at-09.59.07.png
date_orig: 2016-10-11T16:00:00.000-04:00
date: 2016-10-11
draft: false
tags: ["devops"]
---

I have recently been giving a new 15inch MacBook Pro by the office, and have spent a fair bit of time moving things over from a MacMini to it to be my new primary console. Although there are several tools available to transition from one mac to another, I have decided to do this as a fresh/clean install as the mini has been around for 4 years. It's also allowed me to mark down everything for a new on-boarding process I am starting.

One of the main issues in switching from a desktop unit to a laptop is that I now longer have a dedicated IP address (although we are working on that). Every time I need to share what I am working on, I will need to give out my IP address which will now change each time I change wifi networks in the office.

Getting your IP address on macOS is not a complicated process. You can get it from the Network Panel in your settings. Alternatively, you can get it from the console (terminal).

```
# Get My IP Address
$ ifconfig
lo0: flags=8049<UP,LOOPBACK,RUNNING,MULTICAST> mtu 16384
	options=1203<RXCSUM,TXCSUM,TXSTATUS,SW_TIMESTAMP>
	inet 127.0.0.1 netmask 0xff000000
	inet6 ::1 prefixlen 128
	inet6 ####::1%lo0 prefixlen 64 scopeid 0x1
	nd6 options=201<PERFORMNUD,DAD>
gif0: flags=8010<POINTOPOINT,MULTICAST> mtu 1280
stf0: flags=0<> mtu 1280
en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
	ether ##:##:##:##:##:##
	inet6 ####::####:####:####:####%en0 prefixlen 64 optimistic secured scopeid 0x4
	inet ####.###.###.### netmask 0xffffff00 broadcast ###.###.###.###
	nd6 options=201<PERFORMNUD,DAD>
	media: autoselect
	status: active
en1: flags=963<UP,BROADCAST,SMART,R
...
```

This will produce a long dump of data into your console.  It will inform you of all possible connections your device can made, and various statuses.  You are typically going to look for something along the lines of `inet ###.###.###.### netmask 0xffffff00 broadcast ###.###.###.###`.  The first block of numbers will be your IP Address.

But who wants to look through all of that?  How can we simplify this? Lets pipe the return of `ifconfig` into `grep` to narrow our results.

```
$ ifconfig | grep inet
	inet 127.0.0.1 netmask 0xff000000
	inet6 ::1 prefixlen 128
	inet6 ####::1%lo0 prefixlen 64 scopeid 0x1
	inet6 ####::####:####:####:####%en0 prefixlen 64 optimistic secured scopeid 0x4
	inet ###.###.###.### netmask 0xffffff00 broadcast ###.###.###.###
...

$ ifconfig | grep inet | grep broadcast
	inet ###.###.###.### netmask 0xffffff00 broadcast ###.###.###.###
```

Awesome, now we have narrowed down the line we want.  Now we can use `awk` to give us just the value we want.

```
$ ifconfig | grep inet | grep broadcast | awk '{print $2}'
###.###.###.###
```

Now we have the value we want.  Let's create an alias to run this when ever we need it. Use an editor to edit your `.bash_profile` or `.zshrc` and add this to the bottom.

```
alias ip='ifconfig | grep inet | grep broadcast | awk '\''{print $2}'\'''
```

Now we can just type `ip` into our console anytime we need to find our IP address.

```
$ ip
###.###.###.###
```

Hope someone finds this helpful.
