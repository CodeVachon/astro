---
title: NGINX Location Rewrite
featured: false
description: with my change over to the Ghost  Blogging platform from myown custom engine, I had one major problem.The URL's from my old blog did not directly match the URL's of the new blogSpecifically, the blog path.In my custom built blog, I had entered all the blog posts to sit under the /blog/ route. Ghost does not do this, nor does it directly allow me to modifythat path without modifying Ghost itself. Because the intention of thistransition is to utilize an existing communi
image: https://images.unsplash.com/photo-1504930268766-d71549a36ec2?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ
date_orig: 2015-11-20T16:00:00.000-05:00
date: 2015-11-20
draft: false
tags: ["devops"]
---

with my change over to the [Ghost](http://ghost.org/) Blogging platform from my own custom engine, I had one major problem.

The URL's from my old blog did not directly match the URL's of the new blog

Specifically, the blog path.

In my custom built blog, I had entered all the blog posts to sit under the `/blog/` route. Ghost does not do this, nor does it directly allow me to modify that path without modifying Ghost itself. Because the intention of this transition is to utilize an existing community driven open source system that I could contribute to, but not have to entirely myself, I do not want to modify the Ghost codebase directly because of the conflicts which would arise when updating.

Fortunately, the remainder of the post `URI` remains the same between the old platform and the current. This means that I do not have to create a mapping for the blog posts.  Which also means that I can abstract this redirect out to the proxy level.

## NGINX

Because I am using [nginx](https://www.nginx.com/) to proxy the Ghost server, I can use its configuration file to handle this URL change for me.

What I need to do is to permanently redirect this URI `/blog/2015/08/14/when-is-a-good-time-to-use-a-promise` to this URI `/2015/08/14/when-is-a-good-time-to-use-a-promise`.  As you can see, the only difference between the two is the word `blog` at that start. We can use this simple regular expression (regex) `^/blog/(.*)$` to change the first string to the second.

Next up, I need to modify the nginx site configuration file.  In most installations, you should be able to find it in the `/etc/nginx/sites-enabled` directory on your server. It should look something like this:

```
server {
    listen 80 default_server;
    listen [::]:80 default_server ipv6only=on;

    server_name my_ghost_blog.com; # Replace with your domain

    root /usr/share/nginx/html;
    index index.html index.htm;

    client_max_body_size 10G;

    location / {
        proxy_pass http://localhost:2368;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
    }
}
```

We then add another `location` definition to our server to watch for the `/blog/` URI.  Nginx is able to handle a case insensitive lookup with the `~*` tag as part of the definition.

Inside that definition, we want to setup a `rewrite` command which excepts 3 arguments.

1.  A regex capture string
2.  A regex replacement string
3.  A rewrite type value (permanent, rewrite)

putting all of that together, we should end up with following to add to our server definition.

```
location ~* ^/blog/ {
    rewrite /blog/(.*)$ /$1 permanent;
}
```

We are telling nginx to case insensitively match any URI path starting with `/blog`, and to than use regex to permanently redirect to the new URI without `blog` prefixed to the path.

our resulting configuration file now looks something like this:

```
server {
    listen 80 default_server;
    listen [::]:80 default_server ipv6only=on;

    server_name my_ghost_blog.com; # Replace with your domain

    root /usr/share/nginx/html;
    index index.html index.htm;

    client_max_body_size 10G;

    location / {
        proxy_pass http://localhost:2368;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
    }

    location ~* ^/blog/ {
        rewrite /blog/(.*)$ /$1 permanent;
    }
}
```

we can now restart nginx with a service command (`service nginx restart`) and test it out: [/blog/2015/11/20/nginx-url-rewrite](https://blog.christophervachon.com/blog/2015/11/20/nginx-url-rewrite)
