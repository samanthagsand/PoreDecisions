import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const daytimeSteps = ["Cleanser", "Moisturizer", "Serum", "Eye Cream", "SPF"];

const nighttimeSteps = [
  "Cleanser",
  "Moisturizer",
  "Serum",
  "Eye Cream",
  "Treatment",
];

function EmptyProductCard({ step, timeOfDay }) {
  return (
    <div className="routine-product-card empty-routine-card">
      <div className="routine-step-badge">{step}</div>

      <div className="routine-empty-icon">＋</div>

      <h3>Add {step}</h3>

      <p>Choose a product for your {timeOfDay} routine.</p>

      <Link
        to={`/products?routineStep=${encodeURIComponent(
          step
        )}&timeOfDay=${timeOfDay}&returnTo=/routine`}
        className="routine-add-btn"
      >
        Find Product
      </Link>
    </div>
  );
}

function getProductPrice(product) {
  if (!product) return 0;

  const rawPrice =
    product.price ??
    product.product_price ??
    product.current_price ??
    product.Prices?.[0]?.price ??
    product.Product_Prices?.[0]?.price ??
    product.prices?.[0]?.price ??
    0;

  return Number(rawPrice) || 0;
}

function normalizeSavedProduct(product) {
  if (!product) return null;

  return {
    ...product,
    prod_id: product.prod_id,
    prod_name: product.prod_name,
    image_url: product.image_url,
    Brands: product.Brands,
    Prices: product.Prices || [],
  };
}

function RoutineSummary({ title, products }) {
  const totalPrice = products.reduce((sum, product) => {
    return sum + getProductPrice(product);
  }, 0);

  const filledCount = products.filter(Boolean).length;

  return (
    <div className="routine-summary-card">
      <h3>{title}</h3>

      <p>
        {filledCount} of {products.length} products added
      </p>

      <div className="routine-summary-row">
        <span>Total Price</span>
        <strong>${totalPrice.toFixed(2)}</strong>
      </div>
    </div>
  );
}

