import React, { useState, useContext } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { UserContext } from "../../Store/UserContext";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../../backend/firebase";
import { GiTicTacToe } from "react-icons/gi";
import { SiNotepadplusplus } from "react-icons/si";
import { TfiNotepad } from "react-icons/tfi";
import { FaChess } from "react-icons/fa";
import NavBar from "../../Components/NavBar";
import "./HomePage.scss";

export default function HomePage() {
  // handles username globally
  const {
    setUsername: setUserNameToContext,
    setUserId,
    setProfileImg,
  } = useContext(UserContext);

  const [username, setUsername] = useState(""); //handles username only to HomePage, local
  const navigate = useNavigate();

  //triggered when user submits username
  const handleClick = async (e) => {
    e.preventDefault();
    navigate("/gamepage");
    if (username.length >= 2) {
      const newUserId = btoa(username).replace(/[^a-zA-Z0-9]/g, "");
      setUserId(newUserId);
      setUserNameToContext(username);

      const userProfile = await fetchUserProfile(newUserId);

      if (userProfile && userProfile.profileImg) {
        //profileImg already exist, updates it from firestore
        setProfileImg(userProfile.profileImg);
      } else {
        //default
        setProfileImg("/Assets/defaultProfileImg.jpg");
      }
      navigate("/gamepage");
    } else {
      alert("Username must be atleast 2 characters long");
    }
  };

  return (
    <>
      <NavBar />
      <div className="HomeMainCon">
        <form onSubmit={handleClick} className="SectionForm">
          <section className="SectionContent">
            <h1 className="Heading">Best Place to Enjoy online Games</h1>
            <input
              id="username"
              name="username"
              className="UserInput"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button type="submit" className="ArrowButton">
              <FaLongArrowAltRight size={20} />
            </button>
          </section>
        </form>
      </div>
      <div className="Icons">
        <div className="TicTacToe">
          <GiTicTacToe size={100} />
        </div>
        <div className="Notepad">
          <SiNotepadplusplus
            size={50}
            style={{ position: "relative", left: 20, top: 2 }}
          />
          <TfiNotepad
            size={60}
            style={{ position: "absolute", left: 20, top: 40 }}
          />
        </div>
        <div className="Chess">
          <FaChess
            size={70}
            style={{ position: "absolute", left: 20, top: 33 }}
          />
        </div>
      </div>
    </>
  );
}
