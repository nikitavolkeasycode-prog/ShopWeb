import { useState } from "react";
import { Heart, ShoppingBag, Star, LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { ProductModal } from "./ProductModal";
import { FilterSidebar, FilterState } from "./FilterSidebar";
import type { Product } from "./ProductModal";

const allProducts: Product[] = [
  {
    id: 1, name: "Linen Wrap Dress", category: "Women", price: 149, originalPrice: null, rating: 4.8, reviews: 124, badge: "NEW",
    img: "/images/prod1.jpg",
    images: [
      "/images/prod1.jpg",
      "/images/prod4.jpg",
      "/images/prod8.jpg",
    ],
    colors: ["#e8e0d5", "#2d2926", "#8b6e5a"], sizes: ["XS", "S", "M", "L", "XL"],
    description: "Effortless linen wrap dress that drapes beautifully. Adjustable tie waist creates a flattering silhouette for any body type. Perfect from brunch to evening.",
  },
  {
    id: 2, name: "Cotton Blazer", category: "Women", price: 210, originalPrice: null, rating: 4.6, reviews: 89, badge: null,
    img: "/images/prod2.jpg",
    images: [
      "/images/prod2.jpg",
      "/images/prod2b.jpg",
    ],
    colors: ["#c8a882", "#1a1714"], sizes: ["XS", "S", "M", "L"],
  },
  {
    id: 3, name: "Relaxed Chino", category: "Men", price: 95, originalPrice: 130, rating: 4.7, reviews: 207, badge: "SALE",
    img: "/images/prod3.jpg",
    images: ["/images/prod3.jpg"],
    colors: ["#d4c5b0", "#7a7470", "#1a1714"], sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: 4, name: "Silk Midi Skirt", category: "Women", price: 175, originalPrice: null, rating: 4.9, reviews: 56, badge: "NEW",
    img: "/images/prod4.jpg",
    images: ["/images/prod4.jpg"],
    colors: ["#f0ede8", "#1a1714"], sizes: ["XS", "S", "M", "L"],
  },
  {
    id: 5, name: "Crewneck Tee", category: "Men", price: 58, originalPrice: null, rating: 4.5, reviews: 312, badge: null,
    img: "/images/prod5.jpg",
    images: ["/images/prod5.jpg"],
    colors: ["#ffffff", "#1a1714", "#c8a882"], sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: 6, name: "Cashmere Cardigan", category: "Women", price: 285, originalPrice: 340, rating: 4.8, reviews: 73, badge: "SALE",
    img: "/images/prod6.jpg",
    images: ["/images/prod6.jpg"],
    colors: ["#d4c5b0", "#8b6e5a"], sizes: ["XS", "S", "M", "L"],
  },
  {
    id: 7, name: "Pleated Trousers", category: "Men", price: 130, originalPrice: null, rating: 4.6, reviews: 95, badge: null,
    img: "/images/prod7.jpg",
    images: ["/images/prod7.jpg"],
    colors: ["#e8e3dc", "#7a7470", "#1a1714"], sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 8, name: "Floral Midi Dress", category: "Women", price: 165, originalPrice: null, rating: 4.7, reviews: 141, badge: "NEW",
    img: "/images/prod8.jpg",
    images: ["/images/prod8.jpg"],
    colors: ["#faf9f7", "#c8a882"], sizes: ["XS", "S", "M", "L", "XL"],
  },
];

const defaultFilters: FilterState = {
  categories: [], brands: [], sizes: [], colors: [], minPrice: 0, maxPrice: 500, inStock: false, onSale: false, sort: "Newest",
};

interface CatalogSectionProps {
  onAddToCart: (name: string) => void;
  wishlist: number[];
  onToggleWishlist: (id: number) => void;
  onView: (product: Product) => void;
}

export function CatalogSection({ onAddToCart, wishlist, onToggleWishlist, onView }: CatalogSectionProps) {
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const filtered = allProducts.filter((p) => {
    if (filters.categories.length && !filters.categories.includes(p.category)) return false;
    if (filters.onSale && p.badge !== "SALE") return false;
    if (p.price > filters.maxPrice) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (filters.sort === "Price: Low to High") return a.price - b.price;
    if (filters.sort === "Price: High to Low") return b.price - a.price;
    if (filters.sort === "Best Rated") return b.rating - a.rating;
    return 0;
  });

  const handleView = (p: Product) => {
    setActiveProduct(p);
    onView(p);
  };

  return (
    <section id="new-arrivals" className="py-20 bg-secondary">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-[#c8a882] mb-2 tracking-[0.2em]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 500 }}>HANDPICKED</p>
            <h2 className="text-foreground" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,3vw,42px)", fontWeight: 400 }}>
              New Arrivals <span className="text-muted-foreground" style={{ fontSize: "clamp(16px,1.5vw,22px)" }}>({sorted.length})</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 border border-border px-4 py-2.5 hover:bg-muted transition-colors text-foreground"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", letterSpacing: "0.06em" }}
            >
              <SlidersHorizontal size={14} />
              FILTER
            </button>
            {/* Layout toggle */}
            <div className="flex border border-border">
              <button
                onClick={() => setLayout("grid")}
                className={`p-2.5 transition-colors ${layout === "grid" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"}`}
                aria-label="Grid view"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setLayout("list")}
                className={`p-2.5 transition-colors ${layout === "list" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"}`}
                aria-label="List view"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar (desktop always visible) */}
          <div className="hidden lg:block flex-shrink-0 w-64">
            <FilterSidebar open={true} onClose={() => {}} filters={filters} onChange={setFilters} />
          </div>
          {/* Mobile sidebar */}
          <div className="lg:hidden">
            <FilterSidebar open={filterOpen} onClose={() => setFilterOpen(false)} filters={filters} onChange={setFilters} />
          </div>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {layout === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5">
                {sorted.map((product) => (
                  <GridCard
                    key={product.id}
                    product={product}
                    wishlist={wishlist}
                    onToggleWishlist={onToggleWishlist}
                    onAddToCart={onAddToCart}
                    onView={handleView}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {sorted.map((product) => (
                  <ListCard
                    key={product.id}
                    product={product}
                    wishlist={wishlist}
                    onToggleWishlist={onToggleWishlist}
                    onAddToCart={onAddToCart}
                    onView={handleView}
                  />
                ))}
              </div>
            )}

            {sorted.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-muted-foreground" style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px" }}>No products match your filters.</p>
                <button onClick={() => setFilters(defaultFilters)} className="mt-4 text-foreground underline" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>Clear all filters</button>
              </div>
            )}

            <div className="text-center mt-12">
              <button
                className="inline-flex items-center gap-3 border border-foreground text-foreground px-10 py-4 hover:bg-foreground hover:text-background transition-colors"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", letterSpacing: "0.1em", fontWeight: 500 }}
              >
                LOAD MORE
              </button>
            </div>
          </div>
        </div>
      </div>

      <ProductModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToCart={onAddToCart}
        wishlist={wishlist}
        onToggleWishlist={onToggleWishlist}
      />
    </section>
  );
}

