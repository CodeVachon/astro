---
title: CSS3 :nth-last-of-child Demo
featured: false
description: This is a neat trick I learned for CSS3 to select out the last box of a grid off loading elements and set its width to fill the remaining box.  For this, I amusing a CSS pseudo-class called :nth-last-of-type(). This pseudo-class will select out the last element of the attached element in the containing element. So in a grid of 9 span tags in a div tag, the selector will pick out the the box.whats nice about selector is that it will accept arguments.
image: ./../../assets/blog/photo-1587303150910-b05077a4fb45.jpg
date_orig: 2014-09-05T16:00:00.000-04:00
date: 2014-09-05
draft: false
tags:
    - web-development
---

This is a neat trick I learned for CSS3 to select out the last box of a grid of floating elements and set its width to fill the remaining box.  For this, I am using a CSS pseudo-class called `:nth-last-of-type()`. This pseudo-class will select out the last element of the attached element in the containing element.  So in a grid of 9 span tags in a div tag, the selector will pick out the 9th box.

whats nice about selector is that it will accept arguments.  If I supply an integer (`span:nth-last-of-type(2)`) from the same grid, the 8th box would now be selected. The same will apply with `:nth-of-type()` as well.

<figure class="kg-card kg-image-card"><img src="https://s3.amazonaws.com/christophervachon/articles/banner_css.jpg" class="kg-image" alt="CSS3" loading="lazy"></figure>

## The Task

I want to have a dynamically sized grid of an unknown number of elements. The last element needs to be selected, and if not a multiple of 3, change its width to fill the white space in the container.

See the Pen [CSS Box Width Based on Content](http://codepen.io/liaodrake/pen/nkAoJ/?ref=blog.christophervachon.com) by Christopher Vachon ([@liaodrake](http://codepen.io/liaodrake?ref=blog.christophervachon.com)) on [CodePen](http://codepen.io/?ref=blog.christophervachon.com).

### So what am I doing here?

I am first using less to compile my css for me to make my life quicker and easier. If you don't know what less is, [check it out here](http://lesscss.org/?ref=blog.christophervachon.com).

So, the first thing I want to do is select out the last box in my grid, and I do that with the `:nth-last-of-type()` pseudo-class.

```
.box {
    width:31%;
    margin: 0 2% 0 0;
    background-color: #090;
}
/* select out the last box */
.box:nth-last-of-type(1) {
    background-color: #900;
}
```

Next, we want to find out if the selected box is the first, second, or third of its row. Remember that we want to have 3 boxes per row.  Do do this, we can use the `:nth-of-type()` pseudo-class by providing an _nth formula_ as the parameter.

```
.box:nth-last-of-type(1) {
    background-color: #900;
}
.box:nth-last-of-type(1):nth-of-type(3n+1) {
    width: 97%;
}
.box:nth-last-of-type(1):nth-of-type(3n+2) {
    width: 64%;
}
```

The formula `3n` will select out every 3rd box. By adding +1, I am selecting out every 3rd box plus 1, so every 4th, 7th, 10th, etc.  The same applies to the +2.  So by combining our `:nth-last-of-type()` selector to select out the last element, and our `:nth-of-type()` selector to select out the 1st or 2nd element of the row, I am able to set the width of the box to fill the remaining content.

### What can I do with this technique?

By modifying the selectors a little, I can also select out the last 2 elements and have the bottom two share the width as opposed to just the last block taking up 2 positions

<figure class="kg-card kg-embed-card"><iframe id="cp_embed_urwHy" src="https://codepen.io/liaodrake/embed/preview/urwHy?height=300&amp;slug-hash=urwHy&amp;default-tabs=css,result&amp;host=https://codepen.io" title="CSS Box Width Based on Content 2" scrolling="no" frameborder="0" height="300" allowtransparency="true" class="cp_embed_iframe" style="width: 100%; overflow: hidden;"></iframe></figure>

## Conclusion

Using pseudo selectors makes css a far more powerful tool for display than trying to use server-side or front-end logic.
