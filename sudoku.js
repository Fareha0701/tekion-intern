/**
 * Objectives
 * 1. Create a Sudoku Class
 * 2. Initiate the constructor
 *      a. set new id for the game
 *      b. set start time
 *      c. set end time
 *      d. generate new grid
 *      e. set visible grid by keeping only 25 values randomly and removing others by setting null
 * 3. Write functions for different purposes
 * 4. Attach these functions in the prototype
 * 5. Test your features
 */

function Sudoku(player_name) {
  this.name = player_name;
  this.id = this.generateUUID();
  this.originalGrid = this.generateGrid();
  this.visibleGrid = this.generateVisibleGrid();
  this.startTime = Date.now();
  this.endTime = null;
  this.hintsRemaining = 3; // Initialize hints count
}

Sudoku.prototype.generateUUID = function () {
  let uuid = "";
  for (let i = 0; i < 36; i++) {
    let digit = Math.floor(Math.random() * 16);
    //random generates random integer 0-1, *16 scales to 0-15, floor converts to the nearest integer, single digit will come
    if (i === 14) {
      uuid += "4";
    } else if (i === 19) {
      uuid += ((digit & 3) | 8).toString(16);
    } else if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid += "-";
    } else {
      uuid += digit.toString(16);
    }
  }
  return uuid;
};

Sudoku.prototype.generateGrid = function () {
  // decide the data structure of the grid
  // 9x9 or [[3x3], [3x3], ...]
  let originalGrid = Array.from({ length: 9 }, () => Array(9).fill(0));

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let shuffledList = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(
        () => Math.random() - 0.5
      );
      let numPlaced = false;

      for (let value of shuffledList) {
        let isValid = true;

        for (let k = 0; k < 9; k++) {
          //check row and column validity
          if (originalGrid[i][k] === value || originalGrid[k][j] === value) {
            isValid = false;
            break;
          }
        }

        // check 3x3 subgrid
        let startRow = i - (i % 3),
          startcol = j - (j % 3);
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            if (originalGrid[startRow + r][startcol + c] === value) {
              isValid = false;
              break;
            }
          }
          if (!isValid) break;
        }
        if (isValid) {
          originalGrid[i][j] = value;
          numPlaced = true;
          break;
        }
      }
      //no valid number placed, restart the process.
      if (!numPlaced) {
        return this.generateGrid();
      }
    }
  }
  return originalGrid;
};

Sudoku.prototype.generateVisibleGrid = function () {
  // remove (81 - 25) values
  // set other values as null

  const copyOfSolution = JSON.parse(JSON.stringify(this.originalGrid));
  let subgridVisibleCells = [3, 3, 3, 3, 3, 3, 3, 2, 2]; // Number of visible cells per 3x3 subgrid
  subgridVisibleCells.sort(() => Math.random() - 0.5); // shuffle the order of visible cells
  const visibleCells = new Set(); // tracking visible cells

  // iterate over each subgrid
  for (let subgridIndex = 0; subgridIndex < 9; subgridIndex++) {
    const count = subgridVisibleCells[subgridIndex]; // Use the shuffled count.
    const subgridRow = Math.floor(subgridIndex / 3);
    const subgridCol = subgridIndex % 3;
    let numPlaced = 0;
    // Randomly choose 'count' unique cells within this subgrid.
    while (numPlaced < count) {
      const row = subgridRow * 3 + Math.floor(Math.random() * 3); // Random row in subgrid
      const col = subgridCol * 3 + Math.floor(Math.random() * 3); // Random col in subgrid
      const key = `${row},${col}`;
      //selecting unique cells
      if (!visibleCells.has(key)) {
        visibleCells.add(key);
        numPlaced++;
      }
    }
  }

  // remaining cells null
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (!visibleCells.has(`${row},${col}`)) {
        copyOfSolution[row][col] = null;
      }
    }
  }

  return copyOfSolution;
};

// User Play functions
Sudoku.prototype.setValue = function (pos, value) {
  //function for filling the values
  // { row: , col: }
  // update visible originalGrid by the position and the value
  const [row, col] = pos;
  this.visibleGrid[row][col] = value;
};

//end
Sudoku.prototype.end = function () {
  //call vallidate for validation
  this.endTime = Date.now();
  const elapsedTime = Math.floor((this.endTime - this.startTime) / 1000);
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;

  if (this.validate()) {
    alert(
      `Congratulations! You solved the Sudoku!\nTime Taken: ${minutes} min ${seconds} sec`
    );
  } else {
    alert(
      ` Incorrect solution! Keep trying.\nTime Taken: ${minutes} min ${seconds} sec`
    );
  }
};

