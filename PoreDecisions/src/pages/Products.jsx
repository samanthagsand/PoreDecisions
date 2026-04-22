import { Link } from "react-router-dom";

function Products() {
  const products = [
    {
      id: 1,
      slug: "hydrating-cleanser",
      name: "Hydrating Cleanser",
      brand: "CeraVe",
      image: "🧴",
      description: "A gentle cleanser that helps remove dirt and oil without stripping the skin.",
      tags: ["Dry Skin", "Sensitive Skin", "Hydrating"],
      ultaUrl: "https://www.ulta.com",
      targetUrl: "https://www.target.com",
    },
    {
      id: 2,
      slug: "vitamin-c-serum",
      name: "Vitamin C Serum",
      brand: "CeraVe",
      image: "✨",
      description: "A brightening serum that helps support a more even-looking skin tone.",
      tags: ["Dark Spots", "Brightening", "Glow"],
      ultaUrl: "https://www.ulta.com",
      targetUrl: "https://www.target.com",
    },
    {
      id: 3,
      slug: "daily-spf-46",
      name: "Daily SPF 46",
      brand: "EltaMD",
      image: "☀️",
      description: "A lightweight sunscreen that helps protect skin and layers nicely under makeup.",
      tags: ["SPF", "Daily Use", "Sensitive Skin"],
      ultaUrl: "https://www.ulta.com",
      targetUrl: "https://www.target.com",
    },
    {
      id: 4,
      slug: "barrier-moisturizer",
      name: "Barrier Moisturizer",
      brand: "La Roche-Posay",
      image: "💧",
      description: "A moisturizer designed to support the skin barrier and provide lasting hydration.",
      tags: ["Moisturizer", "Barrier Support", "Dry Skin"],
      ultaUrl: "https://www.ulta.com",
      targetUrl: "https://www.target.com",
    },
    {
      id: 5,
      slug: "niacinamide-serum",
      name: "Niacinamide Serum",
      brand: "The Ordinary",
      image: "🫧",
      description: "A serum often used to help with oil balance, pores, and overall skin texture.",
      tags: ["Oily Skin", "Acne", "Texture"],
      ultaUrl: "https://www.ulta.com",
      targetUrl: "https://www.target.com",
    },
    {
      id: 6,
      slug: "eye-repair-cream",
      name: "Eye Repair Cream",
      brand: "CeraVe",
      image: "🌙",
      description: "A lightweight eye cream that helps hydrate and refresh the under-eye area.",
      tags: ["Eye Cream", "Hydrating", "Daily Routine"],
      ultaUrl: "https://www.ulta.com",
      targetUrl: "https://www.target.com",
    },
  ];

  return (
    <div className="page-shell">
      <div className="products-page-card">
        <h1 className="products-title">Shop Skincare</h1>
        <p className="products-subtitle">
          Browse skincare picks by concern, routine step, and skin needs.
        </p>

        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">{product.image}</div>

              <h3 className="product-name">{product.name}</h3>
              <p className="product-brand">{product.brand}</p>
              <p className="product-description">{product.description}</p>

              <div className="product-tags">
                {product.tags.map((tag) => (
                  <span key={tag} className="product-tag">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="product-buttons">
                <Link
                  to={`/products/${product.slug}`}
                  className="product-btn details-btn"
                >
                  View Product
                </Link>

                <a
                  href={product.ultaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="product-btn retailer-btn"
                >
                  Buy at Ulta
                </a>

                <a
                  href={product.targetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="product-btn retailer-btn"
                >
                  Buy at Target
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Products;