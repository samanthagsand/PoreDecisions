import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useNavigate, useSearchParams } from "react-router-dom";



const PRODUCTS_PER_PAGE = 50;

function Products() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  const [draftSearchTerm, setDraftSearchTerm] = useState("");
  const [draftCategoryFilter, setDraftCategoryFilter] = useState("");
  const [draftSkinTypeFilter, setDraftSkinTypeFilter] = useState("");
  const [draftSkinConcernFilter, setDraftSkinConcernFilter] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [skinTypeFilter, setSkinTypeFilter] = useState("");
  const [skinConcernFilter, setSkinConcernFilter] = useState("");

  const [categories, setCategories] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);
  const [skinConcerns, setSkinConcerns] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const routineStep = searchParams.get("routineStep");
  const timeOfDay = searchParams.get("timeOfDay");
  const returnTo = searchParams.get("returnTo");

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  useEffect(() => {
    async function getFilterOptions() {
      const { data: categoryData } = await supabase
        .from("Categories")
        .select("category_id, category_name")
        .order("category_id", { ascending: true });

      const { data: skinTypeData } = await supabase
        .from("Skin_Type")
        .select("skin_type_id, skin_type_name")
        .order("skin_type_id", { ascending: true });

      const { data: skinConcernData } = await supabase
        .from("Skin_Concerns")
        .select("skin_concern_id, skin_concern_name")
        .order("skin_concern_id", { ascending: true });

      setCategories(categoryData || []);
      setSkinTypes(skinTypeData || []);
      setSkinConcerns(skinConcernData || []);
    }

    getFilterOptions();
  }, []);

  useEffect(() => {
    async function getProducts() {
      setLoading(true);

      const from = (page - 1) * PRODUCTS_PER_PAGE;
      const to = from + PRODUCTS_PER_PAGE - 1;

      let productIdFilter = null;

      async function getMatchingProductIds(tableName, idColumn, selectedId) {
        if (!selectedId) return null;

        const { data, error } = await supabase
          .from(tableName)
          .select("prod_id")
          .eq(idColumn, Number(selectedId));

        if (error) {
          console.log(`${tableName} FILTER ERROR:`, error);
          return [];
        }

        return data?.map((row) => row.prod_id) || [];
      }

      if (skinTypeFilter) {
        const ids = await getMatchingProductIds(
          "Product_Skin_Types",
          "skin_type_id",
          skinTypeFilter
        );

        productIdFilter = productIdFilter
          ? productIdFilter.filter((id) => ids.includes(id))
          : ids;
      }

      if (skinConcernFilter) {
        const ids = await getMatchingProductIds(
          "Product_Skin_Concerns",
          "skin_concern_id",
          skinConcernFilter
        );

        productIdFilter = productIdFilter
          ? productIdFilter.filter((id) => ids.includes(id))
          : ids;
      }

      if (productIdFilter && productIdFilter.length === 0) {
        setProducts([]);
        setTotalProducts(0);
        setLoading(false);
        return;
      }

      let query = supabase
        .from("Products")
        .select(
          `
          prod_id,
          prod_name,
          description,
          brand_id,
          category,
          size,
          image_url,
          website_url,
          Brands (
            brand_name
          ),
          Prices (
            store_name,
            price,
            size
          )
        `,
          { count: "exact" }
        );

      if (searchTerm.trim()) {
        const cleanSearch = searchTerm.trim();
        query = query.or(
          `prod_name.ilike.%${cleanSearch}%,description.ilike.%${cleanSearch}%`
        );
      }

      if (categoryFilter) {
        query = query.eq("category", Number(categoryFilter));
      }

      if (productIdFilter) {
        query = query.in("prod_id", productIdFilter);
      }

      query = query.order("prod_id", { ascending: true }).range(from, to);

      const { data, error, count } = await query;

      console.log("ACTIVE CATEGORY FILTER:", categoryFilter);
      console.log("ACTIVE SKIN TYPE FILTER:", skinTypeFilter);
      console.log("ACTIVE SKIN CONCERN FILTER:", skinConcernFilter);
      console.log("PRODUCTS DATA:", data);
      console.log("PRODUCTS ERROR:", error);
      console.log("PRODUCT COUNT:", count);

      if (error) {
        setProducts([]);
        setTotalProducts(0);
      } else {
        setProducts(data || []);
        setTotalProducts(count || 0);
      }

      setLoading(false);
    }

    getProducts();
  }, [page, searchTerm, categoryFilter, skinTypeFilter, skinConcernFilter]);

  async function addProductToRoutine(product) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) {
      navigate(
        `/signin?redirectTo=${encodeURIComponent(
          `/products?routineStep=${routineStep}&timeOfDay=${timeOfDay}&returnTo=/routine`
        )}`
      );
      return;
    }
  
    const addedProduct = {
      routineStep,
      timeOfDay,
      product,
    };
  
    navigate(
      `${returnTo}?addedProduct=${encodeURIComponent(
        JSON.stringify(addedProduct)
      )}`
    );
  }

  function applyFilters() {
    setSearchTerm(draftSearchTerm);
    setCategoryFilter(draftCategoryFilter);
    setSkinTypeFilter(draftSkinTypeFilter);
    setSkinConcernFilter(draftSkinConcernFilter);
    setPage(1);
  }

  function clearFilters() {
    setDraftSearchTerm("");
    setDraftCategoryFilter("");
    setDraftSkinTypeFilter("");
    setDraftSkinConcernFilter("");

    setSearchTerm("");
    setCategoryFilter("");
    setSkinTypeFilter("");
    setSkinConcernFilter("");
    setPage(1);
  }

  return (
    <div className="page-shell products-shell">
      <div className="products-page-card">
        <div className="page-header">
          <h1 className="products-title">Products</h1>
          <p className="products-subtitle">
            Browse skincare products and view ingredient details.
          </p>
        </div>

        <div className="products-filter-card">
          <input
            type="text"
            placeholder="Search products..."
            value={draftSearchTerm}
            onChange={(e) => setDraftSearchTerm(e.target.value)}
            className="products-search"
          />

          <div className="filter-select-row">
            <select
              value={draftCategoryFilter}
              onChange={(e) => setDraftCategoryFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>

            <select
              value={draftSkinTypeFilter}
              onChange={(e) => setDraftSkinTypeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Skin Types</option>
              {skinTypes.map((type) => (
                <option key={type.skin_type_id} value={type.skin_type_id}>
                  {type.skin_type_name}
                </option>
              ))}
            </select>

            <select
              value={draftSkinConcernFilter}
              onChange={(e) => setDraftSkinConcernFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Skin Conditions</option>
              {skinConcerns.map((concern) => (
                <option
                  key={concern.skin_concern_id}
                  value={concern.skin_concern_id}
                >
                  {concern.skin_concern_name}
                </option>
              ))}
            </select>

            <button onClick={applyFilters} className="filter-search-btn">
              Search
            </button>

            <button onClick={clearFilters} className="filter-clear-btn">
              Clear
            </button>
          </div>
        </div>

        {loading ? (
          <p className="loading-text">Loading products...</p>
        ) : (
          <>
            <div className="products-grid">
              {products.map((product) => (
                <div key={product.prod_id} className="product-card">
                  <img
                    src={product.image_url}
                    alt={product.prod_name}
                    className="product-image"
                  />

                  <div className="product-card-content">
                    <p className="product-brand">
                      {product.Brands?.brand_name || "Unknown Brand"}
                    </p>

                    <h3>{product.prod_name}</h3>

                    <p className="product-description">
                      {product.description || ""}
                    </p>

                    {product.size && (
                      <p className="product-size">{product.size}</p>
                    )}

                    {product.Prices && product.Prices.length > 0 ? (
                      <div className="product-prices">
                        {product.Prices.map((priceItem, index) => (
                          <p key={index} className="product-price">
                            <span>{priceItem.store_name}</span>
                            <strong>${Number(priceItem.price).toFixed(2)}</strong>
                            {priceItem.size && <small>{priceItem.size}</small>}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="product-price unavailable">Price unavailable</p>
                    )}

                    <div className="product-buttons">
                      <Link
                        to={`/products/${product.prod_id}`}
                        className="product-btn details-btn"
                      >
                        View Details
                      </Link>

                      {routineStep && timeOfDay && (
                        <button
                          type="button"
                          className="routine-add-btn"
                          onClick={() => addProductToRoutine(product)}
                        >
                          Add to {timeOfDay} {routineStep}
                        </button>
                      )}

                      {product.website_url && (
                        <a
                          href={product.website_url}
                          target="_blank"
                          rel="noreferrer"
                          className="product-btn retailer-btn"
                        >
                          Retailer
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <p className="no-results">No products match your filters.</p>
            )}

            <div className="pagination-buttons">
              <button
                onClick={() => setPage((currentPage) => currentPage - 1)}
                disabled={page === 1}
                className="product-btn retailer-btn"
              >
                Previous
              </button>

              <span className="page-count">
                Page {page} of {totalPages || 1}
              </span>

              <button
                onClick={() => setPage((currentPage) => currentPage + 1)}
                disabled={page >= totalPages || totalPages === 0}
                className="product-btn retailer-btn"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Products;