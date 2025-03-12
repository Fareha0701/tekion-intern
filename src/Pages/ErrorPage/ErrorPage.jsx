// when a user enters an undefined/invalid route Error Page is rendered
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="not-found">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Oops! The page you are looking for doesn't exist.</p>
        <button onClick={() => navigate("/")}>Go Back Home</button>
      </div>
    </>
  );
}
