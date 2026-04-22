import { useState } from "react";
import { Link } from "react-router-dom";
import "./Quiz.css";

function Quiz() {
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

  const productCatalog = {
    cleanser: {
      dry: "CeraVe Hydrating Facial Cleanser",
      oily: "La Roche-Posay Toleriane Purifying Foaming Cleanser",
      combination: "La Roche-Posay Toleriane Purifying Foaming Cleanser",
      sensitive: "CeraVe Hydrating Facial Cleanser",
    },
    moisturizer: {
      dry: "CeraVe Moisturizing Cream",
      oily: "La Roche-Posay Toleriane Double Repair Matte Moisturizer",
      combination: "La Roche-Posay Toleriane Double Repair Face Moisturizer",
      sensitive: "La Roche-Posay Toleriane Double Repair Face Moisturizer",
    },
    spf: "EltaMD UV Clear Broad-Spectrum SPF 46",
    vitaminC: "CeraVe Skin Renewing Vitamin C Serum",
    eyeCream: "CeraVe Eye Repair Cream",
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

  const totalQuestions = questions.length;
  const current = questions[currentQuestion];

  const handleSelect = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const calculateResult = () => {
    const skinType = answers.q1;
    const concern = answers.q2;
    const time = answers.q3;
    const ingredientStyle = answers.q4;
    const missing = answers.q5;

    let title = "Your Personalized Routine";
    let description = "Here is a skincare routine based on your answers.";
    let routine = [];

    const cleanser = productCatalog.cleanser[skinType];
    const moisturizer = productCatalog.moisturizer[skinType];
    let serum = null;
    let addOn = null;
    const sunscreen = productCatalog.spf;

    if (concern === "acne") {
      title = "Clear Skin Routine";
      description =
        "You seem to want a routine that helps balance oil, support clearer-looking skin, and still keep your skin comfortable.";
      serum = "Niacinamide or blemish-support serum";
    } else if (concern === "redness") {
      title = "Calm & Soothe Routine";
      description =
        "Your results suggest a gentler routine focused on calming your skin barrier and avoiding overload.";
      serum = "Soothing barrier-support serum";
    } else if (concern === "darkspots") {
      title = "Brightening Routine";
      description =
        "Your routine is focused on helping with dullness and uneven tone while keeping your skin hydrated and supported.";
      serum = productCatalog.vitaminC;
    } else if (concern === "dryness") {
      title = "Hydration Boost Routine";
      description =
        "Your results point toward a moisture-focused routine that helps your skin feel softer, smoother, and less dull.";
      serum = "Hydrating serum";
    }

    if (ingredientStyle === "natural") {
      description +=
        " You also prefer a more natural-feeling skincare style, so your routine leans simple and gentle.";
    } else if (ingredientStyle === "sciencebacked") {
      description +=
        " You also prefer science-backed ingredients, so your routine includes products known for barrier support, hydration, and brightening.";
    } else if (ingredientStyle === "mix") {
      description +=
        " You like a balance of gentle and effective ingredients, so this routine mixes comfort with results.";
    } else if (ingredientStyle === "anything") {
      description +=
        " Since you are open to whatever works, your routine is based mostly on function and skin needs.";
    }

    if (missing === "spf") {
      addOn = productCatalog.spf;
    } else if (missing === "vitaminc") {
      addOn = productCatalog.vitaminC;
    } else if (missing === "moisturizer") {
      addOn = moisturizer;
    } else if (missing === "eyecream") {
      addOn = productCatalog.eyeCream;
    }

    if (time === "twomin") {
      routine = [
        `Cleanser: ${cleanser}`,
        `Moisturizer: ${moisturizer}`,
        `SPF: ${sunscreen}`,
      ];
    } else if (time === "fivetenmin") {
      routine = [
        `Cleanser: ${cleanser}`,
        `Treatment: ${serum ? serum : productCatalog.vitaminC}`,
        `Moisturizer: ${moisturizer}`,
        `SPF: ${sunscreen}`,
      ];
    } else if (time === "fifteentwentymin") {
      routine = [
        `AM Cleanser: ${cleanser}`,
        `AM Serum: ${serum ? serum : productCatalog.vitaminC}`,
        `Moisturizer: ${moisturizer}`,
        `SPF: ${sunscreen}`,
        `Extra Step: ${addOn ? addOn : productCatalog.eyeCream}`,
      ];
    } else if (time === "fullroutine") {
      routine = [
        `Cleanser: ${cleanser}`,
        `Treatment Serum: ${serum ? serum : productCatalog.vitaminC}`,
        `Moisturizer: ${moisturizer}`,
        `Daily SPF: ${sunscreen}`,
        `Extra Product: ${addOn ? addOn : productCatalog.eyeCream}`,
      ];
    }

    if (addOn && !routine.some((step) => step.includes(addOn))) {
      routine.push(`Bonus Pick: ${addOn}`);
    }

    return { title, description, routine };
  };

  const handleNext = () => {
    const currentId = questions[currentQuestion].id;

    if (!answers[currentId]) {
      alert("Please select an answer before continuing.");
      return;
    }

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({
      q1: null,
      q2: null,
      q3: null,
      q4: null,
      q5: null,
    });
    setShowResult(false);
  };

  const progressPercent = showResult
    ? 100
    : ((currentQuestion + 1) / totalQuestions) * 100;

  const result = calculateResult();

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
                style={{ visibility: currentQuestion === 0 ? "hidden" : "visible" }}
              >
                Back
              </button>
              <button id="nextBtn" onClick={handleNext}>
                {currentQuestion === totalQuestions - 1 ? "See Results" : "Next"}
              </button>
            </div>
          </main>
        ) : (
          <main>
            <section className="question active">
              <h2>Your Recommended Routine</h2>

              <div className="result-card">
                <h3>{result.title}</h3>
                <p>{result.description}</p>

                <div className="routine-steps">
                  <h4>Suggested Routine:</h4>
                  <ul>
                    {result.routine.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <button id="restartBtn" onClick={handleRestart}>
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