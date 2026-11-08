import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const STATIC_RECIPES = [
  { _id: "1", title: "Elote (Mexican Street Corn)", image: "recipe-01.jpg", prepTime: "15 min", difficulty: "Easy", nutritionHighlight: "High in Fiber & Vitamin C", tags: ["Mexican", "Grilled"], video: "recipe-01-elote" },
  { _id: "2", title: "Creamy Corn Chowder", image: "recipe-02.jpg", prepTime: "35 min", difficulty: "Medium", nutritionHighlight: "Rich in Potassium & Folate", tags: ["Soup", "Comfort Food"], video: "recipe-02-chowder" },
  { _id: "3", title: "Blue Corn Tortillas", image: "recipe-03.jpg", prepTime: "20 min", difficulty: "Medium", nutritionHighlight: "Antioxidant-rich Anthocyanins", tags: ["Mexican", "Gluten-Free"], video: "recipe-03-tortilla" },
];

// Pexels sources (free license): 5616346 corncob on grill / 2882111 boiling corn cobs / 9737919 tortilla press
function videoBaseFor(recipe) {
  if (recipe?.video) return recipe.video;
  const byId = { "1": "recipe-01-elote", "2": "recipe-02-chowder", "3": "recipe-03-tortilla" };
  if (byId[recipe?._id]) return byId[recipe._id];
  const t = (recipe?.title || "").toLowerCase();
  if (t.includes("elote") || t.includes("street")) return "recipe-01-elote";
  if (t.includes("chowder") || t.includes("soup")) return "recipe-02-chowder";
  if (t.includes("tortilla")) return "recipe-03-tortilla";
  return null;
}

function RecipeVideo({ base, poster, className, style, title }) {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const play = () => v.play().catch(() => {});
    const pause = () => v.pause();
    let observer;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(([e]) => (e.isIntersecting ? play() : pause()), { threshold: 0.15 });
      observer.observe(v);
    }
    return () => observer?.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-label={title ? `${title} — video` : undefined}
      className={className}
      style={style}
    >
      <source src={`/media/videos/${base}-720.mp4`} type="video/mp4" media="(max-width: 767px)" />
      <source src={`/media/videos/${base}-1080.mp4`} type="video/mp4" />
    </video>
  );
}

