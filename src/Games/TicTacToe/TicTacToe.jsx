import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../Store/UserContext";
import "./TicTacToe.scss";
// import { saveGameResult } from "../../backend/firebase";
import { saveUserGameStats } from "../../backend/firebase";
import NavBar from "../../Components/NavBar";

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const { userId, username } = useContext(UserContext);

  useEffect(() => {
    const saveStats = async () => {
      if (!userId) return; // don't save if no user is logged in

      if (winner) {
        // save the result when there is a winner
        const gameData = {
          game: "TicTacToe",
          won: winner === "X" ? 1 : 0,
          lost: winner === "O" ? 1 : 0,
          username: username,
        };
        await saveUserGameStats(userId, gameData);
      } else if (!board.includes(null) && gameStarted) {
        // save the result as a draw if the board is full
        const gameData = {
          game: "TicTacToe",
          won: 0,
          lost: 0,
          username: username,
        };
        await saveUserGameStats(userId, gameData);
      }
    };

    saveStats();
  }, [winner, board, gameStarted, userId, username]);

  const handleClick = (index) => {
    if (!gameStarted || board[index] || winner) return;

    const newBoard = board.slice();
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
    setWinner(calculateWinner(newBoard));
  };

  const startGame = () => {
    setGameStarted(true);
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const startNewGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  return (
    <>
      <NavBar />
      <div className="tictactoeMainCon">
        <h1>Tic-Tac-Toe</h1>
        <button className="btns" onClick={startGame}>
          Start Game
        </button>
        <button className="btns" onClick={startNewGame}>
          New Game
        </button>
        {gameStarted && (
          <div className="board">
            {board.map((value, index) => (
              <button
                key={index}
                onClick={() => handleClick(index)}
                className="tictactoecell"
              >
                {value}
              </button>
            ))}
          </div>
        )}
        {winner && <p>{`Winner: ${winner}`}</p>}
      </div>
    </>
  );
}

export default TicTacToe;
