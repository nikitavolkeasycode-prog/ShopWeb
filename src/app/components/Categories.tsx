const categories = [// Секция категорий: плитка с крупными ссылками на коллекции (женщинам, мужчинам и т.д.).
  {
    label: "Women",
    sub: "1,240 items",
    img: "/images/cat-women.jpg",
    alt: "Women's fashion collection",
  },
  {
    label: "Men",
    sub: "860 items",
    img: "/images/cat-men.jpg",
    alt: "Men's fashion collection",
  },
  {
    label: "Accessories",
    sub: "320 items",
    img: "/images/cat-accessories.jpg",
    alt: "Fashion accessories",
  },
];

export function Categories() {
  return (
    <section id="categories" className="py-20 px-6 lg:px-12 bg-[#faf9f7]">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p
              className="text-[#c8a882] mb-2 tracking-[0.2em]"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 500 }}
            >
              BROWSE BY
            </p>
            <h2
              className="text-[#1a1714]"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 400 }}
            >
              Shop by Category
            </h2>
          </div>
          <a
            href="#"
            className="hidden sm:inline text-[#1a1714] hover:text-[#c8a882] transition-colors"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", letterSpacing: "0.08em", borderBottom: "1px solid currentColor", paddingBottom: "2px" }}
          >
            VIEW ALL
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          {categories.map((cat) => (
            <a key={cat.label} href="#" className="group block relative overflow-hidden bg-[#e8e3dc]" style={{ aspectRatio: "3/4" }}>
              <img
                src={cat.img}
                alt={cat.alt}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,23,20,0.7)] via-transparent to-transparent" />
              {/* Text */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3
                  className="text-white mb-1"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 400 }}
                >
                  {cat.label}
                </h3>
                <p
                  className="text-[rgba(255,255,255,0.7)]"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", letterSpacing: "0.05em" }}
                >
                  {cat.sub}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
