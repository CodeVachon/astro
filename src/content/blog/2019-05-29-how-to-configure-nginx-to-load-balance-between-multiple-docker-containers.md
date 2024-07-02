---
title: How to configure Nginx to load balance between multiple Docker containers
featured: false
description: A brief exploration of using Nginx as a load balancer for multiple docker containers.
image: ./../../assets/blog/photo-1542464734-5690b15c420a.jpg
date_orig: 2019-05-29T08:40:00.000-04:00
date: 2019-05-29
draft: false
tags: ["devops", "docker"]
---

One of the things I wanted to showcase with my online profile rebuild was a zero downtime deployment. Updating without any downtime is very important in development operations because it can directly affect an end-users experience with the application.

Ideally, in the grander scheme, this would be handled with redundant load balancers, servers, and data services. That can get to be very pricey and time-consuming. Far more so than I wanted to spend on a proof of concept. So I opted to simplify my application down to load balancing between 2 docker containers.

> Note: This is not a Step By Step Guide. I assume that the reader knows and understands how to access a server and administer Nginx and Docker.

> Note: Although this article pertains to Node Application running in a Docker Container, it does still apply to other applications.

## The Docker Containers

In my case, I am using a Node application running on Port `3030`, and I want to have two (or more) copies of my application running. However, as a general rule in computer networking, you can not have multiple applications running on a single port. Docker allows us to solve this problem using Port Mappings.

Port Mappings allows us to map an unused port such as `7070` on the host system to port `3030` for the running application in the container. All traffic that would hit port `7070`, in this case, would be piped through to port `3030` in the container for the application to consume. This same principle allows us to run a second container based on the same image on another port such as `7071`. We use this method to create multiple containers that can send traffic.

## The Nginx Configuration

This implementation is going to be a simple setup of Nginx to send traffic to our containers as a proxy server. In short, we are going to use it to listen to HTTP traffic on port `80` (the default web browsing port) to send that traffic to out containers.

### Step 1  - Sending traffic to one container.

Our first step is to start sending traffic to one of our containers. We start by creating a new configuration in our Nginx `sites-enabled` directory.

```
$ cd /etc/nginx/sites-enabled/
$ touch mysite.conf
```

We then add the following to our `mysite.conf` file.

```
server {
    listen 80;

    server_name mysite.com;

    location / {
        proxy_pass localhost:7070;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
    }
}
```

We are telling Nginx to listen to port `80` and any traffic asking for `mysite.com` to our localhost port `7070` (our docker container). The `proxy_set_header` values are used to send the requests original information as part of the request. When you enable this configuration and restart Nginx, you should start seeing traffic hit your first container.

### Step 2 - Sending traffic to multiple containers

Sending traffic to multiple containers follows the same principle as the previous step with one addition. We are going to add an Upstream to our configuration. Let's update `mysite.conf` to look like this:

```
upstream site-containers {
    server 0.0.0.0:7070;
    server 0.0.0.0:7071;
}

server {
    listen 80;

    server_name mysite.com;
    location / {
        proxy_pass https://site-containers;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
    }
}
```

Notice that we added a new definition for an upstream that we named site-containers. The bare minimum this requires is a listing of the servers to send traffic. You can list as many or as few servers/containers as you require. By default, Nginx uses a `round-robin` method to distribute traffic evenly across all specified upstreams.

The other change in our server definition is to the `proxy_pass`, which now points to our newly created upstream.

Save and reload Nginx. You should see traffic now being evenly distributed evenly between your containers.

## How does this help with Zero Downtime Deployments?

The primary purpose of distributing traffic across multiple environments is to spread resource cost amongst multiple nodes. A secondary side-effect is that if one of those nodes becomes unavailable, the system will send traffic to the remaining healthy nodes. We can use this principle in our deployments by removing and replacing our old container with the updated container one at a time.

Take into consideration a system load balanced between two containers (`ContainerA` and `ContainerB`). During regular running, the system distributes traffic evenly between `ContainerA` and `ContainerB`. Our deployment process would start by shutting down `ContainerA`. The load balancers send traffic to `ContainerB` while `ContainerA` is unavailable. Once `ContainerA` is replaced and running, the system does the same for `ContainerB` while it sends traffic to `ContainerA`.

An interesting side-effect of this method is that for a brief period, you could potentially have multiple versions of your application running in your production environment. However, so long as you do not introduce any significant changes to the system, an update should appear seamless to the end user.
