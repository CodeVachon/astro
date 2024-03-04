---
title: Building a Hexagon Game Board
featured: false
description: Playing with HTML Canvas to make a hexagonal grid-based game.
image: https://blog.christophervachon.com/content/images/2019/11/Screen-Shot-2019-11-07-at-08.51.07.png
date_orig: 2019-10-13T15:41:00.000-04:00
date: 2019-10-13
draft: false
tags: ["canvas", "web-development"]
---

I wanted to build a dynamic gameboard in Javascript with the HTML canvas, but decided that a square grid was just too simple of a project. To step things up a notch I decided to build this basic game board a Hexagonal based system. It quickly turned into an interesting thought experiment.

## A Conventional Grid

In a conventional 3x3 grid setting we use an multidimensional array to store the data for the map. This generates 9 easily addressable points.

```javascript
const mapWidth = 3;
const mapHeight = 3;
const mapGrid = [];
for (let y = 0; y < mapHeight; y++) {
    const row = [];

    for (let x = 0; x < mapWidth; x++) {
        const col = {
            isOccupied: false,
            x: x,
            y: y
        };
        row.push(col);
    }

    mapGrid.push(row);
}
```

This generates for us a multidimensional array of objects like similar to this:

```
mapGrid = [
    [{}, {}, {}],
    [{}, {}, {}],
    [{}, {}, {}]
]
```

If we want to access the Top Left, it would be addressed as `mapGrid[0][0]` because javascript is a zero based system. The bottom right would be `mapGrid[2][2]`. From here if we want to see if a specific cell has the `isOccupied` flag set to `true`, we can easily access the location with an array check.

```
console.log(mapGrid[y][x].isOccupied);
```

Assuming we have a Player Token at the center of the grid, and we wanted to move the character, we would use an coordinal system for direction (usually North, East, South, West). If we want our Token to move North, we would reduce the `y` value of the token by one, and add one if moving South. Moving the Token East and West we would affect the `x` value of our Token.

Although we can work with the code we have, it starts to get a little kludgy as we start to expand the functionality. Before we go to far lets, refactor what we have into classes.

```javascript
class Cell {
    constructor(x, y) {
        this.isOccupied = false;
        this.x = x;
        this.y = y;
    } // close constructor
} // close Cell

class Token {
    constructor(name, startX, startY, map) {
        this.name = name;
        this.x = startX;
        this.y = startY;
        this.map = map;

        this.map.occupyCell(this.x, this.y);
    } // close constructor

    move(direction) {
        let newX = new Number(this.x);
        let newY = new Number(this.y);

        switch (direction.toUpperCase()) {
            case "N":
                newY = newY - 1;
                break;
            case "S":
                newY = newY + 1;
                break;
            case "E":
                newX = newX + 1;
                break;
            case "W":
                newX = newX - 1;
                break;
        } // close switch

        // Make sure our new position is within the contrains of our map
        if (newY < 0) {
            newY = 0;
        } else if (newY > this.map.maxRows) {
            newY = this.map.maxRows;
        } // close if newY

        if (newX < 0) {
            newX = 0;
        } else if (newX > this.map.maxCols) {
            newX = this.map.maxCols;
        } // close if newX

        // Make sure out new position is not already occupied
        if (!this.map.isCellOccupied(newX, newY)) {
            // leave our current cell
            this.map.clearCell(this.x, this.y);
            // occupy our new cell
            this.map.occupyCell(newX, newY);
            // set our values
            this.x = newX;
            this.y = newY;
        } // close if not occupied
    } // close move
} // close Token

class MapGrid {
    constructor(mapWidth, mapHeight) {
        this.grid = [];
        this.maxRows = mapHeight - 1;
        this.maxCols = mapWidth - 1;

        for (let y = 0; y < mapHeight; y++) {
            const row = [];

            for (let x = 0; x < mapWidth; x++) {
                row.push(new Cell(x, y));
            } // close for x++

            this.grid.push(row);
        } // for for y++
    } // close constructor

    getCell(x, y) {
        return this.grid[y][x];
    } // close getCell

    isCellOccupied(x, y) {
        return this.getCell(x, y).isOccupied;
    } // close isCellOccupied

    occupyCell(x, y) {
        this.getCell(x, y).isOccupied = true;
    } // close occupyCell

    clearCell(x, y) {
        this.getCell(x, y).isOccupied = false;
    } // close clearCell
} // close MapGrid

const init = () => {
    const gameMap = new MapGrid(3, 3);
    const playerToken = new Token("Player 1", 1, 1, gameMap);

    document.addEventListener("keydown", (event) => {
        const key = event.key;

        if (key === "ArrowLeft") {
            playerToken.move("W");
        } else if (key === "ArrowRight") {
            playerToken.move("E");
        } else if (key === "ArrowUp") {
            playerToken.move("N");
        } else if (key === "ArrowDown") {
            playerToken.move("S");
        }
    }); // close addEventListener(keydown)
}; // close init

init();
```

This gives us everything we need from a data perspective to generate a map, and place a moveable token on it.

## Stacking Hexagons in a Grid

This wasn't as simple as building a grid like you would with squares as I required to offset both the `x` and `y` values to neatly stack each hexagon. I also added an extra cell to each even row to keep the map "balanced". This lead to odd rows having 9 columns, and even having 10 which leads to moving issues later on.

<figure class="kg-card kg-embed-card kg-card-hascaption"><iframe id="cp_embed_qBBjbYR" src="https://codepen.io/CodeVachon/embed/preview/qBBjbYR?height=300&amp;slug-hash=qBBjbYR&amp;default-tabs=js,result&amp;host=https://codepen.io" title="Playing With Moving a Token inside a constrained Hexagon Grid " scrolling="no" frameborder="0" height="300" allowtransparency="true" class="cp_embed_iframe" style="width: 100%; overflow: hidden;"></iframe><figcaption>The Gameboard in Action</figcaption></figure>
