import { useState } from "react";// Боковая панель фильтров: категории, цена, размеры, цвета, сортировка.
import { ChevronDown, ChevronUp, X, SlidersHorizontal } from "lucide-react";

const categories = ["Women", "Men", "Kids", "Accessories"];
const brands = ["Voilà Basics", "Maison Étoile", "Nordic Draft", "Alba Studio", "Côte Azure"];
const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colors = [
  { name: "Ivory", hex: "#f5f0e8" },
  { name: "Black", hex: "#1a1714" },
  { name: "Camel", hex: "#c8a882" },
  { name: "Sage", hex: "#8faa8b" },
  { name: "Navy", hex: "#2b3a5a" },
  { name: "Blush", hex: "#e8b4b8" },
];
const sortOptions = ["Newest", "Price: Low to High", "Price: High to Low", "Best Rated", "Most Popular"];

interface FilterState {
  categories: string[];
  brands: string[];
  sizes: string[];
  colors: string[];
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
  onSale: boolean;
  sort: string;
}

interface FilterSidebarProps {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (f: FilterState) => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-border py-4">
      <button
        className="w-full flex items-center justify-between mb-3"
        onClick={() => setOpen(!open)}
      >
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", letterSpacing: "0.1em", fontWeight: 600, color: "var(--foreground)" }}>
          {title.toUpperCase()}
        </span>
        {open ? <ChevronUp size={13} className="text-muted-foreground" /> : <ChevronDown size={13} className="text-muted-foreground" />}
      </button>
      {open && children}
    </div>
  );
}

export function FilterSidebar({ open, onClose, filters, onChange }: FilterSidebarProps) {
  const toggle = <K extends "categories" | "brands" | "sizes" | "colors">(key: K, val: string) => {
    const arr = filters[key] as string[];
    onChange({ ...filters, [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] });
  };

  const activeCount =
    filters.categories.length + filters.brands.length + filters.sizes.length +
    filters.colors.length + (filters.inStock ? 1 : 0) + (filters.onSale ? 1 : 0) +
    (filters.minPrice > 0 ? 1 : 0) + (filters.maxPrice < 500 ? 1 : 0);

  const reset = () =>
    onChange({ categories: [], brands: [], sizes: [], colors: [], minPrice: 0, maxPrice: 500, inStock: false, onSale: false, sort: "Newest" });

  return (
    <>
      {open && <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] z-30 lg:hidden" onClick={onClose} />}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen lg:h-auto w-72 bg-card z-40 lg:z-auto
          flex flex-col overflow-y-auto border-r border-border
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{ maxHeight: "calc(100vh - 5rem)", top: "5rem" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-card z-10">
          <div className="flex items-center gap-2 text-foreground">
            <SlidersHorizontal size={15} strokeWidth={1.5} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600 }}>
              Filters {activeCount > 0 && <span className="ml-1 bg-accent text-accent-foreground rounded-full px-1.5 py-0.5" style={{ fontSize: "10px" }}>{activeCount}</span>}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {activeCount > 0 && (
              <button onClick={reset} className="text-muted-foreground hover:text-foreground transition-colors" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>
                Clear all
              </button>
            )}
            <button onClick={onClose} className="lg:hidden text-muted-foreground hover:text-foreground">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="px-5 overflow-y-auto flex-1">
          {/* Sort */}
          <Section title="Sort By">
            <select
              value={filters.sort}
              onChange={(e) => onChange({ ...filters, sort: e.target.value })}
              className="w-full bg-secondary text-foreground border border-border px-3 py-2 outline-none focus:border-accent transition-colors"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}
            >
              {sortOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </Section>

          {/* Category checkboxes */}
          <Section title="Category">
            <div className="flex flex-col gap-2.5">
              {categories.map((c) => (
                <label key={c} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(c)}
                    onChange={() => toggle("categories", c)}
                    className="w-4 h-4 accent-[#c8a882] cursor-pointer"
                  />
                  <span className="text-foreground group-hover:text-[#c8a882] transition-colors" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>
                    {c}
                  </span>
                </label>
              ))}
            </div>
          </Section>

          {/* Price range */}
          <Section title="Price Range">
            <div className="px-1">
              <div className="flex justify-between mb-3">
                <span className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>${filters.minPrice}</span>
                <span className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>${filters.maxPrice}</span>
              </div>
              <input
                type="range"
                min={0}
                max={500}
                step={10}
                value={filters.maxPrice}
                onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
                className="w-full accent-[#c8a882] cursor-pointer"
              />
            </div>
          </Section>

          {/* Size buttons */}
          <Section title="Size">
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => toggle("sizes", s)}
                  className={`w-10 h-10 border text-sm transition-colors ${filters.sizes.includes(s) ? "bg-foreground text-background border-foreground" : "bg-card text-foreground border-border hover:border-foreground"}`}
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 500 }}
                >
                  {s}
                </button>
              ))}
            </div>
          </Section>

          {/* Color swatches */}
          <Section title="Color">
            <div className="flex flex-wrap gap-3">
              {colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => toggle("colors", c.name)}
                  title={c.name}
                  className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${filters.colors.includes(c.name) ? "border-foreground scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: c.hex, boxShadow: "0 0 0 1px rgba(26,23,20,0.15)" }}
                />
              ))}
            </div>
          </Section>

          {/* Brands radio-style */}
          <Section title="Brand">
            <div className="flex flex-col gap-2.5">
              {brands.map((b) => (
                <label key={b} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="brand"
                    checked={filters.brands.includes(b)}
                    onChange={() => onChange({ ...filters, brands: [b] })}
                    className="w-4 h-4 accent-[#c8a882] cursor-pointer"
                  />
                  <span className="text-foreground group-hover:text-[#c8a882] transition-colors" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>
                    {b}
                  </span>
                </label>
              ))}
            </div>
          </Section>

          {/* Toggles */}
          <Section title="Availability">
            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "var(--foreground)" }}>In Stock Only</span>
                <button
                  onClick={() => onChange({ ...filters, inStock: !filters.inStock })}
                  className={`w-10 h-5 rounded-full relative transition-colors ${filters.inStock ? "bg-[#c8a882]" : "bg-muted"}`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${filters.inStock ? "translate-x-5" : "translate-x-0.5"}`}
                  />
                </button>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "var(--foreground)" }}>On Sale</span>
                <button
                  onClick={() => onChange({ ...filters, onSale: !filters.onSale })}
                  className={`w-10 h-5 rounded-full relative transition-colors ${filters.onSale ? "bg-[#c8a882]" : "bg-muted"}`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${filters.onSale ? "translate-x-5" : "translate-x-0.5"}`}
                  />
                </button>
              </label>
            </div>
          </Section>
        </div>
      </aside>
    </>
  );
}

export type { FilterState };
