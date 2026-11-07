import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const eyebrowRef = useRef(null);
  const subtitleRef = useRef(null);
  const overlayRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial entrance animation
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 20, letterSpacing: "0.6em" },
        { opacity: 1, y: 0, letterSpacing: "0.3em", duration: 1.2, delay: 0.5 }
      )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 80, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: "power4.out" },
          "-=0.6"
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1 },
          "-=0.7"
        );

      // Parallax on scroll
      gsap.to(heroRef.current.querySelector(".hero-video-wrap"), {
        yPercent: 25,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // Fade out on scroll
      gsap.to(overlayRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "40% top",
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} id="hero" className="section grain-overlay" style={{ height: "100vh", overflow: "hidden" }}>
      {/* Background Video */}
      <div
        className="hero-video-wrap"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "115%",
          top: "-7.5%",
          zIndex: 0,
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/videos/hero-poster.jpg"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        >
          <source src="/media/videos/hero-720.mp4" type="video/mp4" media="(max-width: 767px)" />
          <source src="/media/videos/hero-1080.mp4" type="video/mp4" media="(max-width: 1919px)" />
          <source src="/media/videos/hero-4k.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Dark gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(26,18,8,0.75))",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div ref={overlayRef} style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 2rem" }}>
        <p ref={eyebrowRef} className="eyebrow" style={{ marginBottom: "1.5rem", opacity: 0 }}>
          The Golden Grain
        </p>
        <h1
          ref={titleRef}
          className="display-title"
          style={{
            fontSize: "clamp(5rem, 18vw, 16rem)",
            color: "var(--silk-cream)",
            opacity: 0,
          }}
        >
          CORN
        </h1>
        <p ref={subtitleRef} className="body-text" style={{ fontStyle: "italic", marginTop: "1.5rem", color: "var(--muted-sage)", opacity: 0 }}>
          From Soil to Sustenance
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator">
        <span>Scroll</span>
        <div className="scroll-arrow" />
      </div>
    </section>
  );
}
