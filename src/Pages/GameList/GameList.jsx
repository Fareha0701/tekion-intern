import React, { useContext } from "react";
import { UserContext } from "../../Store/UserContext";
import { useNavigate } from "react-router-dom";
import NavBar from "../../Components/NavBar/NavBar";
import GameCard from "../../Components/GameCard/GameCard";
import { TfiLayoutGrid3Alt } from "react-icons/tfi";
import { GiTicTacToe } from "react-icons/gi";
import { MdGrid4X4 } from "react-icons/md";
import "./GameList.scss";

//fields to pass as a prop to GameCard Component
const gameData = [
  {
    name: "Sudoku",
    description: " Single Player ",
    genre: "Time bound game",
    path: "/sudoku",
    icon: <TfiLayoutGrid3Alt size={20} />,
  },
  {
    name: "Tic-Tac-Toe",
    description: " Multiplayer ",
    genre: "not a time bound game",
    path: "/tictactoe",
    icon: <GiTicTacToe size={30} />,
  },
  {
    name: "Grid-Game",
    description: "Multiplayer ",
    genre: "time bound game",
    path: "/gridgame",
    icon: <MdGrid4X4 size={30} />,
  },
];

export default function GameList() {
  // const { username } = useContext(UserContext);
  const navigate = useNavigate();
  return (
    <>
      <NavBar />
      <div className="GameListCon">
        <div className="GamesHeading">
          <h3>Games</h3>
        </div>
        <div className="ShowGameCard">
          {gameData.map((game, index) => (
            <GameCard
              key={index}
              gameName={game.name}
              gameContent={game.description}
              gameGenre={game.genre}
              onClick={() => navigate(game.path)}
              gameIcon={game.icon}
            />
          ))}
        </div>
      </div>
    </>
  );
}
