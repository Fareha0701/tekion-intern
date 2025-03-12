//Individual Game Card according to passed props
import React from "react";
import "./GameCard.scss";
import { FaLongArrowAltRight } from "react-icons/fa";

export default function GameCard({
  gameName,
  gameContent,
  gameGenre,
  onClick,
  gameIcon,
}) {
  return (
    <section
      className="GameCard"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <h2 className="GameCardHeading">{gameName}</h2>
      <p className="GameGenre">{gameContent}</p>
      <span className="GameGenre">{gameGenre}</span>
      <span className="btn1" onClick={onClick} style={{ cursor: "pointer" }}>
        <FaLongArrowAltRight size={20} />
      </span>
      <span></span>
      <span className="CardIcon">{gameIcon}</span>
    </section>
  );
}
