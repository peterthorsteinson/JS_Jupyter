# Conway's Game of Life in Node.js

Conway's Game of Life is a simulation "zero player" game where the initial state will trigger the evolution of the game.

You can interact with Game of Life by giving in different input patterns.

# How to use

You will need Node.js installed in your computer to be able to run.

* Clone this repo.
* `cd GameOfLife_JS`
* `npm init`
* `npm install --save readline-sync`
* `node GameOfLife.js sample1.gol`

# Input binary file

The binary input file named sample1.gol contains two leading bytes for the number of rows and columns respectively, followed by a sequence of rows*columns bytes where each byte is either a 0 for a dead cell or a 1 for a live cell.
