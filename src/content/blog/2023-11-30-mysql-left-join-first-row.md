---
title: MySQL Left Join First Row
featured: false
description: This is how I solved a MySQL Left Join First Row issue
image: ./../../assets/blog/photo-1525081905268-fc0b46e9d786.jpg
date_orig: 2023-11-30T12:45:32.000-05:00
date: 2023-11-30
draft: false
tags: ["mysql", "database"]
---

Recently, we had a MySQL Query Peg 8 CPU due to a sudden increase in records from data migration. This data migration provided a reference table to link equipment to a location and DateTime.

For some records, that was two or three records; for some, it was a couple of hundred. That table was optimized with Indexes where required and quickly indexed.

The issue came in where, on a list table, we needed to be able to Join in the Last known location of a piece of equipment.

```sql
SELECT
  eq.*,
  loc.lastKnownLocation,
  loc.lastLocatedDate
FROM Equipment eq
LEFT JOIN Location loc ON loc.id = (
  SELECT
    loc.id
  Locations loc
  WHERE loc.referenceId = eq.is
  ORDER BY loc.lastLocatedDate DESC
  LIMIT 1
)
ORDER BY loc.lastLocatedDate
```

This will work, but the issue here is that the sub-query needs to be re-indexed for every equipment record. At scale, this becomes extremely slow.

An excellent solution is to add a row number to the Locations table and join that in.

```sql
SELECT
  eq.*,
  loc.lastKnownLocation,
  loc.lastLocatedDate
FROM Equipment eq
LEFT JOIN (
  SELECT
    loc.*,
    ROW_NUMBER() OVER(PARTITION BY referenceId ORDER BY lastLocatedDate DESC) as rowNo
  FROM Location loc
) as loc ON loc.referenceId = eq.id
WHERE loc.rowNo = 1
ORDER BY loc.lastLocatedDate
```

This solution allows the location table to be modified once per query and joined efficiently.

The Result here went from `72` seconds to `0.3` seconds over 800 equipment records and 200,000+ location records.
