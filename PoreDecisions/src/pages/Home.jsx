import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="page-shell">
      <div className="page-card">
        <h1>Welcome to PoreDecisions</h1>
        <p>
          Explore skincare picks, read reviews, and take our personalized quiz
          to find a routine that fits your skin goals.
        </p>

        <div className="page-buttons">
          <Link to="/reviews" className="page-btn">
            Reviews
          </Link>
          <Link to="/products" className="page-btn">
            Products
          </Link>
          <Link to="/quiz" className="page-btn">
            Take the Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;