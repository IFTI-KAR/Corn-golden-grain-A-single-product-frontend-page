import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const STATIC_VARIETIES = [
  { _id: "1", name: "Yellow Sweet Corn", color: "#F5C842", origin: "United States", flavorProfile: "Sweet, juicy, tender — the classic summer corn", image: "corn-varieties.jpg", video: "variety-yellow" },
  { _id: "2", name: "Blue Corn", color: "#4A5A8A", origin: "Southwestern USA & Mexico", flavorProfile: "Earthy, slightly nutty with a dense texture", image: "corn-closeup-01.jpg", video: "variety-blue" },
  { _id: "3", name: "White Corn", color: "#E8E0D0", origin: "Mexico & Central America", flavorProfile: "Mild, starchy with a subtle sweetness", image: "corn-closeup-02.jpg", video: "variety-white" },
  { _id: "4", name: "Purple Corn", color: "#5B2D8E", origin: "Peru & Andes", flavorProfile: "Bold, berry-like with deep antioxidant notes", image: "corn-harvest.jpg", video: "variety-purple" },
];

// Pexels sources: 9429439 golden close-up / 36314050 heirloom (blue segment) / 8108985 white choclo market / 36314050 heirloom (purple segment)
function videoBaseFor(variety) {
  if (variety?.video) return variety.video;
  const byId = { "1": "variety-yellow", "2": "variety-blue", "3": "variety-white", "4": "variety-purple" };
  if (byId[variety?._id]) return byId[variety._id];
  const n = (variety?.name || "").toLowerCase();
  if (n.includes("yellow")) return "variety-yellow";
  if (n.includes("blue")) return "variety-blue";
  if (n.includes("white")) return "variety-white";
  if (n.includes("purple")) return "variety-purple";
  return null;
}

function VarietyVideo({ variety }) {
  const base = videoBaseFor(variety);
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const play = () => v.play().catch(() => {});
    const pause = () => v.pause();
    let observer;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(([e]) => (e.isIntersecting ? play() : pause()), { threshold: 0.2 });
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
      poster={`/media/images/${variety.image}`}
      aria-label={`${variety.name} — video`}
      style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
    >
      <source src={`/media/videos/${base}-720.mp4`} type="video/mp4" media="(max-width: 767px)" />
      <source src={`/media/videos/${base}-1080.mp4`} type="video/mp4" />
    </video>
  );
}

export default function Varieties({ varietiesData }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  const items = varietiesData?.length ? varietiesData : STATIC_VARIETIES;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      const totalWidth = track.scrollWidth - track.parentElement.offsetWidth;

      gsap.to(track, {
        x: () => -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${totalWidth + window.innerHeight}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Title
      gsap.from(sectionRef.current.querySelector(".varieties-title"), {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="varieties"
      style={{
        background: "var(--deep-soil)",
        overflow: "hidden",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Header */}
      <div
        className="varieties-title"
        style={{
          padding: "0 8vw",
          marginBottom: "2rem",
          display: "flex",
          alignItems: "baseline",
          gap: "2rem",
          flexShrink: 0,
        }}
      >
        <span className="eyebrow">06 / Varieties</span>
        <h2
          className="section-title"
          style={{
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            color: "var(--silk-cream)",
          }}
        >
          Four Faces of Corn
        </h2>
      </div>

      {/* Horizontal scroll track */}
      <div style={{ overflow: "hidden", flexShrink: 0 }}>
        <div
          ref={trackRef}
          style={{
            display: "flex",
            gap: "1.5rem",
            paddingLeft: "8vw",
            paddingRight: "8vw",
            willChange: "transform",
          }}
        >
          {items.map((variety) => (
            <div key={variety._id} className="variety-card" style={{ borderTop: `3px solid ${variety.color}` }}>
              {videoBaseFor(variety) ? (
                <VarietyVideo variety={variety} />
              ) : (
                <img
                  src={`/media/images/${variety.image}`}
                  alt={variety.name}
                />
              )}
              <div className="variety-card-overlay">
                <span className="mono-label" style={{ color: variety.color, marginBottom: "0.75rem" }}>
                  {variety.origin}
                </span>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "var(--silk-cream)",
                    marginBottom: "0.75rem",
                    lineHeight: 1.1,
                  }}
                >
                  {variety.name}
                </h3>
                <p className="body-text" style={{ color: "rgba(250,243,224,0.7)", fontSize: "0.95rem" }}>
                  {variety.flavorProfile}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          padding: "1.5rem 8vw 0",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          flexShrink: 0,
        }}
      >
        <span className="mono-label" style={{ color: "var(--muted-sage)" }}>
          Scroll to explore →
        </span>
      </div>
    </section>
  );
}
