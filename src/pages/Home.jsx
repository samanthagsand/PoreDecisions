import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="page-card hero-card">

  <h1 className="hero-logo">PoreDecisions</h1>

  <p className="eyebrow">Personalized skincare made simple</p>

  <h2 className="hero-heading">
    Find products that actually fit your skin.
  </h2>

  <p className="hero-subtext">
    Explore reviewed skincare picks, compare ingredients, and take a quick quiz
    to build a routine based on your skin type, concerns, and goals.
  </p>

  <div className="page-buttons">
    <Link to="/quiz" className="page-btn">
      Take the Quiz
    </Link>
    <Link to="/products" className="page-btn secondary-btn">
      Browse Products
    </Link>
    <Link to="/reviews" className="page-btn secondary-btn">
      Read Reviews
    </Link>
  </div>

  <div className="hero-stats">
    <div>
      <strong>6+</strong>
      <span>starter products</span>
    </div>
    <div>
      <strong>5</strong>
      <span>quiz questions</span>
    </div>
    <div>
      <strong>3</strong>
      <span>routine goals</span>
    </div>
  </div>

</div>
  );
}

export default Home;