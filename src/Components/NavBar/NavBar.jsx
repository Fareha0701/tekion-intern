//Navigation Bar Component
import React from "react";
import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../Store/UserContext";
import ProfileModal from "../ProfileModal";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import "./NavBar.scss";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { username, setUsername, profileImg, setProfileImg } =
    useContext(UserContext);

  const [isModalOpen, setModalOpen] = useState(false);

  const [showNavButtons, setShowNavButtons] = useState(
    JSON.parse(localStorage.getItem("showNavButtons")) || false
  );

  useEffect(() => {
    if (location.pathname === "/gamepage") {
      setShowNavButtons(true);
      localStorage.setItem("showNavButtons", JSON.stringify(true));
    }
  }, [location.pathname]);

  const handleBack = () => {
    //loggedin & moving back to homepage, dont allow
    if (username && location.pathname === "/gamepage") {
      return;
    }
    //loggedin & wants to move back except homepage
    if (username && location.pathname !== "/") {
      navigate(-1);
    }
  };

  const handleForward = () => {
    navigate(1);
  };

  return (
    <>
      <header className="Title">
        <div className="TitleSubCon">
          <div className="NavLeft">
            {showNavButtons && (
              <div className="NavigationButtons">
                <span onClick={handleBack}>
                  <FaArrowLeft size={20} />
                </span>
                <span onClick={handleForward}>
                  <FaArrowRight size={20} />
                </span>
              </div>
            )}
            <h1 className="PowerPlay" onClick={() => navigate("/gamepage")}>
              PowerPlay
            </h1>
          </div>
          {username && (
            <div className="UserProfile" onClick={() => setModalOpen(true)}>
              <div className="UserProfileContent">
                {/* <div>{username}</div> */}
                <h4>{username}</h4>
                {/* <div> */}
                {profileImg !== "/Assets/defaultProfileImg.jpg" ? (
                  <img
                    src={profileImg}
                    alt="Profile"
                    style={{ width: 30, height: 30, borderRadius: "50%" }}
                  />
                ) : (
                  <CgProfile size={30} />
                )}
                {/* <img
                  src={profileImg}
                  alt="Profile"
                  style={{ width: 30, height: 30, borderRadius: "50%" }}
                /> */}
                {/* <CgProfile
                  size={30}

                  // style={{ cursor: "pointer" }}
                /> */}
                {/* </div> */}
              </div>
              {/* <img src="/Assets/profileicon.png" alt="Profile Icon" /> */}
            </div>
          )}
        </div>
      </header>
      <ProfileModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
