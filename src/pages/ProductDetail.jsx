import { Link, useParams } from "react-router-dom";
import { products } from "../data/products";

// TEMP SAME DATA (later we will share this from one file)
const products = [
  {
    slug: "hydrating-cleanser",
    name: "Hydrating Cleanser",
    brand: "CeraVe",
    image: "🧴",
    description: "A gentle cleanser that helps remove dirt and oil without stripping the skin.",
    ingredients: ["Ceramides", "Hyaluronic Acid", "Glycerin"],
    ultaUrl: "https://www.ulta.com",
    targetUrl: "https://www.target.com",
  },
  {
    slug: "vitamin-c-serum",
    name: "Vitamin C Serum",
    brand: "CeraVe",
    image: "✨",
    description: "A brightening serum that helps support a more even-looking skin tone.",
    ingredients: ["Vitamin C", "Ceramides", "Hyaluronic Acid"],
    ultaUrl: "https://www.ulta.com",
    targetUrl: "https://www.target.com",
  },
  {
    slug: "daily-spf-46",
    name: "Daily SPF 46",
    brand: "EltaMD",
    image: "☀️",
    description: "A lightweight sunscreen that protects your skin daily.",
    ingredients: ["Zinc Oxide", "Niacinamide", "Vitamin E"],
    ultaUrl: "https://www.ulta.com",
    targetUrl: "https://www.target.com",
  },
];

function ProductDetail() {
  const { slug } = useParams();

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="page-shell">
        <div className="page-card">
          <h1>Product not found</h1>
          <Link to="/products" className="page-btn">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
  <div className="page-shell">
    <div className="product-detail-card">
      <div className="product-detail-layout">
        <div className="product-detail-visual">
          <div className="product-detail-image">
            {product.image}
          </div>
        </div>

        <div className="product-detail-content">
          <h1 className="product-detail-name">{product.name}</h1>
          <p className="product-detail-brand">{product.brand}</p>

          <p className="product-detail-description">
            {product.description}
          </p>

          <div className="product-detail-section">
            <h3>Key Ingredients</h3>
            <p>{product.ingredients.join(" • ")}</p>
          </div>

          <div className="product-detail-buttons">
            <a
              href={product.ultaUrl}
              target="_blank"
              rel="noreferrer"
              className="product-btn details-btn"
            >
              Buy at Ulta
            </a>

            <a
              href={product.targetUrl}
              target="_blank"
              rel="noreferrer"
              className="product-btn details-btn"
            >
              Buy at Target
            </a>
          </div>

          <div className="product-detail-buttons">
            <Link to="/reviews" className="product-btn retailer-btn">
              See Reviews
            </Link>

            <Link to="/products" className="product-btn retailer-btn">
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

export default ProductDetail;