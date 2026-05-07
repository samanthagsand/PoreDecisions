import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setChecking(false);
    }

    getUser();
  }, []);

  if (checking) return <p>Loading...</p>;

  if (!user) return <Navigate to="/signin" replace />;

  return children;
}

export default ProtectedRoute;