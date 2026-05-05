import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();

  if (location.pathname === "/" || location.pathname === "/home" || location.pathname === "/signin") {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">PoreDecisions</div>

      <div className="navbar-links">
        <Link to="/home">Home</Link>
        <Link to="/reviews">Reviews</Link>
        <Link to="/products">Products</Link>
        <Link to="/quiz">Quiz</Link>
        <Link to="/skin">Skin</Link>
      </div>
    </nav>
  );
}

export default Navbar;