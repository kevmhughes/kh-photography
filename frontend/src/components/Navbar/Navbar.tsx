import { Link } from "react-router-dom";
import { useState } from "react";
import Logo from "../../assets/logo.svg";
import Khp from "../../assets/khp.svg";
import Insta from "../../assets/insta.svg";

import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="navbar-container">
      <div className="navbar-icons-container">
        <Link to="/">
          <img src={Logo} alt="Web logo" className="web-logo" />
        </Link>
        <Link to="/" className="kh-icon-container">
          <img src={Khp} alt="KH icon" className="kh-icon" />
        </Link>
      </div>

      <div className="navbar-hamburger-menu-container">
        <div onClick={toggleMenu} className="navbar-hamburger-icon">
          X
        </div>
      </div>

      <div
        className={`hamburger-menu ${
          isOpen ? "active-hamburger-menu" : "inactive-hamburger-menu"
        }`}
      >
        <div className="navbar-hamburger-menu-link-container">
          <Link to="/galleries" onClick={closeMenu}>
            Galleries
          </Link>
          <Link to="/about" onClick={closeMenu}>
            About
          </Link>
          <Link to="/shop" onClick={closeMenu}>
            Shop
          </Link>
          <Link to="/contact" onClick={closeMenu}>
            Contact
          </Link>
            <a
              href="https://www.instagram.com/kevin_hughes_photography/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={Insta} alt="instagram icon" className="insta-icon" />
            </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