function RoutineSection({
  title,
  subtitle,
  steps,
  timeOfDay,
  selectedProducts,
  removeProduct,
  clearRoutine,
  }) {
  return (
    <section className="routine-section">
      <div className="routine-section-header">
        <div>
          <p className="routine-eyebrow">{timeOfDay} routine</p>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        <button
          type="button"
          className="routine-clear-btn"
          onClick={() => clearRoutine(timeOfDay)}
        >
          Clear All
        </button>
      </div>

      <div className="routine-grid">
        {steps.map((step) => {
          const product = selectedProducts[step];

          if (!product) {
            return (
              <EmptyProductCard key={step} step={step} timeOfDay={timeOfDay} />
            );
          }

          return (
            <div key={step} className="routine-product-card">
              <div className="routine-step-badge">{step}</div>

              <div className="routine-product-image-wrap">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.prod_name} />
                ) : (
                  <span>🧴</span>
                )}
              </div>

              <h3>{product.prod_name}</h3>
              <p>{product.Brands?.brand_name || "Unknown Brand"}</p>

              <strong className="routine-price">
                ${getProductPrice(product).toFixed(2)}
              </strong>

              <div className="routine-card-actions">
                <Link
                  to={`/products?routineStep=${encodeURIComponent(
                    step
                  )}&timeOfDay=${timeOfDay}&returnTo=/routine`}
                  className="routine-change-btn"
                >
                  Change
                </Link>

                <button
                  type="button"
                  className="routine-remove-btn"
                  onClick={() => removeProduct(timeOfDay, step)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <RoutineSummary
        title={`${title} Summary`}
        products={steps.map((step) => selectedProducts[step])}
      />
    </section>
  );
}

function Routine() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [routineName, setRoutineName] = useState(() => {
    return localStorage.getItem("routineName") || "";
  });

  const [daytimeProducts, setDaytimeProducts] = useState(() => {
    return JSON.parse(localStorage.getItem("daytimeProducts")) || {};
  });

  const [nighttimeProducts, setNighttimeProducts] = useState(() => {
    return JSON.parse(localStorage.getItem("nighttimeProducts")) || {};
  });

  const navigate = useNavigate();
  const [savedRoutines, setSavedRoutines] = useState([]);
  const [saving, setSaving] = useState(false);
  const [routineMessage, setRoutineMessage] = useState("");
  const [loadedRoutineId, setLoadedRoutineId] = useState(null);

  useEffect(() => {
    localStorage.setItem("routineName", routineName);
  }, [routineName]);

  useEffect(() => {
    localStorage.setItem("daytimeProducts", JSON.stringify(daytimeProducts));
  }, [daytimeProducts]);

  useEffect(() => {
    localStorage.setItem("nighttimeProducts", JSON.stringify(nighttimeProducts));
  }, [nighttimeProducts]);

  useEffect(() => {
    loadSavedRoutines();
  }, []);

  useEffect(() => {
    const addedProductRaw = searchParams.get("addedProduct");

    if (!addedProductRaw) return;

    const addedProduct = JSON.parse(decodeURIComponent(addedProductRaw));

    if (addedProduct.timeOfDay === "daytime") {
      setDaytimeProducts((prev) => ({
        ...prev,
        [addedProduct.routineStep]: addedProduct.product,
      }));
    }

    if (addedProduct.timeOfDay === "nighttime") {
      setNighttimeProducts((prev) => ({
        ...prev,
        [addedProduct.routineStep]: addedProduct.product,
      }));
    }

    setSearchParams({});
  }, [searchParams, setSearchParams]);


  async function saveRoutine(timeOfDay) {
    setRoutineMessage("");
    setSaving(true);
  
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) {
      setSaving(false);
      navigate("/signin?redirectTo=/routine");
      return;
    }
  
    const selectedProducts =
      timeOfDay === "daytime" ? daytimeProducts : nighttimeProducts;
  
    const steps = timeOfDay === "daytime" ? daytimeSteps : nighttimeSteps;
  
    const filledProducts = steps
      .map((step, index) => ({
        step_name: step,
        step_order: index + 1,
        time_of_day: timeOfDay,
        product: selectedProducts[step],
      }))
      .filter((item) => item.product);
  
    if (filledProducts.length === 0) {
      setSaving(false);
      setRoutineMessage("Add at least one product before saving.");
      return;
    }
  
    const finalRoutineName =
      routineName.trim() ||
      `${timeOfDay === "daytime" ? "Daytime" : "Nighttime"} Routine`;
  
    const { data: routineData, error: routineError } = await supabase
      .from("Skincare_Routines")
      .insert({
        user_id: user.id,
        routine_name: finalRoutineName,
      })
      .select("routine_id")
      .single();
  
    if (routineError) {
      setSaving(false);
      setRoutineMessage(routineError.message);
      return;
    }
  
    const routineProductsToInsert = filledProducts.map((item) => ({
      routine_id: routineData.routine_id,
      product_id: item.product.prod_id,
      step_name: item.step_name,
      step_order: item.step_order,
      time_of_day: item.time_of_day,
    }));
  
    const { error: productsError } = await supabase
      .from("Routine_Products")
      .insert(routineProductsToInsert);
  
    setSaving(false);
  
    if (productsError) {
      setRoutineMessage(productsError.message);
      return;
    }
  
    setRoutineMessage("Routine saved!");
    loadSavedRoutines();
  }
  async function deleteSavedRoutine(routineId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this routine?"
    );
  
    if (!confirmDelete) return;
  
    const { error: productsError } = await supabase
      .from("Routine_Products")
      .delete()
      .eq("routine_id", routineId);
  
    if (productsError) {
      setRoutineMessage(productsError.message);
      return;
    }
  
    const { error: routineError } = await supabase
      .from("Skincare_Routines")
      .delete()
      .eq("routine_id", routineId);
  
    if (routineError) {
      setRoutineMessage(routineError.message);
      return;
    }
  
    setSavedRoutines((current) =>
      current.filter((routine) => routine.routine_id !== routineId)
    );
  
    setRoutineMessage("Routine deleted.");
  }

  async function loadSavedRoutines() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) return;
  
    const { data, error } = await supabase
      .from("Skincare_Routines")
      .select(`
        routine_id,
        routine_name,
        created_at,
        Routine_Products (
          routine_product_id,
          product_id,
          step_name,
          step_order,
          time_of_day,
          Products (
            prod_id,
            prod_name,
            image_url,
            Brands (
              brand_name
            ),
            Prices (
              store_name,
              price,
              size
            )
          )
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
  
    if (!error) {
      setSavedRoutines(data || []);
    }
  }

  function loadSavedRoutine(routine) {
    const routineProducts = routine.Routine_Products || [];

    const nextDaytimeProducts = {};
    const nextNighttimeProducts = {};

    routineProducts.forEach((item) => {
      const product = normalizeSavedProduct(item.Products);

      if (!product || !item.step_name) return;

      if (item.time_of_day === "daytime") {
        nextDaytimeProducts[item.step_name] = product;
      }

      if (item.time_of_day === "nighttime") {
        nextNighttimeProducts[item.step_name] = product;
      }
    });

    setRoutineName(routine.routine_name || "");
    setDaytimeProducts(nextDaytimeProducts);
    setNighttimeProducts(nextNighttimeProducts);
    setLoadedRoutineId(routine.routine_id);
    setRoutineMessage(`Loaded ${routine.routine_name || "saved routine"}.`);
  }

  function clearRoutine(timeOfDay) {
    if (timeOfDay === "daytime") {
      setDaytimeProducts({});
    }
  
    if (timeOfDay === "nighttime") {
      setNighttimeProducts({});
    }
  }

  function removeProduct(timeOfDay, step) {
    if (timeOfDay === "daytime") {
      setDaytimeProducts((prev) => {
        const updated = { ...prev };
        delete updated[step];
        return updated;
      });
    }

    if (timeOfDay === "nighttime") {
      setNighttimeProducts((prev) => {
        const updated = { ...prev };
        delete updated[step];
        return updated;
      });
    }
  }

  return (
    <main className="routine-page">
      <div className="routine-layout">
        <aside className="routine-sidebar">
          <h2>Saved Routines</h2>

          {savedRoutines.length === 0 ? (
            <p className="routine-sidebar-empty">No saved routines yet.</p>
          ) : (
            savedRoutines.map((routine) => (
              <div
                key={routine.routine_id}
                className={`saved-routine-card ${
                  loadedRoutineId === routine.routine_id ? "active-saved-routine" : ""
                }`}
              >
                <div className="saved-routine-card-header">
                  <div>
                    <h3>{routine.routine_name}</h3>
                    <p>
                      {routine.Routine_Products?.length || 0} products saved
                    </p>
                  </div>

                  {loadedRoutineId === routine.routine_id && (
                    <span className="saved-routine-loaded-pill">Loaded</span>
                  )}
                </div>

                <div className="saved-routine-products">
                  {routine.Routine_Products?.map((item) => (
                    <div key={item.routine_product_id} className="saved-routine-item">
                      <span>{item.time_of_day} · {item.step_name}</span>
                      <strong>{item.Products?.prod_name || "Unknown Product"}</strong>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="routine-load-btn"
                  onClick={() => loadSavedRoutine(routine)}
                >
                  Load Routine
                </button>

                <button
                  type="button"
                  className="saved-routine-delete-btn"
                  onClick={() => deleteSavedRoutine(routine.routine_id)}
                >
                  Delete Routine
                </button>
              </div>
            ))
          )}
        </aside>

      <div className="routine-container">
        <section className="routine-hero">
          <p className="routine-eyebrow">Build your skincare plan</p>

          <h1>Your Routine</h1>

          <p>
            Create a full morning and night routine with products that fit your
            skin goals.
          </p>

          <div className="routine-name-card">
            <label htmlFor="routineName">Routine Name</label>
            <input
              id="routineName"
              type="text"
              value={routineName}
              onChange={(e) => setRoutineName(e.target.value)}
              placeholder="Example: Clear Skin Glow Routine"
            />
          </div>

          <div className="routine-save-actions">
            <button
              type="button"
              className="routine-save-btn"
              disabled={saving}
              onClick={() => saveRoutine("daytime")}
            >
              {saving ? "Saving..." : "Save Day Routine"}
            </button>

            <button
              type="button"
              className="routine-save-btn night-save-btn"
              disabled={saving}
              onClick={() => saveRoutine("nighttime")}
            >
              {saving ? "Saving..." : "Save Night Routine"}
            </button>
          </div>

          {routineMessage && <p className="routine-message">{routineMessage}</p>}
        </section>

        <RoutineSection
          title="Daytime Routine"
          subtitle="Focus on protection, hydration, and lightweight products for the day."
          steps={daytimeSteps}
          timeOfDay="daytime"
          selectedProducts={daytimeProducts}
          removeProduct={removeProduct}
          clearRoutine={clearRoutine}
        />

        <RoutineSection
          title="Nighttime Routine"
          subtitle="Focus on cleansing, repairing, and deeper hydration while you sleep."
          steps={nighttimeSteps}
          timeOfDay="nighttime"
          selectedProducts={nighttimeProducts}
          removeProduct={removeProduct}
          clearRoutine={clearRoutine}
        />
      </div>
    </div>
  </main>
  );
}

export default Routine;