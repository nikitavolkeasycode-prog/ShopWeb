// Компонент навигационной панели (хедер)// Верхняя навигационная панель: логотип, меню, поиск, корзина, избранное, профиль.
// Содержит логотип, ссылки категорий, поиск, переключение темы,
// иконки пользователя, избранного и корзины

import { useState } from "react";
import { Search, ShoppingBag, Heart, Menu, X, ChevronDown, User, Sun, Moon } from "lucide-react";
import type { A11ySettings } from "./AccessibilityPanel";

// Ссылки навигации (категории товаров)
const navLinks = [
  { label: "Women", hasDropdown: true },
  { label: "Men", hasDropdown: true },
  { label: "Kids", hasDropdown: false },
  { label: "Accessories", hasDropdown: true },
  { label: "Sale", hasDropdown: false, highlight: true },
];

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onCartOpen: () => void;
  onAuthOpen: () => void;       // Открыть модалку входа/регистрации
  onDashboardOpen: () => void;  // Открыть личный кабинет
  isAuthenticated: boolean;
  a11y: A11ySettings;
  onA11yChange: (s: A11ySettings) => void;
  searchTrigger?: React.ReactNode; // Компонент поиска (SearchBar)
}

export function Navbar({ cartCount, wishlistCount, onCartOpen, onAuthOpen, onDashboardOpen, isAuthenticated, a11y, onA11yChange, searchTrigger }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Переключение светлой/тёмной темы
  const toggleTheme = () =>
    onA11yChange({ ...a11y, theme: a11y.theme === "light" ? "dark" : "light" });

  // Прокрутка к секции каталога
  const scrollToCatalog = () => {
    const el = document.getElementById("new-arrivals");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Прокрутка наверх страницы
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Верхняя плашка с акцией */}
      <div className="bg-foreground text-background text-center py-2.5 px-4" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", letterSpacing: "0.08em" }}>
        FREE SHIPPING ON ORDERS OVER $100 · USE CODE: <span className="underline cursor-pointer">STYLE25</span>
      </div>

      {/* Основная навигация */}
      <nav className="bg-background border-b border-border sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Логотип - ведёт наверх */}
            <button onClick={scrollToTop} className="flex-shrink-0 cursor-pointer">
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 600, color: "var(--foreground)", letterSpacing: "0.04em" }}>
                VOILÀ
              </span>
            </button>

            {/* Навигационные ссылки (десктоп) */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={scrollToCatalog}
                  className={`flex items-center gap-1 transition-colors hover:text-[#c8a882] cursor-pointer ${link.highlight ? "text-[#c0392b]" : "text-foreground"}`}
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", letterSpacing: "0.06em", fontWeight: 500 }}
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown size={13} className="opacity-60" />}
                </button>
              ))}
            </div>

            {/* Иконки действий */}
            <div className="flex items-center gap-4">
              {/* Поиск */}
              {searchTrigger}

              {/* Переключение темы */}
              <button
                onClick={toggleTheme}
                className="hidden lg:flex text-foreground hover:text-[#c8a882] transition-colors"
                aria-label="Сменить тему"
              >
                {a11y.theme === "light" ? <Moon size={17} strokeWidth={1.5} /> : <Sun size={17} strokeWidth={1.5} />}
              </button>

              {/* Аккаунт / Вход */}
              <button
                onClick={onAuthOpen}
                className="hidden lg:flex text-foreground hover:text-[#c8a882] transition-colors"
                aria-label={isAuthenticated ? "Личный кабинет" : "Войти"}
              >
                <User size={18} strokeWidth={1.5} />
              </button>

              {/* Избранное - открывает корзину с вкладкой избранного */}
              <button onClick={onCartOpen} className="relative text-foreground hover:text-[#c8a882] transition-colors" aria-label="Избранное">
                <Heart size={18} strokeWidth={1.5} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#c8a882] text-white rounded-full w-4 h-4 flex items-center justify-center" style={{ fontSize: "9px" }}>
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Корзина */}
              <button onClick={onCartOpen} className="relative text-foreground hover:text-[#c8a882] transition-colors" aria-label="Корзина">
                <ShoppingBag size={18} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-foreground text-background rounded-full w-4 h-4 flex items-center justify-center" style={{ fontSize: "9px" }}>
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Мобильное меню (бургер) */}
              <button className="lg:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Меню">
                {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>

        {/* Мобильное меню (выезжающее) */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-background">
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => { scrollToCatalog(); setMobileOpen(false); }}
                  className={`py-2 border-b border-border text-left ${link.highlight ? "text-[#c0392b]" : "text-foreground"}`}
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", letterSpacing: "0.05em" }}
                >
                  {link.label}
                </button>
              ))}
              <div className="flex gap-4 pt-2">
                <button onClick={() => { onAuthOpen(); setMobileOpen(false); }} className="flex items-center gap-2 text-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>
                  <User size={16} strokeWidth={1.5} /> {isAuthenticated ? "Личный кабинет" : "Войти"}
                </button>
                <button onClick={toggleTheme} className="flex items-center gap-2 text-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>
                  {a11y.theme === "light" ? <Moon size={16} strokeWidth={1.5} /> : <Sun size={16} strokeWidth={1.5} />} Тема
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}