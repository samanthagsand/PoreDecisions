import { useNavigate } from "react-router-dom";

function SignIn() {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/home");
  };

  return (
    <div className="page-shell">
      <div className="page-card">
        <h1>PoreDecisions</h1>
        <p>
          Your personalized skincare routine finder. Sign in to explore
          products, reviews, and take the skincare quiz.
        </p>

        <div className="page-buttons">
          <button onClick={handleSignIn} className="page-btn">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;