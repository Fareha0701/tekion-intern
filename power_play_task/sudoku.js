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
}

Sudoku.prototype.generateUUID = function () {
  let uuid = "";
  for (let i = 0; i < 36; i++) {
    let digit = Math.floor(Math.random() * 16);
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
          if (originalGrid[i][k] === value || originalGrid[k][j] === value) {
            isValid = false;
            break;
          }
        }
        let startRow = i - (i % 3),
          startcol = j - (j % 3);
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            if (originalGrid[startRow + r][startcol + c] === value) {
              isValid = false;
              break;
            }
          }
        }
        if (isValid) {
          originalGrid[i][j] = value;
          numPlaced = true;
          break;
        }
      }
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
  const totalVisibleCells = 25;
  const subgridVisibleCells = [3, 3, 3, 3, 3, 3, 3, 2, 2];

  // shuffle the order of visible cells
  subgridVisibleCells.sort(() => Math.random() - 0.5);
  // tracking visible cells
  const visibleCells = new Set();

  for (let subgridRow = 0; subgridRow < 3; subgridRow++) {
    for (let subgridCol = 0; subgridCol < 3; subgridCol++) {
      const visibleCount = subgridVisibleCells[subgridRow * 3 + subgridCol];
      let numPlaced = 0;

      while (numPlaced < visibleCount) {
        const row = subgridRow * 3 + Math.floor(Math.random() * 3);
        const col = subgridCol * 3 + Math.floor(Math.random() * 3);
        const cellKey = `${row},${col}`;

        //selecting unique cells
        if (!visibleCells.has(cellKey)) {
          visibleCells.add(cellKey);
          numPlaced++;
        }
      }
    }
  }

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
  // { row: , col: }
  // update visible originalGrid by the position and the value

  const [row, col] = pos;
  if (this.visibleGrid[row][col] === null) {
    this.visibleGrid[row][col] = value;

    if (this.visibleGrid.flat().filter((cell) => cell !== null).length === 81) {
      this.end();
    }
  }
};

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

//DOM
document.addEventListener("DOMContentLoaded", function () {
  const sudokuTable = document.querySelector(".sudoku");

  sudokuTable.addEventListener("input", function (event) {
    if (event.target.tagName === "INPUT") {
      const input = event.target;
      const value = parseInt(input.value, 10);

      if (!isNaN(value) && value >= 1 && value <= 9) {
        const row = input.dataset.row;
        const col = input.dataset.col;

        game.setValue([parseInt(row), parseInt(col)], value);
      } else {
        input.value = "";
      }
    }
  });

  sudokuTable.addEventListener("focusin", function (event) {
    if (event.target.tagName === "INPUT" && !event.target.disabled) {
      const row = event.target.dataset.row;
      const col = event.target.dataset.col;

      document.querySelectorAll(".sudoku td").forEach((cell) => {
        const input = cell.querySelector("input");
        if (input && input.disabled) {
          cell.style.backgroundColor = "rgb(145, 143, 143)";
        } else {
          cell.style.backgroundColor = "";
        }
        cell.style.border = `1px solid rgb(0, 0, 0)`;
      });

      // highlight the entire row and column
      document
        .querySelectorAll(
          `.sudoku td input[data-row='${row}']:not([disabled]), 
                   .sudoku td input[data-col='${col}']:not([disabled])`
        )
        .forEach((input) => {
          const cell = input.parentElement;
          cell.style.backgroundColor = "rgb(242, 228, 222)";
          cell.style.border = `2px solid rgb(159, 118, 104)`;
        });
    }
  });

  function initializeSudokuBoard() {
    const cells = document.querySelectorAll(".sudoku td");
    cells.forEach((cell, index) => {
      const row = Math.floor(index / 9);
      const col = index % 9;

      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = "1";
      input.dataset.row = row;
      input.dataset.col = col;

      // Set predefined values
      if (game.visibleGrid[row][col] !== null) {
        input.value = game.visibleGrid[row][col];
        input.disabled = true;
        input.style.color = "rgb(0, 0, 0)";
        cell.style.backgroundColor = "rgb(145, 143, 143)";
      }

      cell.innerHTML = "";
      cell.appendChild(input);
    });
  }

  initializeSudokuBoard();
});

const game = new Sudoku("bob");
console.log(game.id);
console.log(game.originalGrid);
console.log(game.visibleGrid);
