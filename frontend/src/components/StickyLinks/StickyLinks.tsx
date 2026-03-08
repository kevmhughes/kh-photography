import { Link, useLocation } from "react-router-dom";
import Insta from "../../assets/insta.svg";
import Glass from "../../assets/glass.svg";
import "./StickyLinks.css";
type Props = {
  setSearch?: (value: string) => void;
};

const StickyLinks = ({ setSearch }: Props) => {
  const location = useLocation();

  return (
    <>
      <div className="navbar-sticky-links" style={{ flexDirection: "column" }}>
        <div className="navbar-and-search-bar-container">
          <ul className="navbar-list-container">
            <li>
              <Link to="/galleries" className="navbar-links">
                Galleries
              </Link>
            </li>
            <li>
              <Link to="/about" className="navbar-links">
                About
              </Link>
            </li>
            <li>
              <Link to="/shop" className="navbar-links">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/contact" className="navbar-links">
                Contact
              </Link>
            </li>
            <a
              href="https://www.instagram.com/khphotography.es/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={Insta} alt="instagram icon" className="insta-icon" />
            </a>
          </ul>
        </div>
        {location.pathname === "/shop" && (
          <div className="search-bar-container">
            <input
              type="text"
              onChange={(e) => setSearch?.(e.target.value)}
              className="search-input"
            />
            <img
              src={Glass}
              alt="Search bar icon"
              className="search-bar-icon"
            />
          </div>
        )}
      </div>
      {location.pathname !== "/shop" && (
        <div className="navbar-sticky-links-bottom-bar"></div>
      )}
    </>
  );
};

export default StickyLinks;
