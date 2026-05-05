import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProduct() {
      const { data, error } = await supabase
        .from("Products")
        .select(`
          prod_id,
          prod_name,
          description,
          size,
          image_url,
          website_url,
          Brands (
            brand_name
          ),
          Product_Ingredient (
            percentage,
            ingredient_order,
            Ingredients (
              ingredient_name
            )
          ),
          Product_Highlights (
            Highlights (
              highlight_name
            )
          ),
          Product_Skin_Types (
            Skin_Type (
              skin_type_name
            )
          ),
          Product_Skin_Concerns (
            Skin_Concerns (
              skin_concern_name
            )
          )
        `)
        .eq("prod_id", id)
        .single();

      console.log("PRODUCT DETAIL DATA:", data);
      console.log("PRODUCT DETAIL ERROR:", error);

      if (!error) {
        setProduct(data);
      }

      setLoading(false);
    }

    getProduct();
  }, [id]);

  if (loading) {
    return <p>Loading product...</p>;
  }

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

  const ingredients =
    product.Product_Ingredient
      ?.sort((a, b) => a.ingredient_order - b.ingredient_order)
      .map((row) => row.Ingredients?.ingredient_name)
      .filter(Boolean) || [];

  const highlights =
    product.Product_Highlights?.map(
      (row) => row.Highlights?.highlight_name
    ).filter(Boolean) || [];

  const skinTypes =
    product.Product_Skin_Types?.map(
      (row) => row.Skin_Type?.skin_type_name
    ).filter(Boolean) || [];

  const skinConcerns =
    product.Product_Skin_Concerns?.map(
      (row) => row.Skin_Concerns?.skin_concern_name
    ).filter(Boolean) || [];

  return (
    <div className="page-shell">
      <div className="product-detail-card">
      <div className="product-detail-layout single-column-detail">
        <div className="product-detail-content">
            <h1 className="product-detail-name">{product.prod_name}</h1>

            <p className="product-detail-brand">
              {product.Brands?.brand_name}
            </p>

            <img
              src={product.image_url}
              alt={product.prod_name}
              className="product-detail-main-image"
            />
            <p className="product-detail-description">
              {product.description || "No description available."}
            </p>

            <div className="product-detail-section">
              <h3>Skin Types</h3>

              {skinTypes.length > 0 ? (
                <div className="skin-type-card-row">
                  {skinTypes.map((type) => (
                    <div key={type} className="skin-type-mini-card">
                      {type}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No skin types listed.</p>
              )}
            </div>

            <div className="product-detail-section">
              <h3>Skin Concerns</h3>

              {skinConcerns.length > 0 ? (
                <div className="skin-concern-card-grid">
                  {skinConcerns.map((concern) => (
                    <div key={concern} className="skin-concern-card">
                      <span className="skin-concern-icon">🌿</span>
                      <p>{concern}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No skin concerns listed.</p>
              )}
            </div>

            <div className="product-detail-section">
              <h3>Highlights</h3>

              {highlights.length > 0 ? (
                <div className="detail-highlight-grid">
                  {highlights.map((highlight) => (
                    <div key={highlight} className="detail-highlight-card">
                      <span className="detail-highlight-icon">✨</span>
                      <p>{highlight}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No highlights listed.</p>
              )}
            </div>

            <div className="product-detail-section">
              <details className="ingredient-dropdown">
                <summary>Ingredient Details</summary>

                <div className="ingredient-dropdown-content">
                  {ingredients.length > 0 ? (
                    <div className="ingredients-list">
                      {ingredients.map((ingredient) => (
                        <details key={ingredient} className="ingredient-dropdown">
                          <summary>{ingredient}</summary>

                          <div className="ingredient-dropdown-content">
                            <p>Description coming soon.</p>
                            <p>Research links coming soon.</p>
                          </div>
                        </details>
                      ))}
                    </div>
                  ) : (
                    <p>No ingredients listed.</p>
                  )}
                </div>
              </details>
            </div>

            <div className="product-detail-buttons">
              <a
                href={product.website_url}
                target="_blank"
                rel="noreferrer"
                className="product-btn details-btn"
              >
                View Retailer
              </a>
            </div>

            <div className="product-detail-buttons">
              <Link
                to={`/reviews/${product.prod_id}`}
                className="product-btn retailer-btn"
              >
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