import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ResponsiveImage from "./ResponsiveImage";

gsap.registerPlugin(ScrollTrigger);

/**
 * CinematicScene — watermark-free 4K "video-like" scene:
 * a high-resolution photograph with slow, cinematic motion (Ken Burns
 * zoom + scroll parallax). True 4K on large screens, tiny on phones.
 *
 * When licensed 4K footage is available, swap this component for
 * <VideoScene> (see README → "Adding licensed 4K video").
 */
export default function CinematicScene({
  id,
  stem,
  masterWidth = 5000,
  widths,
  caption,
  textAlign = "left",
  alt,
  objectPosition = "center 40%",
}) {
  const sectionRef = useRef(null);
  const imgWrapRef = useRef(null);
  const captionRef = useRef(null);
  const isMobile = (w) => w < 768;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // static image, no drift — accessible default

    const ctx = gsap.context(() => {
      // Parallax drift while scrolling; slightly stronger on desktop
      const range = isMobile(window.innerWidth) ? 5 : 8;
      gsap.fromTo(
        imgWrapRef.current,
        { yPercent: range, scale: 1.07 },
        {
          yPercent: -range,
          scale: 1.16,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
      // Caption reveal
      gsap.from(captionRef.current, {
        opacity: 0,
        y: 40,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 55%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id={id} className="section grain-overlay cinematic-scene">
      <div className="cinematic-media" ref={imgWrapRef}>
        <ResponsiveImage
          stem={stem}
          masterWidth={masterWidth}
          widths={widths}
          alt={alt ?? caption}
          sizes="100vw"
          className="cinematic-img warm-filter"
          objectPosition={objectPosition}
        />
      </div>
      <div className="cinematic-shade" />
      <div
        ref={captionRef}
        className={`scene-caption scene-caption-${textAlign}`}
      >
        <p className="scene-caption-text">{caption}</p>
      </div>
    </section>
  );
}
