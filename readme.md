<!-- About:
This project is an interactive Sudoku game implemented using HTML, CSS and vanilla JavaScript. It allows users to play a standard 9x9 Sudoku puzzle, with features such as number input validation, automatic grid updates, and game completion detection.

Tech-stack:
HTML for structure
CSS for styling
JavaScript for game's logic

Features:
-A clean and responsive UI using HTML and CSS.
-Fully interactive 9x9 Sudoku board.
-Ability to set values in empty cells.
-New Game : Generates a new Sudoku puzzle.
-Check : Validates the current board with the original board ensuring that numbers should follow all sudoku rules and returns a win or lose accordingly
-Hint : Provides a hint for a cell.

Architecture:

1. Frontend (User Interface)

HTML (sudo_vanilla.html): Provides the structure of the Sudoku board with a 9x9 grid.
CSS (vanilla.css): Styles the game board, ensuring a clean and user-friendly interface.

2. JavaScript Logic (Game Engine)

Game Initialization:

1. constructor function is inistialized with all the values and functions
2. generateUUID - generates the unique id for each object with random function along with bitwise operators
3. generateGrid - generates the originalgrid randomly, validates that each row, column, and 3x3 subgrid must contain unique numbers from 1 to 9 after validation only it populates the sudoku.
4. generateVisibleGrid - displays only 25 numbers on the sudoku board and hides the value of 56 cells
5. setValue - Allows users to input numbers into cells.
6. end - calculates the elapsed time to display the result along with the message, accodring to the result of validate function
7. validate - checks that all rows, columns, and 3x3 subgrids contain unique numbers from 1-9 and returns True/False accordingly.
8. hint - 3 available hints, can only be used with empty cells. Randomly chooses the null index of the grid and dispalys the value from the originalGrid. -->

# Sudoku Game

An interactive Sudoku game implemented using **HTML, CSS, and Vanilla JavaScript**. It allows users to play a standard **9x9 Sudoku puzzle**, featuring number input validation, automatic grid updates, and game completion detection.

## Tech Stack

- **HTML** → Structure of the game
- **CSS** → Styling the game UI
- **JavaScript** → Game logic implementation

## Features

- Clean and responsive UI using HTML and CSS.
- Fully interactive 9x9 Sudoku board.
- Ability to set values in empty cells.
- New Game → Generates a fresh Sudoku puzzle.
- Check → Validates the board and determines win/loss and works only when all cells are filled.
- Hint → Provides a hint for a cell (limited to 3 hints per game).

## Architecture

### Frontend (User Interface)

- **HTML (`sudo_vanilla.html`)** → Provides the structure of the Sudoku board with a 9x9 grid.
- **CSS (`vanilla.css`)** → Styles the game board for a clean and user-friendly interface.

### JavaScript Logic (Game Engine)

#### Game Initialization

1. **Constructor Function** → Initializes the game with values and functions.
2. **`generateUUID`** → Generates a unique ID for each object using random functions and bitwise operators.
3. **`generateGrid`** → Generates the **original Sudoku grid**, ensuring unique numbers in every row, column, and 3×3 subgrid.
4. **`generateVisibleGrid`** → Displays only 25 numbers on the board while hiding the remaining 56 cells.
5. **`setValue(pos, value)`** → Allows users to input numbers into cells.
6. **`end()`** → Calculates the elapsed time and displays results based on `validate()`.
7. **`validate()`** → Checks if all rows, columns, and subgrids contain unique numbers **(1-9)**, returning `true` or `false`.
8. **`hint()`** → Provides a hint for an empty cell by revealing a value from the `originalGrid` (limited to 3 hints per game).

## Screenshots

! [alertWin] (/Images/alertWin.png)
