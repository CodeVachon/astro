---
title: Script to Close a Port on MacOS
featured: false
description: A very handy Bash alias for web developers to close an open port on macOS.
image: ./../../assets/blog/photo-1512380924987-27e737876395.jpg
date_orig: 2018-10-16T16:00:00.000-04:00
date: 2018-10-16
draft: false
tags: ["devops"]
---

A big part of my current role is building and maintaining multiple online publications using similar or multiple port numbers. It's not uncommon for me to have 10 or 12 [VSCode](https://code.visualstudio.com/?ref=blog.christophervachon.com) editors open on across my desktops. As a result, from time to time, I need to simply kill one application's use of a port to start up another one. Rather than toggle through multiple windows, I opted to have a method to quickly shut down an application associated with a port number.

There is also a use case where a watch process (Gulp or Grunt) crashes leaving the required port open as part of a background thread. (I have encountered this with `node-sass` on more than one occasion).

**Important Note**

Some System Level Applications use specific ports to function. Be Cautious when using this command as you could inadvertently shut down your system.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="https://blog.christophervachon.com/content/images/2019/05/ZwuTvFg8gS.gif" class="kg-image" alt="Demo" loading="lazy"><figcaption>Kill the Port</figcaption></figure>

Simply add to the bottom of your `.bashrc` or `.zshrc` file in your home directory (sh: `vi ~/.bashrc`).

```
killport() {
    PID=$(lsof -ti ":$1")
    if [ ! -z "$PID" ]; then
        echo "PORT: $1"
        echo "PID:  $PID"
        kill -9 $PID
        echo "OK!"
    else
        echo "No Process Found running Port $1"
    fi
}
```

And Reload the Window or the Source (`source ~/.bashrc`).

To use the script, simply enter `killport ####` with the port number you need to shutdown.
