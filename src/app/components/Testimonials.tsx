import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Sophie M.",
    location: "Paris, FR",
    rating: 5,
    text: "The linen wrap dress is absolutely stunning. The quality is exceptional and the fit is perfect. I've received so many compliments.",
    avatar: "SM",
    product: "Linen Wrap Dress",
  },
  {
    id: 2,
    name: "James T.",
    location: "London, UK",
    rating: 5,
    text: "Ordered the cashmere cardigan and it arrived beautifully packaged. Incredibly soft, true to size. Worth every penny.",
    avatar: "JT",
    product: "Cashmere Cardigan",
  },
  {
    id: 3,
    name: "Elena R.",
    location: "Milan, IT",
    rating: 5,
    text: "Finally a fashion store that balances elegance with practicality. The silk midi skirt is exactly what I've been looking for.",
    avatar: "ER",
    product: "Silk Midi Skirt",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 px-6 lg:px-12 bg-[#faf9f7]">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-14">
          <p
            className="text-[#c8a882] mb-3 tracking-[0.2em]"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 500 }}
          >
            CUSTOMER STORIES
          </p>
          <h2
            className="text-[#1a1714]"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 400 }}
          >
            What they're saying
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white p-8 border border-[rgba(26,23,20,0.06)]">
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} size={13} className="fill-[#c8a882] text-[#c8a882]" />
                ))}
              </div>
              <p
                className="text-[#1a1714] mb-6 leading-relaxed"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontStyle: "italic", fontWeight: 400 }}
              >
                "{r.text}"
              </p>
              <div className="flex items-center gap-3 pt-5 border-t border-[rgba(26,23,20,0.06)]">
                <div
                  className="w-9 h-9 rounded-full bg-[#e8e3dc] flex items-center justify-center flex-shrink-0"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600, color: "#7a7470" }}
                >
                  {r.avatar}
                </div>
                <div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 500, color: "#1a1714" }}>
                    {r.name}
                  </p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#7a7470" }}>
                    {r.location} · {r.product}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
