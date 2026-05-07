import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import Reviews from "./pages/Reviews";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Quiz from "./pages/Quiz";
import Skin from "./pages/Skin";
import Routine from "./pages/Routine";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />

        <Route path="/home" element={<Home />} />
        <Route path="/reviews" element={
          <ProtectedRoute>
          <Reviews />
        </ProtectedRoute>
        } />
        <Route path="/reviews/:id" element={
          <ProtectedRoute>
          <Reviews />
        </ProtectedRoute>
        } />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/skin" element={<Skin />} />

        <Route
          path="/routine"
          element={
            <ProtectedRoute>
              <Routine />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;