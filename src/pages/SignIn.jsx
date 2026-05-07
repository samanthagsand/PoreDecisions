import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, useSearchParams } from "react-router-dom";

function SignIn() {
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/home";

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    let result;

    if (isSignUp) {
      result = await supabase.auth.signUp({
        email,
        password,
      });
    } else {
      result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
    }

    setLoading(false);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    if (isSignUp) {
      setMessage("Account created! Check your email to confirm your account.");
      return;
    }

    navigate(redirectTo);
  };

  return (
    <div className="page-shell">
      <div className="page-card">
        <h1>PoreDecisions</h1>

        <p>
          Your personalized skincare routine finder. Sign in to explore
          products, reviews, and take the skincare quiz.
        </p>

        <form onSubmit={handleAuth} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          {message && <p className="auth-message">{message}</p>}

          <button type="submit" className="page-btn" disabled={loading}>
            {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <button
          type="button"
          className="auth-switch-btn"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setMessage("");
          }}
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "Need an account? Sign up"}
        </button>
      </div>
    </div>
  );
}

export default SignIn;