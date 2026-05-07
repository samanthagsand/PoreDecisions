import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

function IngredientCard({ ingredient }) {
  const [open, setOpen] = useState(false);

  const summary = Array.isArray(ingredient.Ingredient_Research_Summary)
    ? ingredient.Ingredient_Research_Summary[0]
    : ingredient.Ingredient_Research_Summary;

  const articles = ingredient.Ingredient_Research_Articles || [];
  const topArticles = articles
    .filter((row) => row?.Research_Articles?.url || row?.Research_Articles?.title)
    .slice(0, 5);

  const evidenceLabel = summary?.strongest_evidence || "Research available";
  const benefitLabel = summary?.top_benefit_claims ? "Benefits found" : "General info";
  const riskLabel = summary?.top_risk_claims ? "Risks noted" : "Low detail";

  return (
    <article className={`ingredient-research-card ${open ? "open" : ""}`}>
      <button
        type="button"
        className="ingredient-card-header"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <div className="ingredient-card-title-block">
          <span className="ingredient-number">{ingredient.ingredient_order}</span>

          <div>
            <h4>{ingredient.ingredient_name}</h4>
            <div className="ingredient-card-badges">
              <span>{benefitLabel}</span>
              <span>{riskLabel}</span>
              <span>{articles.length} articles</span>
            </div>
          </div>
        </div>

        <span className="ingredient-toggle-icon">{open ? "−" : "+"}</span>
      </button>

      <div className="ingredient-card-body-wrapper">
        <div className="ingredient-card-body">
          <p className="ingredient-summary-text">
            {summary?.ingredient_summary || "No ingredient summary available yet."}
          </p>

          <div className="ingredient-insight-grid">
            <div className="ingredient-insight-card">
              <span>Benefits</span>
              <p>{summary?.top_benefit_claims || "No benefit claims listed."}</p>
            </div>

            <div className="ingredient-insight-card">
              <span>Risks</span>
              <p>{summary?.top_risk_claims || "No risk claims listed."}</p>
            </div>

            <div className="ingredient-insight-card">
              <span>Evidence</span>
              <p>{evidenceLabel}</p>
            </div>
          </div>

          <div className="research-links-header">
            <h5>Research Articles</h5>
            <span>{topArticles.length} shown</span>
          </div>

          {topArticles.length > 0 ? (
            <div className="research-link-list smooth-research-list">
              {topArticles.map((row, index) => {
                const article = row.Research_Articles;

                return (
                  <a
                    key={`${ingredient.ingredient_id}-${article?.url || index}`}
                    href={article?.url}
                    target="_blank"
                    rel="noreferrer"
                    className="research-link-card smooth-research-card"
                  >
                    <div>
                      <p className="research-category-line">
                        <strong>{row.research_category || "Research"}</strong>
                        {row.evidence_strength && ` • ${row.evidence_strength}`}
                      </p>

                      <h6>{article?.title || "View research article"}</h6>

                      <p className="muted-text">
                        {[article?.journal, article?.publication_year]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>
                    </div>

                    <span className="research-arrow">↗</span>
                  </a>
                );
              })}
            </div>
          ) : (
            <p className="no-research-text">No research links available.</p>
          )}
        </div>
      </div>
    </article>
  );
}

function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProduct() {
      setLoading(true);

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
              ingredient_id,
              ingredient_name,
              Ingredient_Research_Summary (
                ingredient_summary,
                top_benefit_claims,
                top_risk_claims,
                strongest_evidence
              ),
              Ingredient_Research_Articles (
                research_category,
                evidence_direction,
                evidence_strength,
                relevance_score,
                Research_Articles (
                  title,
                  journal,
                  publication_year,
                  url
                )
              )
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
      } else {
        setProduct(null);
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
      .map((row) => ({
        ingredient_order: row.ingredient_order,
        percentage: row.percentage,
        ...row.Ingredients,
      }))
      .filter((ingredient) => ingredient?.ingredient_name) || [];

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
              {product.description || "No Product Description Available"}
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

            <div className="product-detail-section ingredient-research-section">
              {/* Replace your always-visible ingredients block with this pattern inside ProductDetails.jsx */}
              <details className="product-ingredients-dropdown">
                <summary>Ingredient Details</summary>
                <div className="product-ingredients-dropdown-content">
                    {ingredients.length > 0 ? (
                    <div className="ingredients-list smooth-ingredients-list">
                      {ingredients.map((ingredient) => (
                        <IngredientCard
                          key={`${ingredient.ingredient_id}-${ingredient.ingredient_order}`}
                          ingredient={ingredient}
                        />
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
