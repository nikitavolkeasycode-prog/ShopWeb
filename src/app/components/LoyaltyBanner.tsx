import { useState } from "react";
import { Gift, Copy, Check, Star, Trophy, Zap } from "lucide-react";

const promoCodes = [
  { code: "STYLE25", discount: "25% off", min: "$150", expires: "Jun 30" },
  { code: "NEWUSER", discount: "15% off", min: "first order", expires: "No expiry" },
  { code: "SUMMER40", discount: "40% off", min: "sale items", expires: "Jun 20" },
];

export function LoyaltyBanner() {
  const [copied, setCopied] = useState<string | null>(null);
  const [points] = useState(1240);
  const nextTier = 2000;

  const copy = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className="py-16 px-6 lg:px-12 bg-[#1a1714]">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Loyalty Points */}
          <div className="bg-[#2d2926] p-7">
            <div className="flex items-center gap-3 mb-5">
              <Trophy size={18} className="text-[#c8a882]" />
              <h3 className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 400 }}>
                Your Rewards
              </h3>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-[#c8a882]" style={{ fontFamily: "'Playfair Display', serif", fontSize: "42px", fontWeight: 500 }}>
                {points.toLocaleString()}
              </span>
              <span className="text-[rgba(250,249,247,0.5)]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>points</span>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "rgba(250,249,247,0.6)" }}>Gold Member</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "rgba(250,249,247,0.6)" }}>Platinum: {nextTier} pts</span>
              </div>
              <div className="w-full h-1.5 bg-[rgba(255,255,255,0.1)] rounded-full">
                <div
                  className="h-full bg-[#c8a882] rounded-full transition-all"
                  style={{ width: `${(points / nextTier) * 100}%` }}
                />
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "rgba(250,249,247,0.5)", marginTop: "6px" }}>
                {nextTier - points} points until Platinum
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { icon: <Star size={14} />, label: "Earn 1pt per $1" },
                { icon: <Gift size={14} />, label: "Birthday gift" },
                { icon: <Zap size={14} />, label: "Early access" },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-2 text-center">
                  <div className="w-9 h-9 bg-[rgba(200,168,130,0.15)] flex items-center justify-center text-[#c8a882]">
                    {b.icon}
                  </div>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: "rgba(250,249,247,0.6)", lineHeight: 1.4 }}>
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Promo codes */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Gift size={18} className="text-[#c8a882]" />
              <h3 className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 400 }}>
                Active Promo Codes
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              {promoCodes.map((p) => (
                <div key={p.code} className="flex items-center justify-between bg-[#2d2926] px-5 py-4 border border-[rgba(200,168,130,0.2)]">
                  <div>
                    <p className="text-[#c8a882]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", fontWeight: 700, letterSpacing: "0.06em" }}>
                      {p.code}
                    </p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "rgba(250,249,247,0.6)", marginTop: "2px" }}>
                      {p.discount} · min. {p.min} · Expires {p.expires}
                    </p>
                  </div>
                  <button
                    onClick={() => copy(p.code)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-[#c8a882] text-[#c8a882] hover:bg-[#c8a882] hover:text-[#1a1714] transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", letterSpacing: "0.06em", fontWeight: 600 }}
                  >
                    {copied === p.code ? <Check size={12} /> : <Copy size={12} />}
                    {copied === p.code ? "COPIED" : "COPY"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
