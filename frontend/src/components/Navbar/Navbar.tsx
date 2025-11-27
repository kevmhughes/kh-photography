import { Link } from "react-router-dom";
import Logo from "../../assets/logo.svg";
import Khp from "../../assets/khp.svg";

import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar-container">
      <div style={{ display: "flex", gap: ".5rem", height: "4rem" }}>
        <Link to="/">
          <img src={Logo} alt="Passerine icon" style={{ height: "4rem" }} />
        </Link>
        <Link to="/">
          <img src={Khp} alt="" style={{ height: "4rem" }} />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
