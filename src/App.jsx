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

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/reviews/:id" element={<Reviews />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/skin" element={<Skin />} />
      </Routes>
    </>
  );
}

export default App;