//validate
Sudoku.prototype.validate = function () {
  // compare visibleGrid with the  originalGrid

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (
        this.visibleGrid[i][j] === null ||
        this.visibleGrid[i][j] !== this.originalGrid[i][j]
      ) {
        return false;
      }
    }
  }
  return true;
};

//Hint
Sudoku.prototype.useHint = function () {
  // 3 hints can be used
  if (this.hintsRemaining <= 0) {
    alert("No hints remaining!");
    return;
  }

  let hintBox = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      // Only allow hint for cells that are empty.
      if (this.visibleGrid[i][j] === null) {
        hintBox.push([i, j]);
      }
    }
  }

  // No empty cells
  if (hintBox.length === 0) {
    alert("No empty cells available for a hint!");
    return;
  }

  // choosing random index
  let index = Math.floor(Math.random() * hintBox.length);
  let [row, col] = hintBox[index];

  // mapping random index's [row, col] in visible grid
  this.visibleGrid[row][col] = this.originalGrid[row][col];

  this.hintsRemaining--;
  updateBoard();
  alert("Hint used! " + this.hintsRemaining + " hint(s) remaining.");
};

let game = new Sudoku("bob");

//DOM
function initializeBoard() {
  const grids = document.querySelectorAll(".sudoku__grid"); //selects all elements in the document with the class "sudoku__grid"
  grids.forEach((grid, gridIndex) => {
    const blockRow = Math.floor(gridIndex / 3); // calcullates row of the 3x3 blocks
    const blockCol = gridIndex % 3; // calcullates col of the 3x3 blocks

    const cells = grid.querySelectorAll(".sudoku__cell"); // selecting all 9 cells
    cells.forEach((cell, cellIndex) => {
      const innerRow = Math.floor(cellIndex / 3);
      const innerCol = cellIndex % 3;
      const row = blockRow * 3 + innerRow;
      const col = blockCol * 3 + innerCol;
      cell.dataset.row = row;
      cell.dataset.col = col;

      if (game.visibleGrid[row][col] !== null) {
        cell.value = game.visibleGrid[row][col];
        cell.disabled = true; // prefilled cell disabled
        cell.style.backgroundColor = "rgb(145, 143, 143)";
        cell.style.color = "black";
      } else {
        cell.value = ""; //cleared cell for user input
        cell.disabled = false;
        cell.style.backgroundColor = "";
        cell.style.color = "black";
      }
    });
  });
}

//reflecting the current/updated state of the visibleGrid
function updateBoard() {
  initializeBoard();
}

//new object is created and updated when "New game" is clicked
function resetGame() {
  game = new Sudoku("joey");
  console.log("Original Grid:", game.originalGrid);
  console.log("Visible Grid:", game.visibleGrid);
  updateBoard();
}

document.addEventListener("DOMContentLoaded", function () {
  updateBoard(); // loading the prefilled cells

  // Listen for user input on the sudoku board.
  document.querySelector(".sudoku").addEventListener("input", function (e) {
    // Only process events on inputs that are not disabled.
    if (e.target.classList.contains("sudoku__cell") && !e.target.disabled) {
      const input = e.target;
      const value = parseInt(input.value, 10);

      // only enter numbers from 1–9.
      if (isNaN(value) || value < 1 || value > 9) {
        input.value = "";
        return;
      }

      // Retrieve the grid coordinates stored on the element.
      const row = parseInt(input.dataset.row, 10);
      const col = parseInt(input.dataset.col, 10);

      // Update the values
      game.setValue([row, col], value);
    }
  });

  // "Check" button
  document.getElementById("validate").addEventListener("click", function () {
    const filledCells = game.visibleGrid
      .flat()
      .filter((cell) => cell !== null).length;

    if (filledCells < 81) {
      alert("Game is not complete, keep playing.");
    } else {
      game.end();
    }
  });

  // "New Game" button
  document.getElementById("newGame").addEventListener("click", function () {
    resetGame();
  });
  //"Hint" button
  document.getElementById("hint").addEventListener("click", function () {
    game.useHint();
  });
});
console.log(game.id);
console.log(game.originalGrid);
console.log(game.visibleGrid);
