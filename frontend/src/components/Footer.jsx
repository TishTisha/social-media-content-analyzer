import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
  return (
    <>
      {/* Left socials */}
      <div className="socials">
        <a href="https://github.com/TishTisha" target="_blank" rel="noreferrer">
          <FaGithub color="#d2b48c" size={32} />
        </a>
        <a href="https://www.linkedin.com/in/tisha-wadhva1903/" target="_blank" rel="noreferrer">
          <FaLinkedin color="#d2b48c" size={32} />
        </a>
      </div>

      {/* Right text */}
      <div className="madeWithLove">
        <span style={{ color: "#d2b48c", fontSize: "26px" }}>
          Made with <span style={{ color: "#d2b48c" }}>♥</span> by Tish
        </span>
      </div>
    </>
  );
}
