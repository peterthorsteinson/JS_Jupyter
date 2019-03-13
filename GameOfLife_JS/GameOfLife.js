// GameOfLife.js

var fs = require('fs');
var readlineSync = require('readline-sync');

class GameOfLife {
    // Constructor that sets up instance variables with default values
    constructor() {
        this.grid = [];
        this.rows = 0;
        this.cols = 0;
    }

    getGrid(x, y, data) { // get array of arrays
        this.rows = x;
        this.cols = y;
        let offset = 2;
        this.grid = new Array(x);
        for (let i = 0; i < this.rows; i++) {
            this.grid[i] = new Array(y);
            for (let j = 0; j < this.cols; j++) {
                this.grid[i][j] = data[offset++]; // copy data into grid
            }
        }
    }

    printGrid() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                process.stdout.write(this.grid[i][j] + " "); // no newline!
            }
            console.log("");
        }
        console.log("");
    }

    saveGrid(file) {
        var buffer = new Buffer(2 + this.rows*this.cols);
        buffer[0] = this.rows;
        buffer[1] = this.cols;        
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                buffer[2 + i*this.cols + j] = this.grid[i][j];
            }            
        }
        fs.writeFileSync(file, buffer);
    }
    
    mutateGrid() {
        //Copy of original grid
        let temp_grid = new Array(this.rows);
        for (let i = 0; i < this.rows; i++) {
            temp_grid[i] = new Array(this.cols);
            temp_grid[i].fill(0);
        }
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let liveNeighborCount = this.getLiveNeighborCount(i, j);
                //a cell with less than 2 live neighbors dies
                if (this.grid[i][j] !== 0 && liveNeighborCount < 2) {
                    temp_grid[i][j] = 0;
                }
                //a cell with 2 or 3 live neighbors lives
                else if (this.grid[i][j] !== 0 && (liveNeighborCount === 2 || liveNeighborCount === 3)) {
                    temp_grid[i][j] = 1;
                }
                //a cell with greater than 3 live neighbors dies
                else if (this.grid[i][j] !== 0 && liveNeighborCount > 3) {
                    temp_grid[i][j] = 0;
                }
                // a dead cell with 3 live neighbors becomes live(gets birthed)
                else if (this.grid[i][j] === 0 && liveNeighborCount === 3) {
                    temp_grid[i][j] = 1;
                }
                // if we get this far then no changes required, so just copy this element
                else {
                    temp_grid[i][j] = this.grid[i][j];
                }
            }
        }
        this.grid = temp_grid;
    }

    // Returns the number of live neighbors for cell at this.grid[i][j]
    getLiveNeighborCount(i, j) {
        let liveNeighborCount = 0;
        let x = this.rows;
        let y = this.cols;
        // check 3 neighbors on row above cell
        if (i-1 >= 0 && j-1 >= 0 && this.grid[i-1][j-1] > 0) liveNeighborCount++;   // test cell up-left
        if (i-1 >= 0             && this.grid[i-1][j]   > 0) liveNeighborCount++;   // test cell up
        if (i-1 >= 0 && j+1 < y  && this.grid[i-1][j+1] > 0) liveNeighborCount++;   // test cell up-right
        // check 2 neighbors on same row as cell
        if (j-1 >= 0             && this.grid[i][j-1] > 0) liveNeighborCount++;     // test cell left
        if (j+1 <  y             && this.grid[i][j+1] > 0) liveNeighborCount++;     // test cell right
        // check 3 neighbors on row below cell
        if (i+1 < x && j-1 >= 0  && this.grid[i+1][j-1] > 0) liveNeighborCount++;    // test cell down-left
        if (i+1 < x              && this.grid[i+1][j] > 0)   liveNeighborCount++;    // test cell down
        if (i+1 < x && j+1 < y   && this.grid[i+1][j+1] > 0) liveNeighborCount++;    // test cell down-right
        return liveNeighborCount;
    }
}

main();

function main() {
    // program requires a .gol file name
    if (process.argv.length != 3) {
        console.log("This program requires 3 parameters: node.exe GameOfLife.js sample1.gol");
        process.exit(1)
    }
    console.log("runtime: " + process.argv[0]);
    console.log("script: " + process.argv[1]);
    console.log("data: " + process.argv[2]);

    let gol = new GameOfLife();

    // load buffer with bytes read from the input file.    
    fs.open(process.argv[2], 'r', function (err, fd) {
        let data = [];
        if (err)
            throw err;
        buffer = Buffer.alloc(1);
        while (true) {
            let num = fs.readSync(fd, buffer, 0, 1, null);
            if (num === 0)
                break;
            data.push(buffer[0]);
        }
        // The first and second byte in the file is height and width.
        let x = data[0];
        let y = data[1];

        // grid holds the game board.  The game board
        // is x arrays of arrays of length y
        // Notice that here x refers to the "row" and
        // y to the "column" if you want to view the
        // structure that way.
        console.log("\nGrid size %d, %d.\n", x, y);
        gol.getGrid(x, y, data);        
        gol.printGrid();

        // Now, we will accept input in a loop until the user
        // asks us to quit.
        while (true) {
            //Takes the input of the user
            let line = readlineSync.question(
                "Press return for next generation,\n" +
                "n to iterate multiple times,\n" +
                "w to save grid to disk,\n" +
                "or q to quit? ");
            line = line.trim().toLowerCase();
            switch (line) {
                //Quit
                case "q":
                    console.log("Exiting program");
                    process.exit(0);
                    break;
                //Saves
                case "w":
                    let filename = readlineSync.question("Enter a filename: ");
                    gol.saveGrid(filename.trim());
                    console.log("Grid saved to file " + filename + "\n");
                    break;

                case "n":
                    let num = parseInt(readlineSync.question("How many iterations? "));
                    console.log();
                    for (let i = 0; i < num; i++) {
                        gol.mutateGrid();
                        console.log(`step: ${i+1}`);
                        gol.printGrid(gol);
                    }
                    break;
                case "":
                    console.log();
                    gol.mutateGrid();
                    gol.printGrid(gol);
                    break;
            }
        }
    });
}
