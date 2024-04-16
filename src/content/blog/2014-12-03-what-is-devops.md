---
title: What is DevOps
featured: false
description: Several Months ago, I attended a conference in Toronto called DevOpsDays. The purpose is like any other technical conference, ameans to get like minded individuals together and to share new ideas. In thiscase, DevOps.I have long counted myself as the DevOps Engineer of the company I work for, andhave had a lot of issue getting the company to believe that DevOps is a realthing. It doesn't help when goggling "DevOps" gives you a large and varyingdescription of the r
image: ./../../assets/blog/devops-2.jpg
date_orig: 2014-12-03T16:00:00.000-05:00
date: 2014-12-03
draft: false
tags: ["devops"]
---

Several Months ago, I attended a conference in Toronto called [DevOpsDays](http://devopsdays.org/). The purpose is like any other technical conference, a means to get like minded individuals together and to share new ideas. In this case, DevOps.

<figure class="kg-card kg-image-card"><img src="https://s3.amazonaws.com/christophervachon/articles/2014/12/banner_DevOpsDays.jpg" class="kg-image" alt="DevOpsDays" loading="lazy"></figure>

I have long counted myself as the DevOps Engineer of the company I work for, and have had a lot of issue getting the company to believe that DevOps is a real thing. It doesn't help when goggling "DevOps" gives you a large and varying description of the role and what it should entail.  Just to add to the confusion, here is my take on the role.

## What is the definition of DevOps?

[Wikipedia](http://en.wikipedia.org/wiki/DevOps) has this to say on the topic.

DevOps (a portmanteau of "development" and "operations") is a software development method that stresses communication, collaboration and integration between software developers and Information Technology(IT) professionals.

And this is pretty much my interpretation of the role. But what does this actually mean?

For me, the largest part of the role is the communication portion. Communication between systems, teams, departments, and varying level of management. A good DevOps system should be able to maintain constant and clear communication between all these levels.

## Communication

Just keeps things simples, lets say we have 4 groups to work with.

1.  Developers -- Builds New Features
2.  Quality Control -- Tests Those Features
3.  Operations -- Maintains Those Features
4.  Management -- Requests New Features

This is a fairly common development cycle. Client asks for product. product is developed by developers. product is tested by quality control. product is released and maintained by operations. client asks for a new product. so on and so forth.

In the company I work for, It would be the role of DevOps to ensure that the developers have the tools they need to do the job and can easily and effectively communicate to quality and management the state of the product.  Quality would then know when the product is ready for them to take over and verify all testing is done and that the product meets the requirements set forth by management. Once complete, operations gets a clear communication that it can deploy and begin maintaining the product. Management is then notified of the release, and of any bugs or issues with the released product, and with that information, can make decisions on how to move forward.

The key to all of that is clear communication between all of the departments. How this communication is carried out is a matter of preference of the organization.

## Integration between Developers and IT

The other big piece of this is the integration of technologies with developers and the operations department, and the key to this is automation.

Automate All The Things!

This is where things get to be really fun for a guy like me. Scripting as much as possible to make the life of developers and operations as easy as possible. Its where we incorporate tools like [Grunt](http://gruntjs.com/) (Watch, Less, Uglify, Minify etc...) and [Vagrant](https://www.vagrantup.com/) for the developers. For operations and QA, we deploy automation tools like Git and Continuous Integration (CI) to handle automated testing and deployments on the result of that testing.

And will all these tools, we want to also automate some of the communication on the results of these tools. With webhooks, we can easily integrate tools like [Slack](http://slack.com/) or HipChat. At the end of a build, [Jenkins](http://jenkins-ci.org/) can made to send the result of the build (or deployment) into these communication tools in addition to using an email notification.

## Conclusion

DevOps may seem like a nice to have for many organizations. But having that dedicated person to ensure these system integrate nicely, and to maintain that level of open communication between systems and teams is essential to any growing business.
