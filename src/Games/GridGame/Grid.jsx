import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../Store/UserContext";
import NavBar from "../../Components/NavBar";
import { saveUserGameStats } from "../../backend/firebase";
import "./Grid.scss";

function generateGameData(rows, cols) {
  let newGrid = Array.from({ length: rows }, () => Array(cols).fill(null));

  //1 hit in each row
  for (let i = 0; i < rows; i++) {
    let numHit = Math.floor(Math.random() * cols);
    newGrid[i][numHit] = "H";
  }

  //Miss and Retry
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (newGrid[i][j] === null) {
        newGrid[i][j] = Math.random() < 0.5 ? "M" : "R";
      }
    }
  }
  return newGrid;
}

function Grid() {
  const storedRows = parseInt(localStorage.getItem("gridRows")) || 3;
  const storedCols = parseInt(localStorage.getItem("gridCols")) || 3;

  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [gameData, setGameData] = useState(generateGameData(3, 3));
  const [selectedCells, setSelectedCells] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [chances, setChances] = useState(3);
  const [hits, setHits] = useState(0);
  const { userId, username } = useContext(UserContext);
  // const [resultSaved, setResultSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem("gridRows", rows);
    localStorage.setItem("gridCols", cols);
  }, [rows, cols]);

  // useEffect(() => {
  //   if (gameOver) {
  //     if (hits === 3) {
  //       saveGameResult("Grid Game", 1, 0); // Save win
  //     } else {
  //       saveGameResult("Grid Game", 0, 1); // Save loss
  //     }
  //   }
  // }, [gameOver]);

  useEffect(() => {
    const saveStats = async () => {
      if (gameOver && userId) {
        // Only save if game is over and user is logged in
        const gameData = {
          game: "Grid Game",
          won: hits === 3 ? 1 : 0,
          lost: hits === 3 ? 0 : 1,
          username: username,
        };

        try {
          await saveUserGameStats(userId, gameData);
        } catch (error) {
          console.error("Error saving game stats:", error);
        }
      }
    };

    saveStats();
  }, [gameOver, hits, userId, username]);

  const startGame = () => {
    setGameData(generateGameData(rows, cols));
    setChances(3);
    setSelectedCells([]);
    setHits(0);
    setGameOver(false);
    // setResultSaved(false);
  };

  //game play logic
  const gridClick = (e) => {
    // console.log("Grid cell clicked");

    if (gameOver || !e.target.classList.contains("Gridcell")) {
      return;
    }

    const row = parseInt(e.target.getAttribute("data-row"));
    const col = parseInt(e.target.getAttribute("data-col"));
    if (selectedCells.some(([r, c]) => r === row && c === col)) {
      return;
    }
    const cellValue = gameData[row][col];
    setSelectedCells([...selectedCells, [row, col]]);

    if (cellValue === "H") {
      setHits(hits + 1);

      if (hits + 1 === 3) {
        setGameOver(true);
        // saveGameResult("Grid Game", 1, 0);
        // setResultSaved(true);
        // console.log("Game Over: You Win!");
      }
    } else if (cellValue === "M") {
      setChances(chances - 1);

      if (chances - 1 === 0) {
        setGameOver(true);
        // saveGameResult("Grid Game", 0, 1);
        // setResultSaved(true);

        // console.log("Game Over: You Lose!");
      }
    }
  };
  // getting color with respect to H,M,R.
  const getCellColor = (row, col) => {
    const cellValue = gameData[row][col];
    if (!selectedCells.some(([r, c]) => r === row && c === col)) {
      return "white";
    }
    if (cellValue === "H") return "green";
    if (cellValue === "M") return "red";
    if (cellValue === "R") return "yellow";
  };
  return (
    <>
      <NavBar />
      <div className="GridMainCon">
        <div className="GridHeading">
          <h1>Grid Game</h1>
        </div>

        <div className="inputFields">
          <input
            type="number"
            value={rows}
            onChange={(e) =>
              setRows(Math.max(3, Math.min(9, parseInt(e.target.value) || 3)))
            }
            placeholder="rows"
            min="3"
            max="9"
          />

          <input
            type="number"
            value={cols}
            onChange={(e) =>
              setCols(Math.max(3, Math.min(9, parseInt(e.target.value) || 3)))
            }
            placeholder="columns"
            min="3"
            max="9"
          />
          <button className="generatetGame" onClick={startGame}>
            Generate Grid
          </button>
          <button className="generateGame" onClick={startGame}>
            New Game
          </button>
        </div>
        <div className="ChancesHeading">
          <h3>Chances Left: {chances}</h3>
        </div>
        <div className="squareGrid" onClick={gridClick}>
          {gameData.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cell, colIndex) => (
                <button
                  key={colIndex}
                  className="Gridcell"
                  data-row={rowIndex}
                  data-col={colIndex}
                  style={{
                    backgroundColor: getCellColor(rowIndex, colIndex),
                  }}
                  onClick={(e) => gridClick(e, rowIndex, colIndex)}
                  disabled={gameOver}
                >
                  {selectedCells.some(
                    ([r, c]) => r === rowIndex && c === colIndex
                  )
                    ? cell
                    : " "}
                </button>
              ))}
            </div>
          ))}
        </div>
        {gameOver && (
          <h2 className="Resultheading">
            {hits === 3 ? "You Win!" : "You Lose!"}
          </h2>
        )}
      </div>
    </>
  );
}

export default Grid;
