//Rendered when Edit Profile button is clicked from ProfileModal
import React, { useState, useContext, useEffect, useCallback } from "react";
import { UserContext } from "../../Store/UserContext";
import { useNavigate } from "react-router-dom";
import NavBar from "../../Components/NavBar";
import Upload from "../../Components/Upload";
import { MdEdit } from "react-icons/md";
import { saveUserProfile } from "../../backend/firebase";
import "./ProfilePage.scss";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { profileImg, setProfileImg } = useContext(UserContext);

  const { username, setUsername, theme, toggleTheme, userId } =
    useContext(UserContext);

  const [showUploadOptions, setShowUploadOptions] = useState(false);

  useEffect(() => {
    localStorage.setItem("profileImg", profileImg);
  }, [profileImg]);

  // shows Drag and Drop, File Upload for an Image
  const handleImageClick = (e) => {
    e.stopPropagation();
    setShowUploadOptions(true);
  };

  // const handleOutsideClick = () => {
  //   setShowUploadOptions(false);
  // };

  // const handleImageUpload = useCallback(
  //   async (newImage) => {
  //     setProfileImg(newImage);
  //     localStorage.setItem("profileImg", newImage);
  //     if (userId) {
  //       await saveUserProfile(userId, username, newImage);
  //     }
  //   },
  //   [setProfileImg, userId, username]
  // );

  const handleImageUpload = async (newImage) => {
    setProfileImg(newImage);
    localStorage.setItem("profileImg", newImage);
    if (userId) {
      await saveUserProfile(userId, username, newImage);
    }
  };

  const handleThemeChange = (e) => {
    const themeChange = e.target.value;
    if (themeChange != theme) toggleTheme();
  };

  const handleShowStats = () => {
    navigate("/showstats");
  };

  return (
    <>
      <NavBar />
      <div className="ProfilePageMainCon">
        <div className="ProfileCard">
          <div className="TopMain">
            <div className="ImgCon" onClick={handleImageClick}>
              <img src={profileImg} alt="Profile" className="ProfileImage" />
              <div className="EditIcon">
                <MdEdit size={30} />
              </div>
            </div>
            <div className="NameCon">
              <h2 className="ProfileName">{username}</h2>
              <p className="ProfileRole">Gamer</p>
            </div>
          </div>

          <hr className="Divider" />

          <div className="BottomMain">
            {showUploadOptions ? (
              <Upload onImageUpload={handleImageUpload} />
            ) : (
              <>
                <div className="ThemeSelection">
                  <p className="theme">Themes</p>
                  <select id="theme" value={theme} onChange={handleThemeChange}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>

                <div className="Statsbtn">
                  <button className="ShowStats" onClick={handleShowStats}>
                    Show Stats
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
