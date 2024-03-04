---
title: Band of Brothers Inspired Layout
featured: false
description: With November 11th quickly coming, I've been watching a lot of Band of Brothers.If you are unfamiliar with that series, it is about the American 101st AirBourne and their trials in the second world war.  I would highly recommend it toanyone as it is very well done.At the start of each episode, the screen is black, and the episode title andnumber as displayed in a simple white text with a singular red line separatingthe two elements.  It is this clean and simple display that I am wanting t
image: https://images.unsplash.com/photo-1580974511885-b30fd231388c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxMTc3M3wwfDF8c2VhcmNofDMxfHxBcm15JTIwd3cyfGVufDB8fHw&ixlib=rb-1.2.1&q=80&w=2000
date_orig: 2014-11-08T16:00:00.000-05:00
date: 2014-11-08
draft: false
tags:
    - web-development
---

With November 11th quickly coming, I've been watching a lot of Band of Brothers. If you are unfamiliar with that series, it is about the American 101st Air Bourne and their trials in the second world war.  I would highly recommend it to anyone as it is very well done.

At the start of each episode, the screen is black, and the episode title and number as displayed in a simple white text with a singular red line separating the two elements.  It is this clean and simple display that I am wanting to mimic.

<figure class="kg-card kg-image-card"><img src="https://s3.amazonaws.com/christophervachon/articles/banner_css.jpg" class="kg-image" alt="CSS Banner" loading="lazy"></figure>

The layout for this is extremely simple. I start with an `article` tag, and within that, I add a `header` tag.  The header block, I style black, with a white foreground colour.  Inside the header, I add in my Main Title `h1` tag, and below that, I add my published date inside a `p` tag. I then use CSS to add a red bottom border to the H1 tag, and we are more a less done.

This seemed a little too easy though. I wanted to jazz it up at least a little.  So I decided that this would be a good change to play with CSS Key Frames.

Key Frames allow you to specify an animation in CSS. You should note however, that keyframes and animations are not fully supported by all browsers. So do not depend on these for your finial product. Use them as a means to enhance your design, not support it.

In this case, I decided that I wanted to have the red line "fade in".  So we start with our current layout which has our red line already in place. This is our default display, so this is what unsupported browsers will see by default. As the first key frame in our animation, we set out lines colour value to match the black background.  We then set our final frame, which sets out line colour back to red.

<figure class="kg-card kg-embed-card"><iframe id="cp_embed_vwGne" src="https://codepen.io/liaodrake/embed/preview/vwGne?height=300&amp;slug-hash=vwGne&amp;default-tabs=html,result&amp;host=https://codepen.io" title="Band of Brother Inspired Article Format" scrolling="no" frameborder="0" height="300" allowtransparency="true" class="cp_embed_iframe" style="width: 100%; overflow: hidden;"></iframe></figure>

As you can see (if your browser supports animations), the line appears to fade in. What it actually is doing is fading from the background colour, to red.

I know this isn't a huge project, but it does elegantly show how you can use CSS animations to enhance your design.
