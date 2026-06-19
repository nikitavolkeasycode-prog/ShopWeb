import { useState, useEffect } from "react";
// Личный кабинет пользователя: профиль, заказы, отзывы, промокоды, адреса.
import {
  User,
  Package,
  Heart,
  Gift,
  Star,
  LogOut,
  Edit3,
  Save,
  X,
  ChevronRight,
  Copy,
  Check,
  Clock,
  MapPin,
  CreditCard,
  Mail,
  Phone,
  Calendar,
  Trophy,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authService, validation } from "../../services/auth.service";
import type { Order, OrderStatus, Review, PromoCode } from "../../types/auth";

// ─── Reusable helper components ──────────────────────────────────────────────

function StatusBadge({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, { label: string; bg: string; text: string }> = {
    pending: { label: "Pending", bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-800 dark:text-yellow-300" },
    processing: { label: "Processing", bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-800 dark:text-blue-300" },
    shipped: { label: "Shipped", bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-800 dark:text-purple-300" },
    delivered: { label: "Delivered", bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-800 dark:text-green-300" },
    cancelled: { label: "Cancelled", bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-800 dark:text-red-300" },
  };
  const s = styles[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 ${s.bg} ${s.text}`} style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 500, letterSpacing: "0.05em" }}>
      {s.label}
    </span>
  );
}

function TabButton({ label, icon: Icon, active, onClick }: { label: string; icon: any; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3.5 transition-all ${
        active
          ? "bg-[#c8a882]/10 text-foreground border-r-2 border-[#c8a882]"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
      }`}
      style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", letterSpacing: "0.04em" }}
    >
      <Icon size={17} strokeWidth={1.5} />
      <span>{label}</span>
    </button>
  );
}

// ─── Section: Profile ───────────────────────────────────────────────────────

function ProfileSection() {
  const { user, updateProfile, error, clearError } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email, phone: user.phone || "" });
    }
  }, [user]);

  const handleSave = async () => {
    // Validate
    const errors: Record<string, string | null> = {};
    errors.name = validation.name(form.name);
    errors.email = validation.email(form.email);
    errors.phone = validation.phone(form.phone);
    setFieldErrors(errors);
    if (Object.values(errors).some((e) => e !== null)) return;

    setSaving(true);
    clearError();
    try {
      await updateProfile({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
      });
      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      // error set in context
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) setForm({ name: user.name, email: user.email, phone: user.phone || "" });
    setFieldErrors({});
    clearError();
    setEditing(false);
  };

  if (!user) return null;

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-foreground" style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px" }}>
          Personal Information
        </h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-[#c8a882] hover:text-[#b8986a] transition-colors"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", letterSpacing: "0.06em" }}
          >
            <Edit3 size={14} strokeWidth={1.5} />
            EDIT
          </button>
        )}
      </div>

      {/* Success message */}
      {success && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800">
          <Check size={16} strokeWidth={1.5} />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>Profile updated successfully!</span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800">
          <AlertCircle size={16} strokeWidth={1.5} />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>{error}</span>
        </div>
      )}

      {/* Profile avatar */}
      <div className="flex items-center gap-6 mb-6">
        <div className="w-16 h-16 rounded-full bg-[#c8a882] flex items-center justify-center">
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", color: "#fff" }}>
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="text-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", fontWeight: 600 }}>
            {user.name}
          </p>
          <p className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>
            Member since {memberSince}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-muted-foreground mb-1" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", letterSpacing: "0.08em" }}>
            FULL NAME
          </label>
          {editing ? (
            <>
              <input
                type="text"
                value={form.name}
                onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); setFieldErrors((p) => ({ ...p, name: null })); }}
                className={`w-full bg-secondary border ${fieldErrors.name ? "border-[#c0392b]" : "border-border"} px-4 py-3 text-foreground outline-none focus:border-[#c8a882] transition-colors`}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}
              />
              {fieldErrors.name && <p className="mt-1 text-[#c0392b]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>{fieldErrors.name}</p>}
            </>
          ) : (
            <p className="text-foreground mt-0.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>{user.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-muted-foreground mb-1" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", letterSpacing: "0.08em" }}>
            EMAIL
          </label>
          {editing ? (
            <>
              <input
                type="email"
                value={form.email}
                onChange={(e) => { setForm((f) => ({ ...f, email: e.target.value })); setFieldErrors((p) => ({ ...p, email: null })); }}
                className={`w-full bg-secondary border ${fieldErrors.email ? "border-[#c0392b]" : "border-border"} px-4 py-3 text-foreground outline-none focus:border-[#c8a882] transition-colors`}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}
              />
              {fieldErrors.email && <p className="mt-1 text-[#c0392b]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>{fieldErrors.email}</p>}
            </>
          ) : (
            <p className="text-foreground mt-0.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>{user.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-muted-foreground mb-1" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", letterSpacing: "0.08em" }}>
            PHONE (OPTIONAL)
          </label>
          {editing ? (
            <>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => { setForm((f) => ({ ...f, phone: e.target.value })); setFieldErrors((p) => ({ ...p, phone: null })); }}
                placeholder="+1 (555) 123-4567"
                className={`w-full bg-secondary border ${fieldErrors.phone ? "border-[#c0392b]" : "border-border"} px-4 py-3 text-foreground outline-none focus:border-[#c8a882] transition-colors`}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}
              />
              {fieldErrors.phone && <p className="mt-1 text-[#c0392b]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>{fieldErrors.phone}</p>}
            </>
          ) : (
            <p className="text-foreground mt-0.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>{user.phone || "—"}</p>
          )}
        </div>

        {/* Bonus points */}
        <div>
          <label className="block text-muted-foreground mb-1" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", letterSpacing: "0.08em" }}>
            BONUS POINTS
          </label>
          <div className="flex items-center gap-2 mt-0.5">
            <Trophy size={16} className="text-[#c8a882]" strokeWidth={1.5} />
            <p className="text-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600 }}>
              {user.bonusPoints.toLocaleString()} pts
            </p>
          </div>
        </div>

        {/* Edit buttons */}
        {editing && (
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-foreground text-background px-6 py-3 hover:opacity-80 transition-opacity disabled:opacity-50"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", letterSpacing: "0.1em", fontWeight: 600 }}
            >
              <Save size={15} strokeWidth={1.5} />
              {saving ? "SAVING..." : "SAVE CHANGES"}
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 border border-border px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", letterSpacing: "0.1em", fontWeight: 600 }}
            >
              <X size={15} strokeWidth={1.5} />
              CANCEL
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Section: Orders ────────────────────────────────────────────────────────

function OrdersSection() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(authService.getOrders());
  }, []);

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package size={48} className="mx-auto text-muted-foreground/50 mb-4" strokeWidth={1.2} />
        <p className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-foreground mb-6" style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px" }}>
        Order History
      </h2>
      {orders.map((order) => (
        <div key={order.id} className="border border-border bg-card">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-secondary/50 border-b border-border">
            <div>
              <p className="text-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600 }}>
                Order #{order.id}
              </p>
              <p className="text-muted-foreground mt-0.5 flex items-center gap-1">
                <Calendar size={12} strokeWidth={1.5} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>
                  {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={order.status} />
              <p className="text-foreground" style={{ fontFamily: "'Inter', sans-serif', font-size: '15px", fontWeight: 600 }}>
                ${order.total}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="p-4 space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-14 h-14 bg-secondary flex-shrink-0 overflow-hidden">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground truncate" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>{item.name}</p>
                  <p className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>
                    {item.size && <>Size: {item.size}</>}
                    {item.size && item.color && <> · </>}
                    {item.color && <>Color: {item.color}</>}
                    {item.quantity > 1 && <> · Qty: {item.quantity}</>}
                  </p>
                </div>
                <p className="text-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>${item.price}</p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4 p-4 pt-0 text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin size={12} strokeWidth={1.5} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>{order.shippingAddress}</span>
            </span>
            <span className="flex items-center gap-1">
              <CreditCard size={12} strokeWidth={1.5} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>{order.paymentMethod}</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Section: Wishlist ──────────────────────────────────────────────────────

function WishlistSection({ onNavigateToCatalog }: { onNavigateToCatalog: () => void }) {
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);

  useEffect(() => {
    setWishlistIds(authService.getWishlist());
  }, []);

  if (wishlistIds.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart size={48} className="mx-auto text-muted-foreground/50 mb-4" strokeWidth={1.2} />
        <p className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>Your wishlist is empty.</p>
        <button
          onClick={onNavigateToCatalog}
          className="mt-4 bg-foreground text-background px-6 py-3 hover:opacity-80 transition-opacity"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", letterSpacing: "0.1em", fontWeight: 600 }}
        >
          BROWSE PRODUCTS
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-foreground mb-6" style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px" }}>
        My Wishlist ({wishlistIds.length})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {wishlistIds.map((id) => (
          <div key={id} className="border border-border bg-card p-4 flex items-center gap-4">
            <div className="w-16 h-16 bg-secondary flex-shrink-0 overflow-hidden">
              <img src={`/api/placeholder/${id}`} alt={`Product ${id}`} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-foreground truncate" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>Product #{id}</p>
            </div>
            <button
              onClick={() => {
                const updated = wishlistIds.filter((x) => x !== id);
                setWishlistIds(updated);
                authService.saveWishlist(updated);
              }}
              className="text-muted-foreground hover:text-[#c0392b] transition-colors"
            >
              <Trash2 size={16} strokeWidth={1.5} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section: Bonuses & Promo Codes ─────────────────────────────────────────

function BonusesSection() {
  const { user } = useAuth();
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setPromos(authService.getPromoCodes());
  }, []);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activePromos = promos.filter((p) => !p.isUsed);
  const usedPromos = promos.filter((p) => p.isUsed);

  return (
    <div>
      <h2 className="text-foreground mb-6" style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px" }}>
        Bonuses & Promo Codes
      </h2>

      {/* Bonus Points Card */}
      <div className="bg-gradient-to-br from-[#c8a882] to-[#b8986a] p-6 mb-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Trophy size={28} strokeWidth={1.5} />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", letterSpacing: "0.08em", opacity: 0.9 }}>
            YOUR BONUS BALANCE
          </span>
        </div>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "36px", fontWeight: 600 }}>
          {user?.bonusPoints.toLocaleString() ?? 0}
          <span style={{ fontSize: "16px", opacity: 0.8, marginLeft: "8px" }}>points</span>
        </p>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", opacity: 0.8, marginTop: "4px" }}>
          Earn points with every purchase and redeem them for exclusive discounts.
        </p>
      </div>

      {/* Active Promo Codes */}
      <h3 className="text-foreground mb-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", letterSpacing: "0.06em" }}>
        ACTIVE PROMO CODES
      </h3>
      {activePromos.length === 0 && (
        <div className="flex items-center gap-3 p-4 bg-secondary/50 border border-border mb-4">
          <Gift size={18} className="text-muted-foreground" strokeWidth={1.5} />
          <p className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>No active promo codes available.</p>
        </div>
      )}
      <div className="space-y-3 mb-6">
        {activePromos.map((promo) => (
          <div key={promo.id} className="border border-border bg-card p-4 flex items-center justify-between">
            <div>
              <p className="text-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", fontWeight: 600, letterSpacing: "0.05em" }}>
                {promo.code}
              </p>
              <p className="text-muted-foreground mt-0.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>
                {promo.description}
              </p>
              <p className="text-muted-foreground mt-0.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>
                <Clock size={11} className="inline mr-1" strokeWidth={1.5} />
                Expires {new Date(promo.expiresAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
              </p>
            </div>
            <button
              onClick={() => handleCopy(promo.code, promo.id)}
              className="flex items-center gap-1.5 bg-secondary px-4 py-2 text-foreground hover:bg-[#c8a882]/10 transition-colors"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", letterSpacing: "0.06em" }}
            >
              {copiedId === promo.id ? (
                <><Check size={14} strokeWidth={1.5} className="text-green-600" /> COPIED</>
              ) : (
                <><Copy size={14} strokeWidth={1.5} /> COPY</>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Used Promo Codes */}
      {usedPromos.length > 0 && (
        <div>
          <h3 className="text-muted-foreground mb-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", letterSpacing: "0.06em" }}>
            USED CODES
          </h3>
          <div className="space-y-2">
            {usedPromos.map((promo) => (
              <div key={promo.id} className="border border-border bg-card p-3 flex items-center justify-between opacity-60">
                <div>
                  <p className="text-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, letterSpacing: "0.05em", textDecoration: "line-through" }}>
                    {promo.code}
                  </p>
                  <p className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>{promo.description}</p>
                </div>
                <Check size={16} className="text-green-600" strokeWidth={2} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Section: Reviews ───────────────────────────────────────────────────────

function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ productId: 1, productName: "Wool Cashmere Coat", productImg: "prod1.jpg", rating: 5, text: "" });

  useEffect(() => {
    setReviews(authService.getReviews());
  }, []);

  const handleSubmitReview = () => {
    if (!newReview.text.trim()) return;
    const created = authService.addReview(
      newReview.productId,
      newReview.productName,
      newReview.productImg,
      newReview.rating,
      newReview.text.trim()
    );
    setReviews((prev) => [created, ...prev]);
    setShowForm(false);
    setNewReview({ productId: 1, productName: "Wool Cashmere Coat", productImg: "prod1.jpg", rating: 5, text: "" });
  };

  const renderStars = (rating: number, interactive = false, onChange?: (r: number) => void) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={() => interactive && onChange?.(star)}
            className={`${interactive ? "cursor-pointer" : "cursor-default"} ${
              star <= rating ? "text-[#c8a882]" : "text-border"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-foreground" style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px" }}>
          My Reviews
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 text-[#c8a882] hover:text-[#b8986a] transition-colors"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", letterSpacing: "0.06em" }}
        >
          <Plus size={14} strokeWidth={1.5} />
          {showForm ? "CANCEL" : "WRITE REVIEW"}
        </button>
      </div>

      {/* New Review Form */}
      {showForm && (
        <div className="border border-border bg-secondary/30 p-4 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-secondary overflow-hidden flex-shrink-0">
              <img src={newReview.productImg} alt={newReview.productName} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600 }}>
                {newReview.productName}
              </p>
              <div className="mt-1">
                {renderStars(newReview.rating, true, (r) => setNewReview((f) => ({ ...f, rating: r })))}
              </div>
            </div>
          </div>
          <textarea
            value={newReview.text}
            onChange={(e) => setNewReview((f) => ({ ...f, text: e.target.value }))}
            placeholder="Share your thoughts about this product..."
            rows={3}
            className="w-full bg-card border border-border px-4 py-3 text-foreground outline-none focus:border-[#c8a882] transition-colors resize-none"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={handleSubmitReview}
              disabled={!newReview.text.trim()}
              className="bg-foreground text-background px-6 py-2.5 hover:opacity-80 transition-opacity disabled:opacity-50"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", letterSpacing: "0.1em", fontWeight: 600 }}
            >
              SUBMIT REVIEW
            </button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <Star size={48} className="mx-auto text-muted-foreground/50 mb-4" strokeWidth={1.2} />
          <p className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>You haven't written any reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border border-border bg-card p-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-secondary overflow-hidden flex-shrink-0">
                  <img src={review.productImg} alt={review.productName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600 }}>
                      {review.productName}
                    </p>
                    <span className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>
                      {new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <div className="mt-1">{renderStars(review.rating)}</div>
                  <p className="text-foreground mt-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", lineHeight: 1.6 }}>
                    {review.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard Component ────────────────────────────────────────────────

interface UserDashboardProps {
  open: boolean;
  onClose: () => void;
  onNavigateToCatalog: () => void;
  wishlist?: number[];
  onRemoveWishlistItem?: (id: number) => void;
  onAddWishlistToCart?: (productId: number, productName: string) => void;
}

type DashboardTab = "profile" | "orders" | "wishlist" | "bonuses" | "reviews";

const TABS: { key: DashboardTab; label: string; icon: any }[] = [
  { key: "profile", label: "My Profile", icon: User },
  { key: "orders", label: "Order History", icon: Package },
  { key: "wishlist", label: "Wishlist", icon: Heart },
  { key: "bonuses", label: "Bonuses & Promos", icon: Gift },
  { key: "reviews", label: "My Reviews", icon: Star },
];

export function UserDashboard({ open, onClose, onNavigateToCatalog }: UserDashboardProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>("profile");

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!open || !isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)]" onClick={onClose} />
      <div
        className="relative bg-card w-full max-w-[900px] h-[90vh] z-10 flex overflow-hidden"
        style={{ maxHeight: "700px" }}
      >
        {/* Sidebar */}
        <div className="w-[220px] bg-secondary/30 border-r border-border flex flex-col flex-shrink-0">
          {/* User info */}
          <div className="p-4 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-[#c8a882] flex items-center justify-center mb-2">
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", color: "#fff" }}>
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <p className="text-foreground truncate" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600 }}>
              {user.name}
            </p>
            <p className="text-muted-foreground truncate" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>
              {user.bonusPoints.toLocaleString()} pts
            </p>
          </div>

          {/* Nav */}
          <div className="flex-1 overflow-y-auto py-2">
            {TABS.map((tab) => (
              <TabButton
                key={tab.key}
                label={tab.label}
                icon={tab.icon}
                active={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
              />
            ))}
          </div>

          {/* Logout */}
          <div className="p-2 border-t border-border">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-muted-foreground hover:text-[#c0392b] hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", letterSpacing: "0.04em" }}
            >
              <LogOut size={17} strokeWidth={1.5} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
          >
            <X size={18} strokeWidth={1.5} />
          </button>

          {activeTab === "profile" && <ProfileSection />}
          {activeTab === "orders" && <OrdersSection />}
          {activeTab === "wishlist" && <WishlistSection onNavigateToCatalog={onNavigateToCatalog} />}
          {activeTab === "bonuses" && <BonusesSection />}
          {activeTab === "reviews" && <ReviewsSection />}
        </div>
      </div>
    </div>
  );
}
