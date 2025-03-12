/*
createContext = creates a global context for data, values persist across page reloads using localStorage, 
                data can be used in any component without pop drilling
useState = manages state variables like username, theme, profile image, and user ID.
useEffect = updates localStorage whenever state changes, ensuring data persistence.
*/

import React, { createContext, useState, useEffect } from "react";
// import { CgProfile } from "react-icons/cg";
export const UserContext = createContext(); //creating a context

//wraps entire application and provides data globally to all child components
export const UserProvider = ({ children }) => {
  //Username State
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  useEffect(() => {
    localStorage.setItem("username", username);
  }, [username]);

  //Theme State
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    // console.log("Theme changed to:", theme);
  }, [theme]);

  //function to switch theme between light and dark
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  //Profile Image State
  const [profileImg, setProfileImg] = useState(
    localStorage.getItem("profileImg") || "/Assets/defaultProfileImg.jpg"
  );
  useEffect(() => {
    localStorage.setItem("profileImg", profileImg);
  }, [profileImg]);

  //User ID State
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  useEffect(() => {
    localStorage.setItem("userId", userId);
  }, [userId]);

  return (
    <UserContext.Provider
      value={{
        username,
        setUsername,
        theme,
        toggleTheme,
        profileImg,
        setProfileImg,
        userId,
        setUserId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
