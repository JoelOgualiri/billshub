import React from "react";

import { useNavigate } from "react-router-dom";
export default function LandingPage() {
  let navigate = useNavigate();
  const navigateToLogin = () => {
    navigate("/login");
  };
  const navigateToSignup = () => {
    navigate("/signup");
  };
  return (
    <h1>
      <h2>Welcome to Billshub</h2>
      <button
        onClick={() => {
          navigateToLogin();
        }}
      >
        LOGIN
      </button>
      <button
        onClick={() => {
          navigateToSignup();
        }}
      >
        SIGNUP
      </button>
    </h1>
  );
}
