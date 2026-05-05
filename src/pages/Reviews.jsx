import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Reviews() {
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [commentText, setCommentText] = useState("");

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    async function getProducts() {
      setLoadingProducts(true);

      const { data, error } = await supabase
        .from("Products")
        .select(`
          prod_id,
          prod_name,
          description,
          image_url,
          Brands (
            brand_name
          )
        `)
        .order("prod_name", { ascending: true });

      if (!error && data) {
        setProducts(data);
        if (id) {
          setSelectedProductId(Number(id));
        } else if (data.length > 0) {
          setSelectedProductId(data[0].prod_id);
        }
      }

      setLoadingProducts(false);
    }

    getProducts();
  }, [id]);

  useEffect(() => {
    if (!selectedProductId) return;

    async function getSelectedProduct() {
      const { data, error } = await supabase
        .from("Products")
        .select(`
          prod_id,
          prod_name,
          description,
          image_url,
          Brands (
            brand_name
          )
        `)
        .eq("prod_id", selectedProductId)
        .single();

      if (!error && data) {
        setSelectedProduct(data);
      } else {
        setSelectedProduct(null);
      }
    }

    getSelectedProduct();
  }, [selectedProductId]);

  useEffect(() => {
    if (!selectedProductId) return;

    async function getReviews() {
      setLoadingReviews(true);

      const { data, error } = await supabase
        .from("Reviews")
        .select("*")
        .eq("prod_id", selectedProductId)
        .order("review_id", { ascending: false });

      if (!error) {
        setReviews(data || []);
      } else {
        setReviews([]);
      }

      setLoadingReviews(false);
    }

    getReviews();
  }, [selectedProductId]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const productName = product.prod_name || "";
      const brandName = product.Brands?.brand_name || "";
      return `${productName} ${brandName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  }, [products, searchTerm]);

  const averageRating = useMemo(() => {
    const validReviews = reviews.filter((review) => review.rating !== null);
    if (validReviews.length === 0) return "0.0";
    const total = validReviews.reduce(
      (sum, review) => sum + Number(review.rating),
      0
    );
    return (total / validReviews.length).toFixed(1);
  }, [reviews]);

  const handleAddReview = async () => {
    if (!selectedProduct) return;

    if (userRating === 0) {
      alert("Please select a rating.");
      return;
    }

    if (!reviewTitle.trim()) {
      alert("Please write a title.");
      return;
    }

    if (!commentText.trim()) {
      alert("Please write a review.");
      return;
    }

    const newReview = {
      prod_id: selectedProduct.prod_id,
      rating: userRating,
      title: reviewTitle.trim(),
      content: commentText.trim(),
      date: new Date().toISOString().split("T")[0],
    };

    const { data, error } = await supabase
      .from("Reviews")
      .insert([newReview])
      .select()
      .single();

    if (!error && data) {
      setReviews((current) => [data, ...current]);
      setUserRating(0);
      setReviewTitle("");
      setCommentText("");
      setSubmitMessage("Review submitted!");
      setTimeout(() => setSubmitMessage(""), 3000);
    } else {
      console.error("Error submitting review:", error);
      setSubmitMessage("Failed to submit review. Please try again.");
      setTimeout(() => setSubmitMessage(""), 3000);
    }
  };

  const renderStars = (rating) => {
    const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
    return "★".repeat(safeRating) + "☆".repeat(5 - safeRating);
  };

  if (loadingProducts) {
    return (
      <div className="page-shell">
        <p>Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="review-page-card">
        <div className="review-top-row">
          <input
            type="text"
            placeholder="Search by product or brand..."
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
                  key={product.prod_id}
                  className={`search-result-item ${
                    String(selectedProductId) === String(product.prod_id)
                      ? "active-product"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedProductId(product.prod_id);
                    setSearchTerm("");
                    setUserRating(0);
                    setReviewTitle("");
                    setCommentText("");
                  }}
                >
                  {product.prod_name} —{" "}
                  {product.Brands?.brand_name || "Unknown Brand"}
                </button>
              ))
            ) : (
              <p className="no-results">No matching products found.</p>
            )}
          </div>
        )}

        {selectedProduct ? (
          <>
            <h2 className="review-title">Product Review</h2>

            <div className="product-review-section">
              <div className="product-image-box">
                <img
                  src={selectedProduct.image_url}
                  alt={selectedProduct.prod_name}
                  className="review-product-image"
                />
              </div>

              <div className="product-info">
                <h3>{selectedProduct.prod_name}</h3>
                <p className="brand-name">
                  {selectedProduct.Brands?.brand_name || "Unknown Brand"}
                </p>
                <p className="rating-line">
                  <span className="review-stars">
                    {renderStars(Math.round(Number(averageRating)))}
                  </span>
                  <span>
                    {averageRating} ({reviews.length} Reviews)
                  </span>
                </p>
              </div>
            </div>

            <h2 className="section-heading">Write a Review</h2>

            <div className="write-review-section">
              <p className="your-rating-label">Your Rating:</p>

              <div className="rating-stars-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`star-btn ${
                      userRating >= star ? "selected-star" : ""
                    }`}
                    onClick={() => setUserRating(star)}
                    type="button"
                  >
                    ★
                  </button>
                ))}
              </div>

              <input
                type="text"
                className="comment-box"
                placeholder="Review title..."
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                style={{ marginBottom: "8px" }}
              />

              <textarea
                className="comment-box"
                placeholder="Write your review here..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />

              {submitMessage && (
                <p style={{ color: submitMessage.includes("Failed") ? "red" : "green" }}>
                  {submitMessage}
                </p>
              )}

              <button className="comment-btn" onClick={handleAddReview}>
                Submit Review
              </button>
            </div>

            <h2 className="section-heading">Customer Reviews</h2>

            {loadingReviews ? (
              <p>Loading customer reviews...</p>
            ) : (
              <div className="reviews-list">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.review_id} className="customer-review-card">
                      <p className="customer-stars">
                        {review.rating !== null
                          ? renderStars(Number(review.rating))
                          : "No rating"}
                      </p>
                      <h4>{review.title || "Review"}</h4>
                      <p>"{review.content}"</p>
                      <p className="review-user">- Anonymous</p>
                    </div>
                  ))
                ) : (
                  <p>No reviews yet. Be the first to write one!</p>
                )}
              </div>
            )}
          </>
        ) : (
          <p>No product selected.</p>
        )}
      </div>
    </div>
  );
}

export default Reviews;