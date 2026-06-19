// Главный компонент приложения (корневой).
// Здесь собираются все секции сайта, хранится состояние корзины, избранного, заказов и доступности.
import { useState, useEffect, useRef } from "react";
// Верхняя панель навигации (меню, поиск, корзина, профиль).
import { Navbar } from "./components/Navbar";
// Главный баннер на главной странице с автоматической сменой слайдов.
import { HeroSlider } from "./components/HeroSlider";
// Секция категорий (Женщинам, Мужчинам и т.д.).
import { Categories } from "./components/Categories";
// Каталог товаров с фильтрами, сортировкой, сеткой/списком и пагинацией.
import { CatalogSection, allProducts } from "./components/CatalogSection";
// Промо-баннер (акция, купон).
import { PromoBanner } from "./components/PromoBanner";
// Секция популярных товаров.
import { PopularSection } from "./components/PopularSection";
// Секция «Вы недавно смотрели».
import { RecentlyViewed } from "./components/RecentlyViewed";
// Отзывы покупателей.
import { Testimonials } from "./components/Testimonials";
// Баннер программы лояльности.
import { LoyaltyBanner } from "./components/LoyaltyBanner";
// Подписка на рассылку (email).
import { Newsletter } from "./components/Newsletter";
// Подвал сайта (ссылки, контакты).
import { Footer } from "./components/Footer";
// Выдвижная панель корзины.
import { CartDrawer } from "./components/CartDrawer";
// Модальное окно входа/регистрации.
import { AuthModal } from "./components/AuthModal";
// Личный кабинет пользователя.
import { UserDashboard } from "./components/UserDashboard";
// Поиск по товарам.
import { SearchBar } from "./components/SearchBar";
// Игровая мини-игра для получения промокодов.
import { GameSection } from "./components/GameSection";
// Панель настроек доступности (шрифт, тема, контраст).
import { AccessibilityPanel, A11ySettings } from "./components/AccessibilityPanel";
// Хук для получения данных текущего пользователя (авторизован/нет).
import { useAuth } from "../context/AuthContext";
// Сервис для работы с авторизацией, заказами, избранным, промокодами.
import { authService } from "../services/auth.service";
// Тип «Товар» (используется во многих компонентах).
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
  const { isAuthenticated, user } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const catalogRef = useRef<HTMLDivElement>(null);

  const [a11y, setA11y] = useState<A11ySettings>({
    theme: "light",
    fontSize: "normal",
    highContrast: false,
    dyslexicFont: false,
  });

  // Apply accessibility settings to document
  useEffect(() => {
    const root = document.documentElement;
    if (a11y.theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    const sizeMap = { normal: "16px", large: "19px", xlarge: "22px" };
    root.style.setProperty("--font-size", sizeMap[a11y.fontSize]);

    if (a11y.highContrast) {
      root.style.setProperty("--muted-foreground", a11y.theme === "dark" ? "#e0e0e0" : "#333333");
      root.style.setProperty("--border", a11y.theme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)");
    } else {
      root.style.removeProperty("--muted-foreground");
      root.style.removeProperty("--border");
    }

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

  const handleUpdateCartQty = (id: number, delta: number) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
      ).filter((i) => i.qty > 0)
    );
  };

  const handleToggleWishlist = (id: number) => {
    setWishlist((prev) => {
      const updated = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      // Persist to auth service if logged in
      if (isAuthenticated) {
        authService.saveWishlist(updated);
      }
      return updated;
    });
  };

  const handleAuthOpen = () => {
    if (isAuthenticated) {
      setDashboardOpen(true);
    } else {
      setAuthOpen(true);
    }
  };

  const handleView = (product: Product) => {
    setActiveProductModal(product);
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 8);
    });
  };

  const handleEarnPromo = (code: string, discount: number, description: string) => {
    if (!isAuthenticated || !user) {
      setAuthOpen(true);
      return;
    }
    // Add promo code to user's account
    const existing = authService.getPromoCodes();
    const newPromo = {
      id: "promo_" + Date.now(),
      code,
      discount,
      description,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isUsed: false,
    };
    existing.unshift(newPromo);
    localStorage.setItem(
      "voila_promos_" + user.id,
      JSON.stringify(existing)
    );
  };

  const handleAddWishlistToCart = (productId: number, productName: string) => {
    handleAddToCart(productName);
    setWishlist((prev) => prev.filter((id) => id !== productId));
  };

  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar
        cartCount={cartItems.reduce((s, i) => s + i.qty, 0)}
        wishlistCount={wishlist.length}
        onCartOpen={() => setCartOpen(true)}
        onAuthOpen={handleAuthOpen}
        onDashboardOpen={() => setDashboardOpen(true)}
        isAuthenticated={isAuthenticated}
        a11y={a11y}
        onA11yChange={setA11y}
        searchTrigger={
          <SearchBar
            products={allProducts}
            onSelect={handleView}
            onAddToCart={handleAddToCart}
          />
        }
      />

      <main>
        <HeroSlider />
        <Categories />
        <div ref={catalogRef}>
          <CatalogSection
            onAddToCart={handleAddToCart}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onView={handleView}
          />
        </div>
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
        <GameSection onEarnPromo={handleEarnPromo} />
        <Testimonials />
        <Newsletter />
      </main>

      <Footer />

      <CartDrawer
        open={cartOpen}
        onClose={() => { setCartOpen(false); setCheckoutOpen(false); }}
        items={cartItems}
        onRemove={handleRemoveFromCart}
        onUpdateQty={handleUpdateCartQty}
        onCheckout={() => {
          if (!isAuthenticated) {
            setCartOpen(false);
            setAuthOpen(true);
          } else {
            setCheckoutOpen(true);
          }
        }}
        checkoutOpen={checkoutOpen}
        onCheckoutComplete={() => {
          setCartItems([]);
          setCheckoutOpen(false);
          setCartOpen(false);
        }}
      />

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      <UserDashboard
        open={dashboardOpen}
        onClose={() => setDashboardOpen(false)}
        onNavigateToCatalog={() => {
          setDashboardOpen(false);
          catalogRef.current?.scrollIntoView({ behavior: "smooth" });
        }}
        wishlist={wishlist}
        onRemoveWishlistItem={(id) => setWishlist((prev) => prev.filter((x) => x !== id))}
        onAddWishlistToCart={handleAddWishlistToCart}
      />

      <AccessibilityPanel settings={a11y} onChange={setA11y} />
    </div>
  );
}