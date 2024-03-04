---
title: As a general rule when programming...
featured: false
description: As a General Rule When Programming. If you think your code is going to cause a WTF moment a year from now re-evaluate your solution.
image: https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ
date_orig: 2016-01-21T16:00:00.000-05:00
date: 2016-01-21
draft: false
tags: ["web-development", "devops"]
---

Today I received a request to production to resolve a but where a form would break if an invalid country code was passed in as part of an address.

The solution that was proposed was to modify the validation scripts to accept the improper values as valid in order to load the form. However, this validation code is used globally and would then allow all other addresses validations to accept those values system wide. This proposed solution was thus rejected and changed to resolve the issue with the broken form itself.

This lead to the following which I thought needed to be shared.

<figure class="kg-card kg-embed-card"><blockquote class="twitter-tweet"><p lang="en" dir="ltr">As general rule when <a href="https://twitter.com/hashtag/programming?src=hash&amp;%3Bref_src=twsrc%5Etfw&amp;ref=blog.christophervachon.com">#programming</a>. If you think your code is going to cause a <a href="https://twitter.com/hashtag/wtf?src=hash&amp;%3Bref_src=twsrc%5Etfw&amp;ref=blog.christophervachon.com">#wtf</a> moment a year from now: re-evaluate your solution.</p>— Christopher Vachon (@CodeVachon) <a href="https://twitter.com/codevachon/status/690273905433538561?ref_src=twsrc%5Etfw&amp;ref=blog.christophervachon.com">January 21, 2016</a></blockquote><script async="" src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></figure>
