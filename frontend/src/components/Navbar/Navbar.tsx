import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Logo from "../../assets/logo.svg";
import Khp from "../../assets/khp.svg";
import Insta from "../../assets/insta.svg";

import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close menu immediately on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    }
  }, [isOpen]);

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
          <img
            src={Logo}
            alt="Web logo"
            className="web-logo"
            onClick={closeMenu}
          />
        </Link>
        <Link to="/" className="kh-icon-container">
          <img
            src={Khp}
            alt="KH icon"
            className="kh-icon"
            onClick={closeMenu}
          />
        </Link>
      </div>

      <div onClick={toggleMenu} className="navbar-hamburger-menu-target-area">
        <div className="navbar-hamburger-menu-container">
          <div className="navbar-hamburger-icon">
            <span className={`bar ${isOpen ? "bar-menu-opened" : ""}`}></span>
            <span className={`bar ${isOpen ? "bar-menu-opened" : ""}`}></span>
            <span className={`bar ${isOpen ? "bar-menu-opened" : ""}`}></span>
          </div>
        </div>
      </div>

      <div className={`hamburger-menu ${isOpen && "active-hamburger-menu"}`}>
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
            <img
              src={Insta}
              alt="instagram icon"
              className="mobile-insta-icon"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
