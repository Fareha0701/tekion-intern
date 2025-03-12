/*Profile Modal - runs only when  "UserProfile" div is clicked 
setModalOpen is set to true
*/
import React, { useContext } from "react";
import { UserContext } from "../../Store/UserContext";
import { useNavigate } from "react-router-dom";
// import ProfilePage from "../../Pages/ProfilePage";
import "./ProfileModal.scss";
// import NavBar from "../NavBar";

function ProfileModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  const { username, setUsername, setProfileImg, setUserId } =
    useContext(UserContext);

  if (!isOpen) {
    return null; // modal not rendered
  }

  // Navigation to Profile Page
  const handleProfileNav = () => {
    navigate("/profilepage");
    onClose();
  };

  // Navigation to Stats Page
  const handleShowStats = () => {
    navigate("/showstats");
  };

  //Logout funtionality
  const handleLogOut = () => {
    localStorage.clear();
    navigate("/");
    onClose();
    setUsername("");
    setUserId("");
    setProfileImg("/Assets/defaultProfileImg.jpg");
  };

  return (
    <>
      <div className="ModalMainCon" onClick={onClose}>
        <div className="ModalContent" onClick={(e) => e.stopPropagation()}>
          <h3 className="ModalHeading" onClick={handleProfileNav}>
            Profile
          </h3>
          <p className="ModalUsername">{username}</p>
          <button id="content" onClick={handleProfileNav}>
            Edit Profile
          </button>
          <hr className="ModalDivider" />
          <button id="content" onClick={handleShowStats}>
            Show Stats
          </button>

          <hr className="ModalDivider" />

          <button className="ModalLogout" onClick={handleLogOut}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default ProfileModal;
// onClick={(e) => e.stopPropagation()}
// onClick={onClose}
