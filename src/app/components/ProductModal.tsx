import { useState } from "react";// Модальное окно товара: подробная информация, галерея, выбор цвета/размера, добавление в корзину.
import { X, Heart, ShoppingBag, Star, ChevronLeft, ChevronRight, Minus, Plus, Share2 } from "lucide-react";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number | null;
  rating: number;
  reviews: number;
  badge: string | null;
  img: string;
  colors: string[];
  description?: string;
  images?: string[];
  sizes?: string[];
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (name: string) => void;
  wishlist: number[];
  onToggleWishlist: (id: number) => void;
}

const reviewsData = [
  { id: 1, name: "Marie L.", rating: 5, date: "May 2026", text: "Absolutely gorgeous piece. The fabric quality exceeded my expectations — soft, structured, and true to size." },
  { id: 2, name: "Anna K.", rating: 4, date: "April 2026", text: "Beautiful design and great fit. Would size up if you're between sizes. Delivery was fast." },
  { id: 3, name: "Clara B.", rating: 5, date: "March 2026", text: "I get compliments every time I wear this. Worth every penny. Already planning to buy it in another colour." },
];

export function ProductModal({ product, onClose, onAddToCart, wishlist, onToggleWishlist }: ProductModalProps) {
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"details" | "reviews">("details");

  if (!product) return null;

  const images = product.images ?? [product.img, product.img, product.img];
  const sizes = product.sizes ?? ["XS", "S", "M", "L", "XL"];

  const prevImg = () => setActiveImg((p) => (p - 1 + images.length) % images.length);
  const nextImg = () => setActiveImg((p) => (p + 1) % images.length);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)]" />
      <div
        className="relative bg-card w-full max-w-[900px] max-h-[92vh] overflow-y-auto grid md:grid-cols-2 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 bg-card flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <X size={16} strokeWidth={1.5} className="text-foreground" />
        </button>

        {/* Gallery */}
        <div className="relative bg-secondary flex flex-col" style={{ minHeight: "400px" }}>
          <div className="relative flex-1 overflow-hidden" style={{ minHeight: "380px" }}>
            <img
              src={images[activeImg]}
              alt={product.name}
              className="w-full h-full object-cover object-top"
            />
            {product.badge && (
              <span
                className={`absolute top-4 left-4 px-2.5 py-1 ${product.badge === "SALE" ? "bg-[#c0392b] text-white" : "bg-foreground text-background"}`}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", letterSpacing: "0.1em", fontWeight: 600 }}
              >
                {product.badge}
              </span>
            )}
            <button onClick={prevImg} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-card/80 flex items-center justify-center hover:bg-card transition">
              <ChevronLeft size={16} className="text-foreground" />
            </button>
            <button onClick={nextImg} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-card/80 flex items-center justify-center hover:bg-card transition">
              <ChevronRight size={16} className="text-foreground" />
            </button>
          </div>
          {/* Thumbnails */}
          <div className="flex gap-2 p-3 bg-muted">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-16 h-20 overflow-hidden flex-shrink-0 border-2 transition-colors ${i === activeImg ? "border-foreground" : "border-transparent opacity-60"}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover object-top" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col p-7 overflow-y-auto">
          <div className="flex items-start justify-between gap-3 mb-1">
            <p className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", letterSpacing: "0.1em" }}>
              {product.category.toUpperCase()}
            </p>
            <button onClick={() => onToggleWishlist(product.id)} className="text-muted-foreground hover:text-[#c0392b] transition-colors mt-0.5">
              <Heart size={16} strokeWidth={1.5} className={wishlist.includes(product.id) ? "fill-[#c0392b] text-[#c0392b]" : ""} />
            </button>
          </div>
          <h2 className="mb-2 text-foreground" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px,2.5vw,28px)", fontWeight: 400 }}>
            {product.name}
          </h2>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={12} className={s <= Math.round(product.rating) ? "fill-[#c8a882] text-[#c8a882]" : "text-muted"} />
              ))}
            </div>
            <span className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-foreground" style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 500 }}>
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-muted-foreground line-through" style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px" }}>
                ${product.originalPrice}
              </span>
            )}
            {product.originalPrice && (
              <span className="bg-[#c0392b] text-white px-2 py-0.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 600 }}>
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            )}
          </div>

          {/* Colors */}
          <div className="mb-5">
            <p className="text-muted-foreground mb-2.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", letterSpacing: "0.08em" }}>
              COLOR {selectedColor ? `— ${selectedColor}` : ""}
            </p>
            <div className="flex gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${selectedColor === c ? "border-foreground" : "border-transparent"}`}
                  style={{ backgroundColor: c, boxShadow: "0 0 0 1px rgba(26,23,20,0.2)" }}
                />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", letterSpacing: "0.08em" }}>SIZE</p>
              <button className="text-muted-foreground hover:text-foreground transition-colors" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", borderBottom: "1px solid currentColor" }}>
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`w-10 h-10 border transition-colors ${selectedSize === s ? "bg-foreground text-background border-foreground" : "bg-card text-foreground border-border hover:border-foreground"}`}
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 500 }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Qty + Add to cart */}
          <div className="flex gap-3 mb-6">
            <div className="flex items-center border border-border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-11 flex items-center justify-center hover:bg-secondary transition-colors text-foreground">
                <Minus size={13} />
              </button>
              <span className="w-10 text-center text-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="w-10 h-11 flex items-center justify-center hover:bg-secondary transition-colors text-foreground">
                <Plus size={13} />
              </button>
            </div>
            <button
              onClick={() => { onAddToCart(product.name); }}
              className="flex-1 bg-foreground text-background flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", letterSpacing: "0.1em", fontWeight: 600 }}
            >
              <ShoppingBag size={14} strokeWidth={1.5} />
              ADD TO BAG
            </button>
          </div>

          {/* Share */}
          <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>
            <Share2 size={13} />
            Share
          </button>

          {/* Tabs */}
          <div className="border-t border-border pt-5">
            <div className="flex gap-6 mb-4">
              {(["details", "reviews"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`pb-2 transition-colors capitalize ${tab === t ? "text-foreground border-b-2 border-foreground" : "text-muted-foreground"}`}
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", letterSpacing: "0.06em" }}
                >
                  {t === "reviews" ? `Reviews (${reviewsData.length})` : "Details"}
                </button>
              ))}
            </div>

            {tab === "details" && (
              <p className="text-muted-foreground leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 300 }}>
                {product.description ?? "Crafted from premium-quality materials, this piece is designed for effortless elegance. Easy to dress up or down — a true wardrobe essential. Machine wash cold, lay flat to dry. Model is 5'9\" and wears size S."}
              </p>
            )}

            {tab === "reviews" && (
              <div className="flex flex-col gap-4">
                {reviewsData.map((r) => (
                  <div key={r.id} className="border-b border-border pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 500, color: "var(--foreground)" }}>{r.name}</span>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "var(--muted-foreground)" }}>{r.date}</span>
                      </div>
                      <div className="flex">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} size={11} className={s <= r.rating ? "fill-[#c8a882] text-[#c8a882]" : "text-muted"} />
                        ))}
                      </div>
                    </div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 300, color: "var(--muted-foreground)" }}>{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
