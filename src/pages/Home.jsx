import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setCheckingAuth(false);
    }

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const heroCard = document.querySelector(".hero-card");
      if (!heroCard) return;

      const newRipple = {
        id: crypto.randomUUID(),
        x: Math.random() * heroCard.offsetWidth,
        y: Math.random() * heroCard.offsetHeight,
      };

      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) =>
          prev.filter((ripple) => ripple.id !== newRipple.id)
        );
      }, 1200);
    }, 2600);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/");
  };

  return (
    <div className="page-card hero-card">
      <div className="hero-ripple-layer">
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="hero-ripple"
            style={{
              left: `${ripple.x}px`,
              top: `${ripple.y}px`,
            }}
          />
        ))}
      </div>

      <div className="hero-top-row">
        {!checkingAuth &&
          (user ? (
            <button onClick={handleLogout} className="logout-btn">
              Log Out
            </button>
          ) : (
            <button onClick={() => navigate("/signin")} className="logout-btn">
              Sign In
            </button>
          ))}
      </div>

      <h1 className="hero-logo">PoreDecisions</h1>

      <p className="eyebrow">Personalized skincare made simple</p>

      <h2 className="hero-heading">
        Find products that actually fit your skin.
      </h2>

      <p className="hero-subtext">
        Explore reviewed skincare picks, compare ingredients, and take a quick
        quiz to build a routine based on your skin type, concerns, and goals.
      </p>

      <div className="hero-nav-grid">
        <Link to="/" className="page-btn">
          Home
        </Link>
        <Link to="/reviews" className="page-btn secondary-btn">
          Reviews
        </Link>
        <Link to="/products" className="page-btn secondary-btn">
          Products
        </Link>
        <Link to="/quiz" className="page-btn secondary-btn">
          Quiz
        </Link>
        <Link to="/skin" className="page-btn secondary-btn">
          Skin
        </Link>
        <Link to="/routine" className="page-btn secondary-btn">
          Routine
        </Link>
      </div>

      <div className="hero-stats">
        <div>
          <strong>200k+</strong>
          <span>starter products</span>
        </div>
        <div>
          <strong>5</strong>
          <span>quiz questions</span>
        </div>
        <div>
          <strong>1</strong>
          <span>custom routine</span>
        </div>
      </div>
    </div>
  );
}

export default Home;