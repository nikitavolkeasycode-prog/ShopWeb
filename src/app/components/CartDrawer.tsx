import { useState } from "react";// Выдвижная панель корзины: список товаров, изменение количества, удаление, оформление заказа.
import { X, ShoppingBag, Trash2, ArrowRight, Minus, Plus, Check } from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  img: string;
}

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: number) => void;
  onUpdateQty: (id: number, delta: number) => void;
  onCheckout: () => void;
  checkoutOpen: boolean;
  onCheckoutComplete: () => void;
}

export function CartDrawer({ open, onClose, items, onRemove, onUpdateQty, onCheckout, checkoutOpen, onCheckoutComplete }: CartDrawerProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-[rgba(26,23,20,0.4)] z-40 transition-opacity"
          onClick={() => { if (!checkoutOpen) onClose(); }}
        />
      )}
      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-[#faf9f7] z-50 flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(26,23,20,0.08)]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} strokeWidth={1.5} />
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px" }}>
              {checkoutOpen ? "Checkout" : `Your Bag (${items.length})`}
            </span>
          </div>
          <button onClick={() => { if (checkoutOpen) { onCheckoutComplete(); } else { onClose(); } }} className="hover:opacity-60 transition-opacity">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
          {checkoutOpen ? (
            /* Checkout Form */
            <CheckoutForm
              items={items}
              total={total}
              onComplete={onCheckoutComplete}
            />
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <ShoppingBag size={40} strokeWidth={1} className="text-[#c8a882]" />
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", color: "#1a1714" }}>
                Your bag is empty
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#7a7470" }}>
                Add some beautiful pieces to get started.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-20 h-24 bg-[#e8e3dc] flex-shrink-0 overflow-hidden">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover object-top" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "15px", color: "#1a1714" }}>
                      {item.name}
                    </p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#7a7470", marginTop: "2px" }}>
                      ${item.price} each
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-[rgba(26,23,20,0.15)]">
                      <button onClick={() => onUpdateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-[#e8e3dc] transition-colors">
                        <Minus size={12} strokeWidth={1.5} />
                      </button>
                      <span className="w-8 text-center" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#1a1714" }}>{item.qty}</span>
                      <button onClick={() => onUpdateQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-[#e8e3dc] transition-colors">
                        <Plus size={12} strokeWidth={1.5} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 500, color: "#1a1714" }}>
                        ${item.price * item.qty}
                      </span>
                      <button onClick={() => onRemove(item.id)} className="text-[#7a7470] hover:text-[#c0392b] transition-colors">
                        <Trash2 size={14} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && !checkoutOpen && (
          <div className="px-6 py-6 border-t border-[rgba(26,23,20,0.08)]">
            <div className="flex justify-between items-center mb-4">
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#7a7470" }}>
                Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)
              </span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", color: "#1a1714" }}>
                ${total}
              </span>
            </div>
            <p className="text-[#7a7470] mb-4" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>
              Free shipping on orders over $100
            </p>
            <button
              onClick={onCheckout}
              className="w-full bg-[#1a1714] text-[#faf9f7] py-4 flex items-center justify-center gap-3 hover:bg-[#2d2926] transition-colors"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", letterSpacing: "0.1em", fontWeight: 600 }}
            >
              CHECKOUT
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// Валидация полей формы оформления заказа
const checkoutValidation = {
  name: (v: string): string | null => {
    if (!v.trim()) return "Имя обязательно";
    if (v.trim().length < 2) return "Имя должно содержать хотя бы 2 символа";
    if (!/^[a-zA-Zа-яА-Я\s\-]{2,50}$/.test(v.trim())) return "Имя может содержать только буквы, пробелы и дефис";
    return null;
  },
  email: (v: string): string | null => {
    if (!v.trim()) return "Email обязателен";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return "Введите корректный email адрес";
    return null;
  },
  address: (v: string): string | null => {
    if (!v.trim()) return "Адрес обязателен";
    if (v.trim().length < 10) return "Введите полный адсс (не менее 10 символов)";
    return null;
  },
  city: (v: string): string | null => {
    if (!v.trim()) return "Город обязателен";
    if (!/^[a-zA-Zа-яА-Я\s\-]{2,50}$/.test(v.trim())) return "Название города может содержать только буквы";
    return null;
  },
  zip: (v: string): string | null => {
    if (!v.trim()) return "Почтовый индекс обязателен";
    if (!/^\d{5}(-\d{4})?$/.test(v.trim())) return "Введите корректный ZIP код (5 цифр)";
    return null;
  },
  card: (v: string): string | null => {
    if (!v.trim()) return "Номер карты обязателен";
    const cleaned = v.replace(/\s/g, "");
    if (!/^\d{13,19}$/.test(cleaned)) return "Введите корректный номер карты (13-19 цифр)";
    if (!/^4/.test(cleaned) && !/^5[1-5]/.test(cleaned)) return "Поддерживаются только Visa и MasterCard";
    return null;
  },
};

function CheckoutForm({ items, total, onComplete }: { items: CartItem[]; total: number; onComplete: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", address: "", city: "", zip: "", card: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});

  // Форматирование номера карты (XXXX XXXX XXXX XXXX)
  const formatCard = (value: string): string => {
    const cleaned = value.replace(/\D/g, "");
    const groups = [];
    for (let i = 0; i < cleaned.length; i += 4) {
      groups.push(cleaned.slice(i, i + 4));
    }
    return groups.join(" ").slice(0, 19);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация всех полей
    const errors: Record<string, string | null> = {
      name: checkoutValidation.name(form.name),
      email: checkoutValidation.email(form.email),
      address: checkoutValidation.address(form.address),
      city: checkoutValidation.city(form.city),
      zip: checkoutValidation.zip(form.zip),
      card: checkoutValidation.card(form.card),
    };
    setFieldErrors(errors);

    if (Object.values(errors).some((e) => e !== null)) return;

    setSubmitted(true);
    setTimeout(onComplete, 2000);
  };

  // Сброс ошибки поля при вводе
  const updateField = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: null }));
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center">
          <Check size={24} className="text-white" />
        </div>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: "#1a1714" }}>
          Заказ оформлен!
        </p>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#7a7470" }}>
          Заказ будет отправлен в течение 2-3 рабочих дней.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", color: "#1a1714", marginBottom: "4px" }}>
        Детали доставки
      </h3>

      {[
        { label: "Full Name", key: "name", placeholder: "John Doe" },
        { label: "Email", key: "email", type: "email", placeholder: "john@example.com" },
        { label: "Address", key: "address", placeholder: "123 Main Street, Apt 4B" },
        { label: "City", key: "city", placeholder: "New York" },
        { label: "ZIP Code", key: "zip", placeholder: "10001" },
        { label: "Card Number", key: "card", placeholder: "•••• •••• •••• ••••", maxLength: 19 },
      ].map((field) => (
        <div key={field.key}>
          <label style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#7a7470", letterSpacing: "0.08em" }}>
            {field.label.toUpperCase()}
          </label>
          <input
            type={field.type || "text"}
            value={(form as any)[field.key]}
            onChange={(e) => {
              const val = field.key === "card" ? formatCard(e.target.value) : e.target.value;
              updateField(field.key, val);
            }}
            placeholder={field.placeholder || ""}
            required
            maxLength={field.maxLength || undefined}
            className={`w-full border px-3 py-2.5 mt-1 outline-none focus:border-[#c8a882] transition-colors bg-white ${
              fieldErrors[field.key] ? "border-[#c0392b]" : "border-[rgba(26,23,20,0.15)]"
            }`}
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#1a1714" }}
          />
          {fieldErrors[field.key] && (
            <p className="mt-1 text-[#c0392b]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>
              {fieldErrors[field.key]}
            </p>
          )}
        </div>
      ))}

      <div className="border-t border-[rgba(26,23,20,0.08)] pt-4 mt-2">
        <div className="flex justify-between mb-4">
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#7a7470" }}>Итого</span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: "#1a1714" }}>${total}</span>
        </div>
        <button
          type="submit"
          className="w-full bg-[#1a1714] text-[#faf9f7] py-4 flex items-center justify-center gap-3 hover:bg-[#2d2926] transition-colors"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", letterSpacing: "0.1em", fontWeight: 600 }}
        >
          ОПЛАТИТЬ ${total}
          <ArrowRight size={14} />
        </button>
      </div>
    </form>
  );
}
