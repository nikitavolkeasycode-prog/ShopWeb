import { TrendingUp, ShoppingBag, Star } from "lucide-react";// Секция популярных товаров: горизонтальный скролл карточек.
import type { Product } from "./ProductModal";

const popularBrands = [
  { name: "Voilà Basics", items: 240, color: "#e8e3dc" },
  { name: "Maison Étoile", items: 185, color: "#d4c5b0" },
  { name: "Nordic Draft", items: 132, color: "#dde5dd" },
  { name: "Alba Studio", items: 97, color: "#e5dde5" },
  { name: "Côte Azure", items: 76, color: "#dde0e5" },
];

const popularCategories = [
  { name: "Dresses", icon: "👗", count: 480 },
  { name: "Outerwear", icon: "🧥", count: 210 },
  { name: "Trousers", icon: "👖", count: 175 },
  { name: "Knitwear", icon: "🧶", count: 140 },
];

interface PopularSectionProps {
  products: Product[];
  onView: (p: Product) => void;
  onAddToCart: (name: string) => void;
}

export function PopularSection({ products, onView, onAddToCart }: PopularSectionProps) {
  const topProducts = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 4);

  return (
    <section className="py-20 px-6 lg:px-12 bg-background">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <TrendingUp size={18} className="text-[#c8a882]" />
          <div>
            <p className="text-[#c8a882] tracking-[0.2em]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 500 }}>TRENDING NOW</p>
            <h2 className="text-foreground" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px,3vw,38px)", fontWeight: 400 }}>
              Popular Right Now
            </h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Popular products */}
          <div className="lg:col-span-2">
            <h3 className="text-muted-foreground mb-5 tracking-[0.1em]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600 }}>
              TOP PRODUCTS
            </h3>
            <div className="flex flex-col gap-4">
              {topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center gap-4 group cursor-pointer" onClick={() => onView(p)}>
                  <span className="text-muted-foreground flex-shrink-0 w-5 text-center" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 300 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="w-14 h-16 bg-secondary overflow-hidden flex-shrink-0">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground truncate" style={{ fontFamily: "'Playfair Display', serif", fontSize: "15px" }}>{p.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[1,2,3,4,5].map((s) => <Star key={s} size={10} className={s <= Math.round(p.rating) ? "fill-[#c8a882] text-[#c8a882]" : "text-muted"} />)}
                      <span className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>({p.reviews})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 500 }}>${p.price}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); onAddToCart(p.name); }}
                      className="w-8 h-8 border border-border flex items-center justify-center hover:bg-foreground hover:text-background hover:border-foreground transition-colors text-foreground"
                    >
                      <ShoppingBag size={13} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-8">
            {/* Popular brands */}
            <div>
              <h3 className="text-muted-foreground mb-5 tracking-[0.1em]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600 }}>
                TOP BRANDS
              </h3>
              <div className="flex flex-col gap-3">
                {popularBrands.map((b, i) => (
                  <div key={b.name} className="flex items-center gap-3 cursor-pointer group">
                    <span className="text-muted-foreground w-4 text-right flex-shrink-0" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>{i + 1}</span>
                    <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: b.color }} />
                    <div className="flex-1">
                      <p className="text-foreground group-hover:text-[#c8a882] transition-colors" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>{b.name}</p>
                      <p className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>{b.items} items</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular categories */}
            <div>
              <h3 className="text-muted-foreground mb-5 tracking-[0.1em]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600 }}>
                TOP CATEGORIES
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {popularCategories.map((c) => (
                  <div key={c.name} className="border border-border p-4 cursor-pointer hover:border-foreground hover:bg-secondary transition-all group">
                    <span className="text-2xl block mb-2">{c.icon}</span>
                    <p className="text-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 500 }}>{c.name}</p>
                    <p className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>{c.count} items</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
