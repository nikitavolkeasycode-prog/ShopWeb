import { useState } from "react";// Сетка товаров с фильтрами по категориям.
import { Heart, ShoppingBag, Star } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Linen Wrap Dress",
    category: "Women",
    price: 149,
    originalPrice: null,
    rating: 4.8,
    reviews: 124,
    badge: "NEW",
    img: "/images/prod1.jpg",
    colors: ["#e8e0d5", "#2d2926", "#8b6e5a"],
  },
  {
    id: 2,
    name: "Cotton Blazer",
    category: "Women",
    price: 210,
    originalPrice: null,
    rating: 4.6,
    reviews: 89,
    badge: null,
    img: "/images/prod2.jpg",
    colors: ["#c8a882", "#1a1714"],
  },
  {
    id: 3,
    name: "Relaxed Chino",
    category: "Men",
    price: 95,
    originalPrice: 130,
    rating: 4.7,
    reviews: 207,
    badge: "SALE",
    img: "/images/prod3.jpg",
    colors: ["#d4c5b0", "#7a7470", "#1a1714"],
  },
  {
    id: 4,
    name: "Silk Midi Skirt",
    category: "Women",
    price: 175,
    originalPrice: null,
    rating: 4.9,
    reviews: 56,
    badge: "NEW",
    img: "/images/prod4.jpg",
    colors: ["#f0ede8", "#1a1714"],
  },
  {
    id: 5,
    name: "Crewneck Tee",
    category: "Men",
    price: 58,
    originalPrice: null,
    rating: 4.5,
    reviews: 312,
    badge: null,
    img: "/images/prod5.jpg",
    colors: ["#ffffff", "#1a1714", "#c8a882"],
  },
  {
    id: 6,
    name: "Cashmere Cardigan",
    category: "Women",
    price: 285,
    originalPrice: 340,
    rating: 4.8,
    reviews: 73,
    badge: "SALE",
    img: "/images/prod6.jpg",
    colors: ["#d4c5b0", "#8b6e5a"],
  },
  {
    id: 7,
    name: "Pleated Trousers",
    category: "Men",
    price: 130,
    originalPrice: null,
    rating: 4.6,
    reviews: 95,
    badge: null,
    img: "/images/prod7.jpg",
    colors: ["#e8e3dc", "#7a7470", "#1a1714"],
  },
  {
    id: 8,
    name: "Floral Midi Dress",
    category: "Women",
    price: 165,
    originalPrice: null,
    rating: 4.7,
    reviews: 141,
    badge: "NEW",
    img: "/images/prod8.jpg",
    colors: ["#faf9f7", "#c8a882"],
  },
];

const filters = ["All", "Women", "Men", "New", "Sale"];

interface ProductGridProps {
  onAddToCart: (name: string) => void;
}

export function ProductGrid({ onAddToCart }: ProductGridProps) {
  const [active, setActive] = useState("All");
  const [wishlist, setWishlist] = useState<number[]>([]);

  const filtered = active === "All"
    ? products
    : active === "New"
    ? products.filter((p) => p.badge === "NEW")
    : active === "Sale"
    ? products.filter((p) => p.badge === "SALE")
    : products.filter((p) => p.category === active);

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <section id="new-arrivals" className="py-20 px-6 lg:px-12 bg-[#f5f2ed]">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p
              className="text-[#c8a882] mb-2 tracking-[0.2em]"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 500 }}
            >
              HANDPICKED
            </p>
            <h2
              className="text-[#1a1714]"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 400 }}
            >
              New Arrivals
            </h2>
          </div>
          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`px-4 py-2 transition-colors ${active === f ? "bg-[#1a1714] text-[#faf9f7]" : "bg-white text-[#1a1714] hover:bg-[#1a1714] hover:text-[#faf9f7]"}`}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", letterSpacing: "0.08em", fontWeight: 500 }}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {filtered.map((product) => (
            <div key={product.id} className="group bg-white">
              {/* Image */}
              <div className="relative overflow-hidden bg-[#e8e3dc]" style={{ aspectRatio: "3/4" }}>
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                {/* Badge */}
                {product.badge && (
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 ${product.badge === "SALE" ? "bg-[#c0392b] text-white" : "bg-[#1a1714] text-white"}`}
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", letterSpacing: "0.1em", fontWeight: 600 }}
                  >
                    {product.badge}
                  </span>
                )}
                {/* Wishlist button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#1a1714] hover:text-white"
                >
                  <Heart
                    size={14}
                    strokeWidth={1.5}
                    className={wishlist.includes(product.id) ? "fill-current text-[#c0392b]" : ""}
                  />
                </button>
                {/* Quick add */}
                <button
                  onClick={() => onAddToCart(product.name)}
                  className="absolute bottom-0 left-0 right-0 bg-[#1a1714] text-white py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", letterSpacing: "0.1em" }}
                >
                  <ShoppingBag size={13} strokeWidth={1.5} />
                  QUICK ADD
                </button>
              </div>

              {/* Info */}
              <div className="p-4">
                <p
                  className="text-[#7a7470] mb-1"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", letterSpacing: "0.08em" }}
                >
                  {product.category.toUpperCase()}
                </p>
                <h3
                  className="text-[#1a1714] mb-2"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: "15px", fontWeight: 400 }}
                >
                  {product.name}
                </h3>
                {/* Colors */}
                <div className="flex gap-1.5 mb-3">
                  {product.colors.map((c) => (
                    <span
                      key={c}
                      className="w-3.5 h-3.5 rounded-full border border-[rgba(26,23,20,0.15)] cursor-pointer hover:scale-110 transition-transform"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                {/* Price + rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-[#1a1714]"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", fontWeight: 500 }}
                    >
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span
                        className="text-[#7a7470] line-through"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}
                      >
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={11} className="fill-[#c8a882] text-[#c8a882]" />
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#7a7470" }}>
                      {product.rating}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            className="inline-flex items-center gap-3 border border-[#1a1714] text-[#1a1714] px-10 py-4 hover:bg-[#1a1714] hover:text-[#faf9f7] transition-colors"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", letterSpacing: "0.1em", fontWeight: 500 }}
          >
            LOAD MORE
          </button>
        </div>
      </div>
    </section>
  );
}
