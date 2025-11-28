import { Link } from "react-router-dom";
import Logo from "../../assets/logo.svg";
import Khp from "../../assets/khp.svg";

import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar-container">
      <div className="navbar-icons-container">
        <Link to="/">
          <img src={Logo} alt="Web logo" className="web-logo" />
        </Link>
        <Link to="/">
          <img src={Khp} alt="KH icon" className="kh-icon"/>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
