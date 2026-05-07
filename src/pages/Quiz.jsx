import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Quiz.css";

function Quiz() {
  const navigate = useNavigate();

  const questions = [
    {
      id: "q1",
      question: "What is your skin type?",
      options: [
        { label: "Dry", value: "dry" },
        { label: "Oily", value: "oily" },
        { label: "Combination", value: "combination" },
        { label: "Sensitive", value: "sensitive" },
      ],
    },
    {
      id: "q2",
      question: "What is your main skin concern?",
      options: [
        { label: "Acne / Breakouts", value: "acne" },
        { label: "Redness", value: "redness" },
        { label: "Dark Spots", value: "darkspots" },
        { label: "Dryness / Dullness", value: "dryness" },
      ],
    },
    {
      id: "q3",
      question: "How much time do you want to spend on skincare?",
      options: [
        { label: "2 mins", value: "twomin" },
        { label: "5-10 mins", value: "fivetenmin" },
        { label: "15-20 mins", value: "fifteentwentymin" },
        { label: "FULL routine", value: "fullroutine" },
      ],
    },
    {
      id: "q4",
      question: "What kind of ingredients do you want?",
      options: [
        { label: "All Natural", value: "natural" },
        { label: "Science-backed", value: "sciencebacked" },
        { label: "Mix of Both", value: "mix" },
        { label: "Whatever Works", value: "anything" },
      ],
    },
    {
      id: "q5",
      question: "What is your routine missing?",
      options: [
        { label: "SPF", value: "spf" },
        { label: "Vitamin C", value: "vitaminc" },
        { label: "Moisturizer", value: "moisturizer" },
        { label: "Eye Cream", value: "eyecream" },
      ],
    },
  ];

  const categoryMap = {
    Cleanser: 1,
    Moisturizer: 2,
    Sunscreen: 3,
    Serum: 4,
    Treatment: 5,
    "Eye Cream": 6,
    "Lip Care": 7,
  };

  const routineByTime = {
    twomin: ["Cleanser", "Moisturizer", "Sunscreen"],
    fivetenmin: ["Cleanser", "Serum", "Moisturizer", "Sunscreen"],
    fifteentwentymin: [
      "Cleanser",
      "Serum",
      "Moisturizer",
      "Sunscreen",
      "Eye Cream",
    ],
    fullroutine: [
      "Cleanser",
      "Serum",
      "Moisturizer",
      "Sunscreen",
      "Eye Cream",
    ],
  };

  const missingMap = {
    spf: "Sunscreen",
    vitaminc: "Serum",
    moisturizer: "Moisturizer",
    eyecream: "Eye Cream",
  };

  const categoryDisplayNames = {
    Cleanser: "Cleanser",
    Serum: "Serum",
    Moisturizer: "Moisturizer",
    Sunscreen: "SPF",
    "Eye Cream": "Eye Cream",
  };

  const routineStepNames = {
    Cleanser: "Cleanser",
    Serum: "Serum",
    Moisturizer: "Moisturizer",
    Sunscreen: "SPF",
    "Eye Cream": "Eye Cream",
    Treatment: "Treatment",
  };

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null,
  });

  const [showResult, setShowResult] = useState(false);
  const [routineProducts, setRoutineProducts] = useState([]);
  const [loadingRoutine, setLoadingRoutine] = useState(false);
  const [routineError, setRoutineError] = useState("");

  const [savingRoutine, setSavingRoutine] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const [hasLoadedSavedQuiz, setHasLoadedSavedQuiz] = useState(false);

  const QUIZ_STORAGE_KEY = "poredecisions_quiz_state";

  useEffect(() => {
    const savedQuiz = sessionStorage.getItem(QUIZ_STORAGE_KEY);

    if (savedQuiz) {
      try {
        const parsed = JSON.parse(savedQuiz);

        setCurrentQuestion(parsed.currentQuestion ?? 0);
        setAnswers(
          parsed.answers ?? {
            q1: null,
            q2: null,
            q3: null,
            q4: null,
            q5: null,
          }
        );
        setShowResult(parsed.showResult ?? false);
        setRoutineProducts(parsed.routineProducts ?? []);
      } catch (error) {
        console.error("Failed to restore quiz state:", error);
        sessionStorage.removeItem(QUIZ_STORAGE_KEY);
      }
    }

    setHasLoadedSavedQuiz(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedSavedQuiz) return;

    sessionStorage.setItem(
      QUIZ_STORAGE_KEY,
      JSON.stringify({
        currentQuestion,
        answers,
        showResult,
        routineProducts,
      })
    );
  }, [
    hasLoadedSavedQuiz,
    currentQuestion,
    answers,
    showResult,
    routineProducts,
  ]);

  const totalQuestions = questions.length;
  const current = questions[currentQuestion];

  const handleSelect = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const getRoutineTitle = () => {
    if (answers.q2 === "acne") return "Clear Skin Routine";
    if (answers.q2 === "redness") return "Calm & Soothe Routine";
    if (answers.q2 === "darkspots") return "Brightening Routine";
    if (answers.q2 === "dryness") return "Hydration Boost Routine";
    return "Your Personalized Routine";
  };

  const getRoutineDescription = () => {
    let description = "Here is a skincare routine based on your answers.";

    if (answers.q2 === "acne") {
      description =
        "Your routine focuses on balancing oil, supporting clearer-looking skin, and keeping your skin barrier comfortable.";
    } else if (answers.q2 === "redness") {
      description =
        "Your routine focuses on calming products that support the skin barrier without overwhelming sensitive skin.";
    } else if (answers.q2 === "darkspots") {
      description =
        "Your routine focuses on brightening, evening the look of skin tone, and keeping your skin hydrated.";
    } else if (answers.q2 === "dryness") {
      description =
        "Your routine focuses on hydration, softness, and helping your skin feel smoother and less dull.";
    }

    if (answers.q4 === "natural") {
      description += " You also prefer a more natural-feeling skincare style.";
    } else if (answers.q4 === "sciencebacked") {
      description += " You also prefer science-backed ingredients.";
    } else if (answers.q4 === "mix") {
      description += " You like a balance of gentle and effective ingredients.";
    } else if (answers.q4 === "anything") {
      description +=
        " Since you are open to whatever works, your routine is based mostly on skin needs.";
    }

    return description;
  };

  const getNeededCategories = () => {
    const time = answers.q3;
    const missing = answers.q5;
    let categories = routineByTime[time] || [
      "Cleanser",
      "Moisturizer",
      "Sunscreen",
    ];

    const missingCategory = missingMap[missing];

    if (missingCategory && !categories.includes(missingCategory)) {
      categories = [...categories, missingCategory];
    }

    return categories;
  };

  const getSearchKeywords = () => {
    const keywords = [];

    if (answers.q1 === "dry") {
      keywords.push(
        "dry",
        "hydrating",
        "hydration",
        "moisture",
        "moisturizing",
        "ceramide",
        "hyaluronic",
        "cream"
      );
    }

    if (answers.q1 === "oily") {
      keywords.push(
        "oily",
        "oil-free",
        "oil control",
        "gel",
        "foaming",
        "mattifying",
        "lightweight"
      );
    }

    if (answers.q1 === "combination") {
      keywords.push(
        "combination",
        "balancing",
        "lightweight",
        "gel",
        "non-greasy"
      );
    }

    if (answers.q1 === "sensitive") {
      keywords.push(
        "sensitive",
        "gentle",
        "soothing",
        "fragrance-free",
        "calming",
        "barrier"
      );
    }

    if (answers.q2 === "acne") {
      keywords.push(
        "acne",
        "breakout",
        "blemish",
        "salicylic",
        "niacinamide",
        "clarifying",
        "pore"
      );
    }

    if (answers.q2 === "redness") {
      keywords.push(
        "redness",
        "calm",
        "calming",
        "soothe",
        "soothing",
        "centella",
        "barrier"
      );
    }

    if (answers.q2 === "darkspots") {
      keywords.push(
        "dark spot",
        "brightening",
        "brighten",
        "vitamin c",
        "even tone",
        "hyperpigmentation",
        "radiance"
      );
    }

    if (answers.q2 === "dryness") {
      keywords.push(
        "dryness",
        "hydrating",
        "hydration",
        "hyaluronic",
        "moisture",
        "glow",
        "dewy"
      );
    }

    if (answers.q4 === "natural") {
      keywords.push(
        "natural",
        "botanical",
        "aloe",
        "green tea",
        "plant",
        "extract"
      );
    }

    if (answers.q4 === "sciencebacked") {
      keywords.push(
        "retinol",
        "niacinamide",
        "ceramide",
        "hyaluronic",
        "salicylic",
        "spf",
        "dermatologist"
      );
    }

    if (answers.q4 === "mix") {
      keywords.push(
        "gentle",
        "effective",
        "botanical",
        "niacinamide",
        "hyaluronic",
        "ceramide"
      );
    }

    if (answers.q5 === "spf") {
      keywords.push("spf", "sunscreen", "broad spectrum", "uv");
    }

    if (answers.q5 === "vitaminc") {
      keywords.push("vitamin c", "brightening", "radiance", "glow");
    }

    if (answers.q5 === "moisturizer") {
      keywords.push("moisturizer", "moisture", "hydrating", "cream");
    }

    if (answers.q5 === "eyecream") {
      keywords.push("eye", "eye cream", "puffiness", "dark circles");
    }

    return keywords;
  };

  const scoreProduct = (product, keywords, categoryName) => {
    const productText = `
      ${product.prod_name || ""}
      ${product.description || ""}
      ${product.Brands?.brand_name || ""}
    `.toLowerCase();

    let score = 0;

    keywords.forEach((keyword) => {
      if (productText.includes(keyword.toLowerCase())) {
        score += 3;
      }
    });

    if (answers.q5 === "vitaminc" && categoryName === "Serum") {
      if (productText.includes("vitamin c") || productText.includes("bright")) {
        score += 6;
      }
    }

    if (answers.q5 === "spf" && categoryName === "Sunscreen") {
      if (productText.includes("spf") || productText.includes("sunscreen")) {
        score += 6;
      }
    }

    if (answers.q5 === "moisturizer" && categoryName === "Moisturizer") {
      if (productText.includes("moisture") || productText.includes("hydrating")) {
        score += 6;
      }
    }

    if (answers.q5 === "eyecream" && categoryName === "Eye Cream") {
      if (productText.includes("eye")) {
        score += 6;
      }
    }

    score += Math.random();

    return score;
  };

  const fetchBestProductForCategory = async (categoryName) => {
    const categoryId = categoryMap[categoryName];

    if (!categoryId) {
      console.error("No category id found for:", categoryName);
      return null;
    }

    const { data: categoryRows, error: categoryError } = await supabase
      .from("Product_Category")
      .select("product_id")
      .eq("category_id", categoryId)
      .limit(200);

    if (categoryError) {
      console.error(`Error fetching category rows for ${categoryName}:`, categoryError);
      return null;
    }

    const productIds = categoryRows?.map((row) => row.product_id) || [];

    if (productIds.length === 0) {
      console.warn(`No product ids found for category: ${categoryName}`);
      return null;
    }

    const { data: products, error: productError } = await supabase
      .from("Products")
      .select(`
        prod_id,
        prod_name,
        description,
        image_url,
        website_url,
        brand_id,
        Brands (
          brand_name
        )
      `)
      .in("prod_id", productIds)
      .limit(200);

    if (productError) {
      console.error(`Error fetching products for ${categoryName}:`, productError);
      return null;
    }

    if (!products || products.length === 0) {
      return null;
    }

    const keywords = getSearchKeywords();

    const rankedProducts = products
      .map((product) => ({
        ...product,
        categoryName,
        recommendationScore: scoreProduct(product, keywords, categoryName),
      }))
      .sort((a, b) => b.recommendationScore - a.recommendationScore);

    const topMatches = rankedProducts.slice(0, 5);
    const randomIndex = Math.floor(Math.random() * topMatches.length);

    return topMatches[randomIndex];
  };

  const fetchRoutineProducts = async () => {
    setRoutineError("");

    const neededCategories = getNeededCategories();

    const productPromises = neededCategories.map((category) =>
      fetchBestProductForCategory(category)
    );

    const products = await Promise.all(productPromises);
    const filteredProducts = products.filter(Boolean);

    if (filteredProducts.length === 0) {
      setRoutineError("No matching products were found. Please try again.");
    }

    return filteredProducts;
  };

  const saveQuizRoutine = async () => {
    setSaveMessage("");
    setSavingRoutine(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSavingRoutine(false);
      navigate("/signin?redirectTo=/quiz");
      return;
    }

    if (routineProducts.length === 0) {
      setSavingRoutine(false);
      setSaveMessage("Build a routine before saving.");
      return;
    }

    const routineName = getRoutineTitle();

    const { data: routineData, error: routineError } = await supabase
      .from("Skincare_Routines")
      .insert({
        user_id: user.id,
        routine_name: routineName,
      })
      .select("routine_id")
      .single();

    if (routineError) {
      setSavingRoutine(false);
      setSaveMessage(routineError.message);
      return;
    }

    const routineProductsToInsert = routineProducts.map((product, index) => ({
      routine_id: routineData.routine_id,
      product_id: product.prod_id,
      step_name: routineStepNames[product.categoryName] || product.categoryName,
      step_order: index + 1,
      time_of_day: "daytime",
    }));

    const { error: productsError } = await supabase
      .from("Routine_Products")
      .insert(routineProductsToInsert);

    setSavingRoutine(false);

    if (productsError) {
      setSaveMessage(productsError.message);
      return;
    }

    setSaveMessage("Routine saved to your routines!");
  };

  const handleNext = async () => {
    const currentId = questions[currentQuestion].id;

    if (!answers[currentId]) {
      alert("Please select an answer before continuing.");
      return;
    }

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      return;
    }

    setLoadingRoutine(true);
    setShowResult(true);
    setSaveMessage("");

    const products = await fetchRoutineProducts();

    setRoutineProducts(products);
    setLoadingRoutine(false);
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRestart = () => {
    sessionStorage.removeItem(QUIZ_STORAGE_KEY);

    setCurrentQuestion(0);
    setAnswers({ q1: null, q2: null, q3: null, q4: null, q5: null });
    setShowResult(false);
    setRoutineProducts([]);
    setRoutineError("");
    setLoadingRoutine(false);
    setSaveMessage("");
  };

  const progressPercent = showResult
    ? 100
    : ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        <header className="top-bar">
          <h1>PoreDecisions</h1>
          <p>Your personalized skincare routine finder</p>
          <Link to="/home" className="home-link">
            Back to Home
          </Link>
        </header>

        <div className="progress-wrapper">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="progress-text">
            {showResult
              ? "Quiz Complete"
              : `Question ${currentQuestion + 1} of ${totalQuestions}`}
          </p>
        </div>

        {!showResult ? (
          <main>
            <section className="question active">
              <h2>{current.question}</h2>

              <div className="options">
                {current.options.map((option) => (
                  <button
                    key={option.value}
                    className={`option ${
                      answers[current.id] === option.value ? "selected" : ""
                    }`}
                    onClick={() => handleSelect(current.id, option.value)}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </section>

            <div className="navigation-buttons">
              <button
                id="prevBtn"
                onClick={handlePrev}
                style={{
                  visibility: currentQuestion === 0 ? "hidden" : "visible",
                }}
                type="button"
              >
                Back
              </button>

              <button id="nextBtn" onClick={handleNext} type="button">
                {currentQuestion === totalQuestions - 1 ? "See Results" : "Next"}
              </button>
            </div>
          </main>
        ) : (
          <main>
            <section className="question active">
              <h2>Your Recommended Routine</h2>

              <div className="result-card">
                <h3>{getRoutineTitle()}</h3>
                <p>{getRoutineDescription()}</p>

                {loadingRoutine ? (
                  <p>Building your routine...</p>
                ) : routineError ? (
                  <p className="routine-error">{routineError}</p>
                ) : (
                  <div className="routine-steps">
                    <div className="quiz-result-actions">
                      <h4>Suggested Routine:</h4>

                      <button
                        type="button"
                        className="quiz-save-routine-btn"
                        onClick={saveQuizRoutine}
                        disabled={savingRoutine || routineProducts.length === 0}
                      >
                        {savingRoutine
                          ? "Saving..."
                          : "Save Full Routine"}
                      </button>
                    </div>

                    {saveMessage && (
                      <p
                        className={`quiz-save-message ${
                          saveMessage.includes("saved") ? "success" : "error"
                        }`}
                      >
                        {saveMessage}
                      </p>
                    )}

                    <div className="routine-product-grid">
                      {routineProducts.map((product) => (
                        <div
                          key={`${product.categoryName}-${product.prod_id}`}
                          className="routine-product-card"
                        >
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.prod_name}
                              className="routine-product-img"
                            />
                          ) : (
                            <div className="routine-product-placeholder">🧴</div>
                          )}

                          <p className="routine-step-name">
                            {categoryDisplayNames[product.categoryName] ||
                              product.categoryName}
                          </p>

                          <h4>{product.prod_name}</h4>

                          <p className="routine-brand">
                            {product.Brands?.brand_name || "Unknown Brand"}
                          </p>

                          {product.description && (
                            <p className="routine-description">
                              {product.description}
                            </p>
                          )}

                          <Link
                            to={`/products/${product.prod_id}`}
                            className="routine-view-link"
                          >
                            View Product
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button id="restartBtn" onClick={handleRestart} type="button">
                Retake Quiz
              </button>
            </section>
          </main>
        )}
      </div>
    </div>
  );
}

export default Quiz;
