import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function VideoScene({ src, sources, poster, caption, textAlign = "left", id }) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const captionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    const video = videoRef.current;
    if (!el || !video) return;

    const ctx = gsap.context(() => {
      // Play/pause on scroll
      ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onEnter: () => video.play().catch(() => {}),
        onLeave: () => video.pause(),
        onEnterBack: () => video.play().catch(() => {}),
        onLeaveBack: () => video.pause(),
        invalidateOnRefresh: true,
      });

      // Caption reveal
      gsap.from(captionRef.current, {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 50%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      className="section grain-overlay"
      style={{ height: "100vh", overflow: "hidden", position: "relative" }}
    >
      <video
        ref={videoRef}
        muted
        playsInline
        loop
        preload="metadata"
        poster={poster}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      >
        {(sources && sources.length > 0 ? sources : [{ src }]).map((s, i) => (
          <source key={i} src={s.src} type="video/mp4" media={s.media || undefined} />
        ))}
      </video>

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(26,18,8,0.7) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)",
        }}
      />

      {/* Caption */}
      <div
        ref={captionRef}
        style={{
          position: "absolute",
          bottom: "3rem",
          [textAlign === "left" ? "left" : "right"]: "4rem",
          maxWidth: "500px",
          zIndex: 2,
        }}
      >
        <p
          style={{
            fontFamily: "'Lora', serif",
            fontStyle: "italic",
            fontSize: "clamp(1.2rem, 2.5vw, 2rem)",
            color: "var(--silk-cream)",
            textShadow: "0 2px 20px rgba(0,0,0,0.5)",
            lineHeight: 1.4,
          }}
        >
          {caption}
        </p>
      </div>
    </section>
  );
}
