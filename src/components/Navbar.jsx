import { NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();

  if (location.pathname === "/" || location.pathname === "/signin") {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">PoreDecisions</div>

      <div className="navbar-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/reviews">Reviews</NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/quiz">Quiz</NavLink>
        <NavLink to="/skin">Skin</NavLink>
        <NavLink to="/routine">Routine</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;