import { useState, useRef, useEffect } from "react";
// Поиск по товарам: ввод текста, выбор из выпадающего списка, переход на карточку товара.
import { Search, X, ArrowRight } from "lucide-react";
import type { Product } from "./ProductModal";

interface SearchBarProps {
  products: Product[];
  onSelect: (product: Product) => void;
  onAddToCart: (name: string) => void;
}

export function SearchBar({ products, onSelect, onAddToCart }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-foreground hover:text-[#c8a882] transition-colors"
        aria-label="Search"
      >
        <Search size={18} strokeWidth={1.5} />
      </button>

      {open && (
        <div className="fixed lg:absolute inset-0 lg:inset-auto lg:top-full lg:right-0 lg:mt-2 z-50 flex items-start justify-center lg:block">
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.3)] lg:hidden" onClick={() => { setOpen(false); setQuery(""); }} />
          <div className="relative bg-card w-full lg:w-[420px] shadow-xl border border-border mt-16 lg:mt-0 mx-4 lg:mx-0">
            <div className="flex items-center border-b border-border px-4">
              <Search size={16} strokeWidth={1.5} className="text-muted-foreground flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-transparent px-3 py-4 text-foreground placeholder-muted-foreground outline-none"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
                  <X size={16} strokeWidth={1.5} />
                </button>
              )}
            </div>

            {query && results.length === 0 && (
              <div className="p-6 text-center">
                <p className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>
                  No products found for "{query}"
                </p>
              </div>
            )}

            {results.length > 0 && (
              <div className="max-h-[320px] overflow-y-auto p-2">
                {results.slice(0, 8).map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      onSelect(product);
                      setOpen(false);
                      setQuery("");
                    }}
                    className="flex items-center gap-4 w-full p-3 hover:bg-secondary transition-colors text-left"
                  >
                    <div className="w-12 h-14 bg-secondary flex-shrink-0 overflow-hidden">
                      <img src={product.img} alt={product.name} className="w-full h-full object-cover object-top" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground truncate" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 500 }}>
                        {product.name}
                      </p>
                      <p className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>
                        {product.category} · ${product.price}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product.name);
                        setOpen(false);
                        setQuery("");
                      }}
                      className="flex items-center gap-1 bg-foreground text-background px-3 py-1.5 hover:opacity-80 transition-opacity flex-shrink-0"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", letterSpacing: "0.06em" }}
                    >
                      ADD <ArrowRight size={12} />
                    </button>
                  </button>
                ))}
                {results.length > 8 && (
                  <p className="text-center text-muted-foreground py-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>
                    +{results.length - 8} more results
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}