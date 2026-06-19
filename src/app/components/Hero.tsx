import { ArrowRight } from "lucide-react";// Главный экран (hero section): крупный баннер без сложной логики.

export function Hero() {
  return (
    <section className="grid lg:grid-cols-2 min-h-[85vh] bg-[#faf9f7]">
      {/* Left text panel */}
      <div className="flex flex-col justify-center px-8 lg:px-16 xl:px-24 py-16 lg:py-0 order-2 lg:order-1">
        <p
          className="mb-4 text-[#c8a882] tracking-[0.2em]"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 500 }}
        >
          NEW COLLECTION — SS 2026
        </p>
        <h1
          className="mb-6 text-[#1a1714] leading-[1.1]"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(42px, 5.5vw, 80px)", fontWeight: 400 }}
        >
          Dress for
          <br />
          <em>every</em> moment
        </h1>
        <p
          className="mb-10 max-w-[380px] text-[#7a7470] leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", fontWeight: 300 }}
        >
          Curated pieces that blend timeless elegance with contemporary ease. From morning coffee to evening soirée — dress with intention.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="#new-arrivals"
            className="inline-flex items-center gap-3 bg-[#1a1714] text-[#faf9f7] px-8 py-4 hover:bg-[#2d2926] transition-colors"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", letterSpacing: "0.1em", fontWeight: 500 }}
          >
            SHOP NOW
            <ArrowRight size={14} />
          </a>
          <a
            href="#categories"
            className="inline-flex items-center gap-3 border border-[#1a1714] text-[#1a1714] px-8 py-4 hover:bg-[#1a1714] hover:text-[#faf9f7] transition-colors"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", letterSpacing: "0.1em", fontWeight: 500 }}
          >
            EXPLORE
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 flex gap-10 pt-10 border-t border-[rgba(26,23,20,0.08)]">
          {[["2,400+", "Products"], ["50+", "Brands"], ["98%", "Happy Clients"]].map(([num, label]) => (
            <div key={label}>
              <div
                className="text-[#1a1714]"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 500 }}
              >
                {num}
              </div>
              <div
                className="text-[#7a7470]"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", letterSpacing: "0.08em", marginTop: "2px" }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right image panel */}
      <div className="relative order-1 lg:order-2 min-h-[60vw] lg:min-h-0 overflow-hidden bg-[#e8e3dc]">
        <img
          src="/images/slide1.jpg"
          alt="Woman in elegant red dress — new collection"
          className="w-full h-full object-cover object-top"
        />
        {/* Floating badge */}
        <div className="absolute bottom-8 left-8 bg-[#faf9f7] px-5 py-4 shadow-sm">
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7470", marginBottom: "4px" }}>
            FEATURED PIECE
          </p>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", color: "#1a1714" }}>
            Scarlet Evening Gown
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#c8a882", marginTop: "2px" }}>
            $285
          </p>
        </div>
      </div>
    </section>
  );
}