function GridCard({ product, wishlist, onToggleWishlist, onAddToCart, onView }: {
  product: Product; wishlist: number[]; onToggleWishlist: (id: number) => void; onAddToCart: (n: string) => void; onView: (p: Product) => void;
}) {
  return (
    <div className="group bg-card cursor-pointer" onClick={() => onView(product)}>
      <div className="relative overflow-hidden bg-muted" style={{ aspectRatio: "3/4" }}>
        <img src={product.img} alt={product.name} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
        {product.badge && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 ${product.badge === "SALE" ? "bg-[#c0392b] text-white" : "bg-foreground text-background"}`}
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", letterSpacing: "0.1em", fontWeight: 600 }}>
            {product.badge}
          </span>
        )}
        <button onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
          className="absolute top-3 right-3 w-8 h-8 bg-card flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-foreground hover:text-background">
          <Heart size={14} strokeWidth={1.5} className={wishlist.includes(product.id) ? "fill-[#c0392b] text-[#c0392b]" : "text-foreground"} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onAddToCart(product.name); }}
          className="absolute bottom-0 left-0 right-0 bg-foreground text-background py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", letterSpacing: "0.1em" }}>
          <ShoppingBag size={13} strokeWidth={1.5} /> QUICK ADD
        </button>
      </div>
      <div className="p-4">
        <p className="text-muted-foreground mb-1" style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", letterSpacing: "0.08em" }}>{product.category.toUpperCase()}</p>
        <h3 className="text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "15px", fontWeight: 400 }}>{product.name}</h3>
        <div className="flex gap-1.5 mb-3">
          {product.colors.map((c) => (
            <span key={c} className="w-3.5 h-3.5 rounded-full border border-border cursor-pointer hover:scale-110 transition-transform" style={{ backgroundColor: c }} />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", fontWeight: 500 }}>${product.price}</span>
            {product.originalPrice && <span className="text-muted-foreground line-through" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>${product.originalPrice}</span>}
          </div>
          <div className="flex items-center gap-1">
            <Star size={11} className="fill-[#c8a882] text-[#c8a882]" />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "var(--muted-foreground)" }}>{product.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListCard({ product, wishlist, onToggleWishlist, onAddToCart, onView }: {
  product: Product; wishlist: number[]; onToggleWishlist: (id: number) => void; onAddToCart: (n: string) => void; onView: (p: Product) => void;
}) {
  return (
    <div className="group bg-card flex gap-5 cursor-pointer hover:shadow-sm transition-shadow border border-transparent hover:border-border" onClick={() => onView(product)}>
      <div className="relative overflow-hidden bg-muted flex-shrink-0 w-36 sm:w-48" style={{ aspectRatio: "3/4" }}>
        <img src={product.img} alt={product.name} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
        {product.badge && (
          <span className={`absolute top-2 left-2 px-2 py-0.5 ${product.badge === "SALE" ? "bg-[#c0392b] text-white" : "bg-foreground text-background"}`}
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", letterSpacing: "0.1em", fontWeight: 600 }}>
            {product.badge}
          </span>
        )}
      </div>
      <div className="flex flex-col justify-between py-4 pr-4 flex-1">
        <div>
          <p className="text-muted-foreground mb-1" style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", letterSpacing: "0.1em" }}>{product.category.toUpperCase()}</p>
          <h3 className="text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 400 }}>{product.name}</h3>
          <div className="flex items-center gap-1.5 mb-3">
            {[1,2,3,4,5].map((s) => <Star key={s} size={11} className={s <= Math.round(product.rating) ? "fill-[#c8a882] text-[#c8a882]" : "text-muted"} />)}
            <span className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>({product.reviews})</span>
          </div>
          <p className="text-muted-foreground hidden sm:block" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 300, maxWidth: "360px", lineHeight: 1.6 }}>
            Crafted from premium materials for effortless everyday elegance. True to size.
          </p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-baseline gap-3">
            <span className="text-foreground" style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 500 }}>${product.price}</span>
            {product.originalPrice && <span className="text-muted-foreground line-through" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>${product.originalPrice}</span>}
          </div>
          <div className="flex gap-2">
            <button onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
              className="w-9 h-9 border border-border flex items-center justify-center hover:bg-foreground hover:text-background hover:border-foreground transition-colors">
              <Heart size={14} strokeWidth={1.5} className={wishlist.includes(product.id) ? "fill-[#c0392b] text-[#c0392b]" : "text-foreground"} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onAddToCart(product.name); }}
              className="flex items-center gap-2 bg-foreground text-background px-5 py-2.5 hover:opacity-80 transition-opacity"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", letterSpacing: "0.08em" }}>
              <ShoppingBag size={13} strokeWidth={1.5} /> ADD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { allProducts };
