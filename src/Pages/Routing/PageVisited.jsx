//Restricts access to pages unless a user is logged in

import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../Store/UserContext";

const PageVisited = ({ children }) => {
  const { username } = useContext(UserContext);

  if (!username) {
    // Redirect to home page if no username exists
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PageVisited;
