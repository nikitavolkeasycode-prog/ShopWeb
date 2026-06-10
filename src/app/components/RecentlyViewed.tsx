import { ShoppingBag, Star } from "lucide-react";
import type { Product } from "./ProductModal";

interface RecentlyViewedProps {
  products: Product[];
  onView: (p: Product) => void;
  onAddToCart: (name: string) => void;
}

export function RecentlyViewed({ products, onView, onAddToCart }: RecentlyViewedProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-16 px-6 lg:px-12 bg-card">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[#c8a882] mb-2 tracking-[0.2em]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 500 }}>YOUR HISTORY</p>
            <h2 className="text-foreground" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px,2.5vw,34px)", fontWeight: 400 }}>
              Recently Viewed
            </h2>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
          {products.map((p) => (
            <div
              key={p.id}
              className="flex-shrink-0 w-44 sm:w-52 cursor-pointer group"
              onClick={() => onView(p)}
            >
              <div className="relative overflow-hidden bg-secondary mb-3" style={{ aspectRatio: "3/4" }}>
                <img src={p.img} alt={p.name} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                <button
                  onClick={(e) => { e.stopPropagation(); onAddToCart(p.name); }}
                  className="absolute bottom-0 left-0 right-0 bg-foreground text-background py-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-1.5"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", letterSpacing: "0.1em" }}
                >
                  <ShoppingBag size={11} /> ADD
                </button>
              </div>
              <p className="text-foreground" style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px", fontWeight: 400 }}>{p.name}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 500 }}>${p.price}</span>
                <div className="flex items-center gap-0.5">
                  <Star size={10} className="fill-[#c8a882] text-[#c8a882]" />
                  <span className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px" }}>{p.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
