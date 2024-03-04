---
title: How to Modify a DoubleClick Advertisement
featured: false
description: Today an odd request came by my desk. The company has a DoubleClick forPublishers (DFP)Account serving advertisement on page for one of there clients. They want to beable to detect the destination URL of the advertisement, and if it meats acertain criteria, to get additional information for the advertisement related tothe sponsored client.My initial solution was to simply load the content you want as you want itdispl
image: https://blog.christophervachon.com/content/images/2019/05/dfp1.jpg
date_orig: 2016-03-04T16:00:00.000-05:00
date: 2016-03-04
draft: false
tags: ["web-development"]
---

Today an odd request came by my desk. The company has a [DoubleClick for Publishers](https://www.doubleclickbygoogle.com/solutions/revenue-management/dfp/?ref=blog.christophervachon.com) (`DFP`) Account serving advertisement on page for one of there clients. They want to be able to detect the destination URL of the advertisement, and if it meats a certain criteria, to get additional information for the advertisement related to the sponsored client.

My initial solution was to simply load the content you want as you want it displayed directly into DFP.  However that solution placed a great deal of effort on the administrative staff, so we needed to find a way to handle this programatically.

Obviously, we can not accomplish this on the server side, the data simply does not exist at that point. So that is out.

Next is to find and capture the data on page load. Again, not going to work, the data does not exist yet.

It was pointed out that we put that functionality into a timeout or an interval, but just puts a lot of additional load on the system trying to render to page. Depending on how it was written, it could also potentially cause a blocking issue preventing your page from loading entirely.

The solution we came up with as to use an event listener on the `googletag.pubads()` method. Specifically, we are looking for the `slotRenderEnded` event.

```
googletag
  .pubads()
  .addEventListener('slotRenderEnded', function(event) {
    console.log('Render Complete');
  })
;
```

Once an advertisement is loaded, this event will fire for it allowing you to take additional actions.

Next we needed to capture the specific element. We can use the `getSlotElementId()` method on the event to get the id of the element which was loaded.  With that, we can get our advertisement block.

```
googletag
  .pubads()
  .addEventListener('slotRenderEnded', function(event) {
    var _thisAdvertisement = document.getElementById(event.slot.getSlotElementId());
  })
;
```

Now we have our advertisement block.  Depending on your settings, your advertisements may be loaded via an iFrame. From this point on, We decided to leverage [jQuery](http://www.jquery.com/?ref=blog.christophervachon.com) which is already loaded on our page.

This gist of this being that for each advertisement that is loaded on the site from DFP we are performing this function on the content we got from DFP.  From here, we can change and modify the contents as required.
