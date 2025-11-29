import { Link } from "react-router-dom";
import Insta from "../../assets/insta.svg";
import "./StickyLinks.css";

const StickyLinks = () => {
  return (
    <>
      <div className="navbar-sticky-links">
        <ul className="navbar-list-container">
          <li>
            <Link to="/galleries" className="navbar-links">
              Galleries
            </Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/shop">Shop</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <a
            href="https://www.instagram.com/kevin_hughes_photography/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={Insta} alt="instagram icon" className="insta-icon" />
          </a>
        </ul>
      </div>
      <div className="navbar-sticky-links-bottom-bar"></div>
    </>
  );
};

export default StickyLinks;
