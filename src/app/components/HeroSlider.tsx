// Главный баннер (hero slider) на главной странице.
// Автоматически меняет слайды с товарами/акциями, содержит текст и кнопку CTA.
import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
const slides = [
  {
    id: 1,
    badge: "NEW COLLECTION — SS 2026",
    headline: ["Dress for", "every moment"],
    sub: "Curated pieces that blend timeless elegance with contemporary ease.",
    cta: "SHOP NOW",
    ctaHref: "#new-arrivals",
    img: "/images/slide1.jpg",
    imgAlt: "Woman in elegant red dress",
    accent: "#c8a882",
    bgLeft: "#faf9f7",
    bgRight: "#e8e3dc",
  },
  {
    id: 2,
    badge: "LIMITED TIME — UP TO 40% OFF",
    headline: ["Summer Sale", "is here"],
    sub: "Season-end savings on our most-loved pieces. While stocks last.",
    cta: "SHOP SALE",
    ctaHref: "#new-arrivals",
    img: "/images/slide2.jpg",
    imgAlt: "Woman in black blazer — summer editorial",
    accent: "#c0392b",
    bgLeft: "#1a1714",
    bgRight: "#2d2926",
    dark: true,
  },
  {
    id: 3,
    badge: "EXCLUSIVELY OURS",
    headline: ["The men's", "edit 2026"],
    sub: "Refined essentials for the modern wardrobe. New season, new standards.",
    cta: "EXPLORE MEN",
    ctaHref: "#new-arrivals",
    img: "/images/slide3.jpg",
    imgAlt: "Man in tailored outfit",
    accent: "#c8a882",
    bgLeft: "#f0ede8",
    bgRight: "#ddd6cc",
  },
  {
    id: 4,
    badge: "SUSTAINABLE STYLE",
    headline: ["Fashion that", "gives back"],
    sub: "Every piece in our eco line is crafted from ethically sourced materials.",
    cta: "DISCOVER ECO",
    ctaHref: "#categories",
    img: "/images/slide4.jpg",
    imgAlt: "Woman in white minimal outfit",
    accent: "#6b8f71",
    bgLeft: "#f5f5f0",
    bgRight: "#e0e5dc",
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const go = useCallback((idx: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 300);
  }, [animating]);

  const prev = () => go((current - 1 + slides.length) % slides.length);
  const next = useCallback(() => go((current + 1) % slides.length), [current, go]);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  const slide = slides[current];
  const textColor = slide.dark ? "#faf9f7" : "#1a1714";
  const mutedColor = slide.dark ? "rgba(250,249,247,0.6)" : "#7a7470";

  return (
    <section className="relative grid lg:grid-cols-2 min-h-[85vh] overflow-hidden" style={{ backgroundColor: slide.bgLeft, transition: "background-color 0.4s" }}>
      {/* Left text */}
      <div
        className="flex flex-col justify-center px-8 lg:px-16 xl:px-24 py-16 lg:py-0 order-2 lg:order-1"
        style={{ opacity: animating ? 0 : 1, transition: "opacity 0.3s", backgroundColor: slide.bgLeft }}
      >
        <p
          className="mb-4 tracking-[0.2em]"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 500, color: slide.accent }}
        >
          {slide.badge}
        </p>
        <h1
          className="mb-6 leading-[1.1]"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(40px, 5.5vw, 76px)", fontWeight: 400, color: textColor }}
        >
          {slide.headline[0]}
          <br />
          <em>{slide.headline[1]}</em>
        </h1>
        <p
          className="mb-10 max-w-[380px] leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", fontWeight: 300, color: mutedColor }}
        >
          {slide.sub}
        </p>
        <div className="flex flex-wrap gap-4 items-center">
          <a
            href={slide.ctaHref}
            className="inline-flex items-center gap-3 px-8 py-4 hover:opacity-80 transition-opacity"
            style={{ backgroundColor: textColor, color: slide.bgLeft, fontFamily: "'Inter', sans-serif", fontSize: "12px", letterSpacing: "0.1em", fontWeight: 600 }}
          >
            {slide.cta}
            <ArrowRight size={13} />
          </a>
        </div>

        {/* Slide indicators */}
        <div className="mt-14 flex items-center gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="transition-all duration-300"
              style={{
                height: "2px",
                width: i === current ? "32px" : "16px",
                backgroundColor: i === current ? slide.accent : (slide.dark ? "rgba(250,249,247,0.3)" : "rgba(26,23,20,0.2)"),
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Right image */}
      <div
        className="relative order-1 lg:order-2 min-h-[55vw] lg:min-h-0 overflow-hidden"
        style={{ backgroundColor: slide.bgRight }}
      >
        <img
          key={slide.id}
          src={slide.img}
          alt={slide.imgAlt}
          className="w-full h-full object-cover object-top"
          style={{ opacity: animating ? 0 : 1, transition: "opacity 0.4s" }}
        />
        {/* Counter */}
        <div
          className="absolute bottom-6 right-6 flex items-center gap-2"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.85)" }}
        >
          <span style={{ fontWeight: 600 }}>{String(current + 1).padStart(2, "0")}</span>
          <span className="opacity-40">/</span>
          <span className="opacity-60">{String(slides.length).padStart(2, "0")}</span>
        </div>
      </div>

      {/* Arrow controls */}
      <button
        onClick={prev}
        className="absolute bottom-6 left-6 lg:left-auto lg:bottom-10 lg:right-24 w-10 h-10 flex items-center justify-center border transition-colors z-10"
        style={{ borderColor: slide.dark ? "rgba(250,249,247,0.25)" : "rgba(26,23,20,0.2)", color: textColor }}
        aria-label="Previous slide"
      >
        <ArrowLeft size={16} strokeWidth={1.5} />
      </button>
      <button
        onClick={next}
        className="absolute bottom-6 left-20 lg:left-auto lg:bottom-10 lg:right-10 w-10 h-10 flex items-center justify-center border transition-colors z-10"
        style={{ borderColor: slide.dark ? "rgba(250,249,247,0.25)" : "rgba(26,23,20,0.2)", color: textColor }}
        aria-label="Next slide"
      >
        <ArrowRight size={16} strokeWidth={1.5} />
      </button>
    </section>
  );
}
