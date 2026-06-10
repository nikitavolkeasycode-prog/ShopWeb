import { X, ShoppingBag, Trash2, ArrowRight } from "lucide-react";

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
}

export function CartDrawer({ open, onClose, items, onRemove }: CartDrawerProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-[rgba(26,23,20,0.4)] z-40 transition-opacity"
          onClick={onClose}
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
              Your Bag ({items.length})
            </span>
          </div>
          <button onClick={onClose} className="hover:opacity-60 transition-opacity">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
          {items.length === 0 ? (
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
                      Qty: {item.qty}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 500, color: "#1a1714" }}>
                      ${item.price * item.qty}
                    </span>
                    <button onClick={() => onRemove(item.id)} className="text-[#7a7470] hover:text-[#c0392b] transition-colors">
                      <Trash2 size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-6 border-t border-[rgba(26,23,20,0.08)]">
            <div className="flex justify-between mb-5">
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#7a7470" }}>
                Subtotal
              </span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", color: "#1a1714" }}>
                ${total}
              </span>
            </div>
            <button
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
