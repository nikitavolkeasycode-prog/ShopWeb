import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { HeroSlider } from "./components/HeroSlider";
import { Categories } from "./components/Categories";
import { CatalogSection, allProducts } from "./components/CatalogSection";
import { PromoBanner } from "./components/PromoBanner";
import { PopularSection } from "./components/PopularSection";
import { RecentlyViewed } from "./components/RecentlyViewed";
import { Testimonials } from "./components/Testimonials";
import { LoyaltyBanner } from "./components/LoyaltyBanner";
import { Newsletter } from "./components/Newsletter";
import { Footer } from "./components/Footer";
import { CartDrawer } from "./components/CartDrawer";
import { AuthModal } from "./components/AuthModal";
import { AccessibilityPanel, A11ySettings } from "./components/AccessibilityPanel";
import type { Product } from "./components/ProductModal";

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  img: string;
}

const productMeta: Record<string, { price: number; img: string }> = Object.fromEntries(
  allProducts.map((p) => [p.name, { price: p.price, img: p.img }])
);

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  const [a11y, setA11y] = useState<A11ySettings>({
    theme: "light",
    fontSize: "normal",
    highContrast: false,
    dyslexicFont: false,
  });

  // Apply accessibility settings to document
  useEffect(() => {
    const root = document.documentElement;
    // Dark/light theme
    if (a11y.theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Font size
    const sizeMap = { normal: "16px", large: "19px", xlarge: "22px" };
    root.style.setProperty("--font-size", sizeMap[a11y.fontSize]);

    // High contrast overrides
    if (a11y.highContrast) {
      root.style.setProperty("--muted-foreground", a11y.theme === "dark" ? "#e0e0e0" : "#333333");
      root.style.setProperty("--border", a11y.theme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)");
    } else {
      root.style.removeProperty("--muted-foreground");
      root.style.removeProperty("--border");
    }

    // Dyslexic font
    if (a11y.dyslexicFont) {
      root.style.setProperty("--font-body", "'Arial', sans-serif");
      document.body.style.fontFamily = "Arial, sans-serif";
      document.body.style.letterSpacing = "0.05em";
      document.body.style.wordSpacing = "0.1em";
      document.body.style.lineHeight = "1.8";
    } else {
      root.style.removeProperty("--font-body");
      document.body.style.fontFamily = "";
      document.body.style.letterSpacing = "";
      document.body.style.wordSpacing = "";
      document.body.style.lineHeight = "";
    }
  }, [a11y]);

  const handleAddToCart = (name: string) => {
    const meta = productMeta[name];
    setCartItems((prev) => {
      const existing = prev.find((i) => i.name === name);
      if (existing) return prev.map((i) => i.name === name ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: Date.now(), name, price: meta?.price ?? 100, qty: 1, img: meta?.img ?? "" }];
    });
    setCartOpen(true);
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleToggleWishlist = (id: number) => {
    setWishlist((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const handleView = (product: Product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 8);
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar
        cartCount={cartItems.reduce((s, i) => s + i.qty, 0)}
        wishlistCount={wishlist.length}
        onCartOpen={() => setCartOpen(true)}
        onAuthOpen={() => setAuthOpen(true)}
        a11y={a11y}
        onA11yChange={setA11y}
      />

      <main>
        <HeroSlider />
        <Categories />
        <CatalogSection
          onAddToCart={handleAddToCart}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onView={handleView}
        />
        <RecentlyViewed
          products={recentlyViewed}
          onView={handleView}
          onAddToCart={handleAddToCart}
        />
        <PopularSection
          products={allProducts}
          onView={handleView}
          onAddToCart={handleAddToCart}
        />
        <PromoBanner />
        <LoyaltyBanner />
        <Testimonials />
        <Newsletter />
      </main>

      <Footer />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onRemove={handleRemoveFromCart}
      />

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      <AccessibilityPanel settings={a11y} onChange={setA11y} />
    </div>
  );
}
