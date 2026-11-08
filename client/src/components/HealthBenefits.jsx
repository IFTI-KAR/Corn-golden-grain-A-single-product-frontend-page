import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const BENEFITS = [
  {
    icon: "👁️",
    video: "benefit-01-eye",
    title: "Eye Health",
    subtitle: "Lutein & Zeaxanthin",
    body: "Corn is one of the richest dietary sources of lutein and zeaxanthin — carotenoids that protect the macula and reduce the risk of age-related macular degeneration.",
  },
  {
    icon: "🌿",
    video: "benefit-02-digest",
    title: "Digestive Health",
    subtitle: "Dietary Fiber",
    body: "With 2.4g of fiber per 100g, corn supports healthy gut bacteria, regular bowel movement, and reduces the risk of colorectal issues.",
  },
  {
    icon: "⚡",
    video: "benefit-03-energy",
    title: "Energy Source",
    subtitle: "Complex Carbohydrates",
    body: "Corn's complex carbohydrates provide a slow, sustained release of energy — making it an ideal fuel for both body and brain.",
  },
  {
    icon: "❤️",
    video: "benefit-04-heart",
    title: "Heart Health",
    subtitle: "Folate & Potassium",
    body: "Folate helps lower homocysteine levels while potassium regulates blood pressure — together they form a powerful cardiovascular shield.",
  },
  {
    icon: "🛡️",
    video: "benefit-05-immune",
    title: "Immune Boost",
    subtitle: "Vitamin C & Antioxidants",
    body: "Corn's antioxidant compounds — including beta-carotene, quercetin, and Vitamin C — combat free radicals and bolster the immune system.",
  },
];

function BenefitVideo({ base, title }) {
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
      aria-label={`${title} — video`}
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
    >
      <source src={`/media/videos/${base}-720.mp4`} type="video/mp4" media="(max-width: 767px)" />
      <source src={`/media/videos/${base}-1080.mp4`} type="video/mp4" />
    </video>
  );
}

export default function HealthBenefits() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Draw timeline line
      gsap.from(lineRef.current, {
        scaleY: 0,
        transformOrigin: "top",
        duration: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 60%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Stagger items
      itemRefs.current.forEach((item, i) => {
        gsap.from(item, {
          opacity: 0,
          x: 50,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 82%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        });
      });

      // Title
      gsap.from(sectionRef.current.querySelector(".benefits-title"), {
        opacity: 0,
        y: 60,
        duration: 1.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="benefits"
      className="section"
      style={{ background: "var(--silk-cream)", padding: "8rem 8vw" }}
    >
      <div className="benefits-title" style={{ marginBottom: "5rem" }}>
        <span className="eyebrow" style={{ display: "block", marginBottom: "1rem" }}>08 / Benefits</span>
        <h2
          className="section-title"
          style={{ fontSize: "clamp(2.5rem, 4vw, 4rem)", maxWidth: "600px" }}
        >
          Why Corn is<br />Good for You
        </h2>
        <span className="gold-divider" style={{ marginTop: "1.5rem" }} />
      </div>

      <div style={{ position: "relative", maxWidth: "720px" }}>
        {/* Timeline line */}
        <div
          ref={lineRef}
          className="timeline-line"
          style={{ height: `${BENEFITS.length * 195}px` }}
        />

        {/* Benefits */}
        {BENEFITS.map((benefit, i) => (
          <div
            key={i}
            ref={(el) => (itemRefs.current[i] = el)}
            className="benefit-item"
          >
            <div style={{ flexShrink: 0, width: "180px", maxWidth: "40vw", aspectRatio: "16 / 10", overflow: "hidden", borderRadius: "4px", background: "#000", border: "2px solid var(--corn-gold)", zIndex: 1, position: "relative" }}>
              <BenefitVideo base={benefit.video} title={benefit.title} />
            </div>
            <div style={{ paddingTop: "0.5rem" }}>
              <span className="mono-label" style={{ color: "var(--burnt-amber)", display: "block", marginBottom: "0.4rem" }}>
                {benefit.subtitle}
              </span>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "var(--deep-soil)",
                  marginBottom: "0.75rem",
                }}
              >
                {benefit.title}
              </h3>
              <p className="body-text" style={{ color: "var(--muted-sage)", maxWidth: "520px" }}>
                {benefit.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
