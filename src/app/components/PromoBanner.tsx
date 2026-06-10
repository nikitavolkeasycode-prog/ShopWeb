import { ArrowRight } from "lucide-react";

export function PromoBanner() {
  return (
    <section className="grid lg:grid-cols-2 min-h-[500px] bg-[#1a1714]">
      {/* Image */}
      <div className="relative overflow-hidden bg-[#2d2926] min-h-[300px] lg:min-h-0">
        <img
          src="/images/slide2.jpg"
          alt="Woman in black blazer — editorial fashion"
          className="w-full h-full object-cover object-center opacity-80"
        />
      </div>
      {/* Text */}
      <div className="flex flex-col justify-center px-10 lg:px-16 xl:px-20 py-16 lg:py-0">
        <p
          className="mb-4 text-[#c8a882] tracking-[0.2em]"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 500 }}
        >
          LIMITED TIME OFFER
        </p>
        <h2
          className="text-white mb-6 leading-[1.1]"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px, 4vw, 60px)", fontWeight: 400 }}
        >
          Up to 40% off
          <br />
          <em>Summer Sale</em>
        </h2>
        <p
          className="mb-8 max-w-[340px] leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 300, color: "rgba(250,249,247,0.65)" }}
        >
          Discover season-end savings on curated pieces. Timeless style, reduced prices — only while stocks last.
        </p>

        {/* Countdown */}
        <div className="flex gap-6 mb-10">
          {[["02", "DAYS"], ["14", "HOURS"], ["38", "MINS"], ["52", "SECS"]].map(([num, label]) => (
            <div key={label} className="text-center">
              <div
                className="text-white"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: 500 }}
              >
                {num}
              </div>
              <div
                className="text-[rgba(250,249,247,0.5)] mt-1"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", letterSpacing: "0.12em" }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        <a
          href="#"
          className="inline-flex items-center gap-3 bg-[#c8a882] text-[#1a1714] px-8 py-4 hover:bg-[#b8956e] transition-colors self-start"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", letterSpacing: "0.1em", fontWeight: 600 }}
        >
          SHOP THE SALE
          <ArrowRight size={14} />
        </a>
      </div>
    </section>
  );
}
