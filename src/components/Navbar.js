import React from "react";
import BrandLogo from "./BrandLogo";
import Button from "./Button";
export default function Navbar({ onClick }) {
  return (
    <div>
      <BrandLogo />
      <Button onClick={onClick} text="Signout" />
    </div>
  );
}
