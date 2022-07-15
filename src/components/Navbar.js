import React from "react";
import BrandLogo from "./BrandLogo";
import Button from "./Button";
export default function Navbar({ logout }) {
  return (
    <div className="navbar">
      <BrandLogo />
      <Button
        onClick={() => {
          logout();
        }}
        text="Signout"
      />
    </div>
  );
}