function RecipeModal({ recipe, onClose }) {
  if (!recipe) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(26,18,8,0.85)",
        backdropFilter: "blur(12px)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--soft-white)",
          maxWidth: "640px",
          width: "100%",
          borderRadius: "4px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {videoBaseFor(recipe) ? (
          <RecipeVideo
            base={videoBaseFor(recipe)}
            poster={`/media/images/${recipe.image}`}
            title={recipe.title}
            className="warm-filter"
            style={{ width: "100%", height: "260px", objectFit: "cover", display: "block" }}
          />
        ) : (
          <img
            src={`/media/images/${recipe.image}`}
            alt={recipe.title}
            className="warm-filter"
            style={{ width: "100%", height: "260px", objectFit: "cover" }}
          />
        )}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "var(--deep-soil)",
            color: "var(--corn-gold)",
            border: "none",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            cursor: "pointer",
            fontFamily: "'Space Mono', monospace",
            fontSize: "1rem",
          }}
        >
          ✕
        </button>
        <div style={{ padding: "2rem" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", marginBottom: "0.5rem" }}>{recipe.title}</h3>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
            <span className={`difficulty-badge ${recipe.difficulty?.toLowerCase()}`}>{recipe.difficulty}</span>
            <span className="mono-label" style={{ color: "var(--muted-sage)", alignSelf: "center" }}>{recipe.prepTime}</span>
          </div>
          {recipe.ingredients && (
            <>
              <p className="mono-label" style={{ marginBottom: "0.5rem" }}>Ingredients</p>
              <ul style={{ listStyle: "disc", paddingLeft: "1.2rem", marginBottom: "1.5rem" }}>
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="body-text" style={{ fontSize: "0.95rem" }}>{ing}</li>
                ))}
              </ul>
            </>
          )}
          {recipe.steps && (
            <>
              <p className="mono-label" style={{ marginBottom: "0.5rem" }}>Steps</p>
              <ol style={{ listStyle: "decimal", paddingLeft: "1.2rem" }}>
                {recipe.steps.map((step, i) => (
                  <li key={i} className="body-text" style={{ fontSize: "0.95rem", marginBottom: "0.3rem" }}>{step}</li>
                ))}
              </ol>
            </>
          )}
          <div style={{ marginTop: "1.5rem", padding: "0.75rem 1rem", background: "var(--translucent-gold)", border: "1px solid var(--corn-gold)", borderRadius: "2px" }}>
            <span className="mono-label" style={{ color: "var(--burnt-amber)" }}>Nutrition Highlight: </span>
            <span className="body-text" style={{ fontSize: "0.9rem" }}>{recipe.nutritionHighlight}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecipeCard({ recipesData }) {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const [activeRecipe, setActiveRecipe] = useState(null);

  const recipes = recipesData?.length ? recipesData : STATIC_RECIPES;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current.querySelector(".recipes-title"), {
        opacity: 0,
        y: 60,
        duration: 1.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(cardsRef.current, {
        opacity: 0,
        y: 70,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        id="recipes"
        className="section"
        style={{ background: "var(--soft-white)", padding: "8rem 8vw" }}
      >
        <div className="recipes-title" style={{ textAlign: "center", marginBottom: "5rem" }}>
          <span className="eyebrow" style={{ display: "block", marginBottom: "1rem" }}>11 / Recipes</span>
          <h2 className="section-title" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
            From Field to Table
          </h2>
          <span className="gold-divider" style={{ margin: "1.5rem auto 0" }} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          {recipes.map((recipe, i) => (
            <div key={recipe._id} ref={(el) => (cardsRef.current[i] = el)} className="recipe-card">
              <div style={{ position: "relative", overflow: "hidden", height: "240px" }}>
                {videoBaseFor(recipe) ? (
                  <RecipeVideo
                    base={videoBaseFor(recipe)}
                    poster={`/media/images/${recipe.image}`}
                    title={recipe.title}
                    className="warm-filter"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s ease" }}
                  />
                ) : (
                  <img
                    src={`/media/images/${recipe.image}`}
                    alt={recipe.title}
                    className="warm-filter"
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                    onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                  />
                )}
                <div style={{ position: "absolute", top: "1rem", left: "1rem", display: "flex", gap: "0.4rem" }}>
                  {recipe.tags?.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="mono-label"
                      style={{
                        background: "rgba(26,18,8,0.7)",
                        backdropFilter: "blur(8px)",
                        color: "var(--corn-gold)",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "2px",
                        fontSize: "0.6rem",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <span className={`difficulty-badge ${recipe.difficulty?.toLowerCase()}`}>{recipe.difficulty}</span>
                  <span className="mono-label" style={{ color: "var(--muted-sage)", fontSize: "0.65rem" }}>⏱ {recipe.prepTime}</span>
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    color: "var(--deep-soil)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {recipe.title}
                </h3>
                <p className="body-text" style={{ fontSize: "0.85rem", color: "var(--muted-sage)", marginBottom: "1.25rem" }}>
                  {recipe.nutritionHighlight}
                </p>
                <button
                  id={`recipe-btn-${recipe._id}`}
                  onClick={() => setActiveRecipe(recipe)}
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--corn-gold)",
                    background: "transparent",
                    border: "1px solid var(--corn-gold)",
                    padding: "0.6rem 1.2rem",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "var(--corn-gold)";
                    e.target.style.color = "var(--deep-soil)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = "var(--corn-gold)";
                  }}
                >
                  View Recipe →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {activeRecipe && <RecipeModal recipe={activeRecipe} onClose={() => setActiveRecipe(null)} />}
    </>
  );
}
