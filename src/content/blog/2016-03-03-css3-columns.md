---
title: CSS3 Columns
featured: false
description: Today we had an issue where we needed to split an ordered list into multiplecolumns. So took some time to explorer a different way to accomplish the task ofsplitting a standard html into multiple columns.  Item 1  Item 2  Item 3  Item 4  Item 5  Item 6  Item 7  Item 8  Item 9  Item 10  Item 11  Item 12  Item 13  Item 14  Item
image: ./../../assets/blog/css3.jpg
date_orig: 2016-03-03T16:00:00.000-05:00
date: 2016-03-03
draft: false
tags: ["web-development"]
---

Today we had an issue where we needed to split an ordered list into multiple columns. So took some time to explorer a different way to accomplish the task of splitting a standard html into multiple columns.

```
<ul class="testColumns">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
  <li>Item 4</li>
  <li>Item 5</li>
  <li>Item 6</li>
  <li>Item 7</li>
  <li>Item 8</li>
  <li>Item 9</li>
  <li>Item 10</li>
  <li>Item 11</li>
  <li>Item 12</li>
  <li>Item 13</li>
  <li>Item 14</li>
  <li>Item 15</li>
  <li>Item 16</li>
  <li>Item 17</li>
</ul>
```

In the past, I would have done on server side by dividing the number items in the list by the number of columns needed to give me `Nth` number of items place per column. I would then use an iteration loop to detect how many I had placed into a "column", and when `Nth` was reached, start a new column.  You would then use CSS to float the columns as needed.

I have also used `JavaScript` to take an existing list of items on a page, and following a similar process, split the list into the selected number of columns.  Using [jQuery](http://jquery.com/), you can also quickly inject closing and opening code into the DOM accomplishing the same thing.

The resulting code ends up like this:

```
<ul class="testColumns">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
  <li>Item 4</li>
  <li>Item 5</li>
  <li>Item 6</li>
</ul>
<ul class="testColumns">
  <li>Item 7</li>
  <li>Item 8</li>
  <li>Item 9</li>
  <li>Item 10</li>
  <li>Item 11</li>
  <li>Item 12</li>
</ul>
<ul class="testColumns">
  <li>Item 13</li>
  <li>Item 14</li>
  <li>Item 15</li>
  <li>Item 16</li>
  <li>Item 17</li>
</ul>
```

However we can now quickly and easily use `CSS3` to handle this functionality natively without having to do all the calculations or injections.  We can use the `columns` tag.

<figure class="kg-card kg-embed-card"><iframe id="cp_embed_QNbPwd" src="https://codepen.io/liaodrake/embed/preview/QNbPwd?height=300&amp;slug-hash=QNbPwd&amp;default-tabs=css,result&amp;host=https://codepen.io" title="Playing With Columns" scrolling="no" frameborder="0" height="300" allowtransparency="true" class="cp_embed_iframe" style="width: 100%; overflow: hidden;"></iframe></figure>

You should note that `columns` (at time of writing this post) is not fully or completely support by the major bowsers. For this reason, I am having to use the vendor prefixes as well as the columns property. The result of which being an inconsistent rendering across the individual browsers.

```
.testColumns {
  -webkit-columns: 3;
  -moz-columns: 3;
  -ms-columns: 3;
  columns: 3;
  list-style: none;
}
```

I am interested to see some more uses of this outside of this context, let me know if you have or found one.
