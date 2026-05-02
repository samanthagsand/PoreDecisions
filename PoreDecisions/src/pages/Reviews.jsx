import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { products as initialProducts } from "../data/products";

function Reviews() {
  const [products, setProducts] = useState(initialProducts);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(initialProducts[0].id);
  const [userRating, setUserRating] = useState(0);
  const [commentText, setCommentText] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      `${product.name} ${product.brand}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const selectedProduct =
    products.find((product) => product.id === selectedProductId) || filteredProducts[0];

  const averageRating = useMemo(() => {
    if (!selectedProduct || selectedProduct.reviews.length === 0) return 0;

    const total = selectedProduct.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    return (total / selectedProduct.reviews.length).toFixed(1);
  }, [selectedProduct]);

  const handleAddComment = () => {
    if (!selectedProduct) return;

    if (userRating === 0) {
      alert("Please select a rating.");
      return;
    }

    if (!commentText.trim()) {
      alert("Please write a comment.");
      return;
    }

    const newReview = {
      id: Date.now(),
      user: "You",
      rating: userRating,
      comment: commentText.trim(),
    };

    const updatedProducts = products.map((product) =>
      product.id === selectedProduct.id
        ? { ...product, reviews: [newReview, ...product.reviews] }
        : product
    );

    setProducts(updatedProducts);
    setUserRating(0);
    setCommentText("");
  };

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="page-shell">
      <div className="review-page-card">
        <div className="review-top-row">
          <input
            type="text"
            placeholder="Search Products"
            className="review-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {searchTerm && (
          <div className="search-results">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <button
                  key={product.id}
                  className={`search-result-item ${
                    selectedProduct?.id === product.id ? "active-product" : ""
                  }`}
                  onClick={() => {
                    setSelectedProductId(product.id);
                    setSearchTerm("");
                  }}
                >
                  {product.name} — {product.brand}
                </button>
              ))
            ) : (
              <p className="no-results">No matching products found.</p>
            )}
          </div>
        )}

        {selectedProduct && (
          <>
            <h2 className="review-title">PRODUCT REVIEW</h2>

            <div className="product-review-section">
              <div className="product-image-box">
                <div className="image-placeholder">{selectedProduct.image}</div>
                <p>Product Image</p>
              </div>

              <div className="product-info">
                <h3>{selectedProduct.name}</h3>
                <p className="brand-name">{selectedProduct.brand}</p>
                <p className="rating-line">
                  {renderStars(Math.round(Number(averageRating)))} {averageRating} (
                  {selectedProduct.reviews.length} Reviews)
                </p>

                <h4>Key Ingredients:</h4>
                <p className="ingredients-text">
                  {selectedProduct.ingredients.join(" • ")}
                </p>
              </div>
            </div>

            <div className="section-heading">Write a Review</div>

            <div className="write-review-section">
              <p className="your-rating-label">Your Rating:</p>

              <div className="rating-stars-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`star-btn ${userRating >= star ? "selected-star" : ""}`}
                    onClick={() => setUserRating(star)}
                    type="button"
                  >
                    ★
                  </button>
                ))}
              </div>

              <textarea
                className="comment-box"
                placeholder="Write your review here..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />

              <button className="comment-btn" onClick={handleAddComment}>
                Add Comment
              </button>
            </div>

            <div className="section-heading">Customer Reviews</div>

            <div className="reviews-list">
              {selectedProduct.reviews.map((review) => (
                <div key={review.id} className="customer-review-card">
                  <p className="customer-stars">{renderStars(review.rating)}</p>
                  <h4>{review.rating >= 4 ? "Loved it!" : "My thoughts"}</h4>
                  <p>"{review.comment}"</p>
                  <p className="review-user">- {review.user}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Reviews;