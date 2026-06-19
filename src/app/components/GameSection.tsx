import { useState, useCallback } from "react";
// Игровая секция: мини-игра для получения промокодов (код Rewards).
import { Trophy, Gift, RefreshCw, Sparkles, Star, Zap } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface GameSectionProps {
  onEarnPromo: (code: string, discount: number, description: string) => void;
}

type GameState = "idle" | "spinning" | "win";

const PRIZES = [
  { label: "10% OFF", discount: 10, emoji: "🎉" },
  { label: "15% OFF", discount: 15, emoji: "🎊" },
  { label: "20% OFF", discount: 20, emoji: "🏆" },
  { label: "25% OFF", discount: 25, emoji: "👑" },
  { label: "50 BONUS PTS", discount: 0, bonus: 50, emoji: "⭐" },
  { label: "100 BONUS PTS", discount: 0, bonus: 100, emoji: "🌟" },
  { label: "FREE SHIPPING", discount: 0, freeShipping: true, emoji: "🚚" },
  { label: "TRY AGAIN", discount: 0, emoji: "🔄" },
];

export function GameSection({ onEarnPromo }: GameSectionProps) {
  const { user } = useAuth();
  const [state, setState] = useState<GameState>("idle");
  const [spinAngle, setSpinAngle] = useState(0);
  const [result, setResult] = useState<{ label: string; discount: number; bonus?: number; freeShipping?: boolean; emoji: string } | null>(null);
  const [gamesLeft, setGamesLeft] = useState(3);

  const spin = useCallback(() => {
    if (state === "spinning" || gamesLeft <= 0) return;

    setState("spinning");
    setResult(null);

    // Random prize (weighted)
    const rand = Math.random();
    let prizeIndex: number;
    if (rand < 0.15) prizeIndex = 0;  // 10%
    else if (rand < 0.28) prizeIndex = 1; // 15%
    else if (rand < 0.38) prizeIndex = 2; // 20%
    else if (rand < 0.46) prizeIndex = 3; // 25%
    else if (rand < 0.54) prizeIndex = 4; // 50 pts
    else if (rand < 0.62) prizeIndex = 5; // 100 pts
    else if (rand < 0.72) prizeIndex = 6; // free shipping
    else prizeIndex = 7; // try again

    const prize = PRIZES[prizeIndex];
    const extraSpins = 3 + Math.floor(Math.random() * 5);
    const targetAngle = spinAngle + 360 * extraSpins + prizeIndex * 45;

    setSpinAngle(targetAngle);

    setTimeout(() => {
      setState("win");
      setResult(prize);
      setGamesLeft((prev) => prev - 1);

      if (prize.discount > 0) {
        const code = `GAME${prize.discount}_${Date.now().toString(36).toUpperCase()}`;
        onEarnPromo(code, prize.discount, `${prize.discount}% off your next order!`);
      } else if (prize.bonus) {
        // Bonus points would be handled via auth service in real app
        onEarnPromo(`BONUS${prize.bonus}`, 0, `${prize.bonus} bonus points earned!`);
      } else if (prize.freeShipping) {
        const code = `FREESHIP_${Date.now().toString(36).toUpperCase()}`;
        onEarnPromo(code, 0, "Free shipping on your next order!");
      }
    }, 3000);
  }, [state, gamesLeft, spinAngle, onEarnPromo]);

  const reset = () => {
    setState("idle");
    setResult(null);
    setSpinAngle(0);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-[#c8a882]/5 to-[#c8a882]/20">
      <div className="max-w-[600px] mx-auto px-6 lg:px-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Sparkles size={20} className="text-[#c8a882]" />
          <span className="text-[#c8a882] tracking-[0.2em]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 500 }}>
            DAILY REWARDS
          </span>
          <Sparkles size={20} className="text-[#c8a882]" />
        </div>
        <h2 className="text-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,3vw,36px)", fontWeight: 400 }}>
          Spin & Win
        </h2>
        <p className="text-muted-foreground mb-8" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>
          Try your luck! Each spin can earn you bonus points or discount codes.
        </p>

        {/* Games left */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${i < gamesLeft ? "bg-[#c8a882]" : "bg-border"}`}
            />
          ))}
          <span className="text-muted-foreground ml-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>
            {gamesLeft} spins left today
          </span>
        </div>

        {/* Wheel */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          {/* Wheel */}
          <div
            className="w-full h-full rounded-full border-4 border-[#c8a882] shadow-xl transition-transform duration-[3000ms] ease-out"
            style={{
              transform: `rotate(${spinAngle}deg)`,
              background: `conic-gradient(
                #c8a882 0deg 45deg,
                #b8986a 45deg 90deg,
                #a8855a 90deg 135deg,
                #c8a882 135deg 180deg,
                #b8986a 180deg 225deg,
                #a8855a 225deg 270deg,
                #c8a882 270deg 315deg,
                #b8986a 315deg 360deg
              )`,
            }}
          >
            {/* Prize labels on wheel */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center shadow-lg z-10">
                {state === "spinning" ? (
                  <RefreshCw size={24} className="text-[#c8a882] animate-spin" strokeWidth={1.5} />
                ) : result ? (
                  <span className="text-2xl">{result.emoji}</span>
                ) : (
                  <Trophy size={24} className="text-[#c8a882]" strokeWidth={1.5} />
                )}
              </div>
            </div>
          </div>

          {/* Pointer */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
            <TriangleDown />
          </div>
        </div>

        {/* Result */}
        {result && state === "win" && (
          <div className="mb-6 p-4 bg-card border border-[#c8a882]/30">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Star size={16} className="text-[#c8a882]" />
              <span className="text-foreground font-semibold" style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px" }}>
                {result.label}!
              </span>
              <Star size={16} className="text-[#c8a882]" />
            </div>
            <p className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>
              {result.discount > 0
                ? "Promo code added to your account!"
                : result.bonus
                ? "Bonus points added to your balance!"
                : result.freeShipping
                ? "Free shipping code added to your account!"
                : "Better luck next time!"}
            </p>
          </div>
        )}

        {/* Spin button */}
        {state === "idle" && (
          <button
            onClick={spin}
            disabled={gamesLeft <= 0}
            className="flex items-center gap-2 mx-auto bg-foreground text-background px-8 py-4 hover:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", letterSpacing: "0.1em", fontWeight: 600 }}
          >
            <Zap size={16} strokeWidth={1.5} />
            {gamesLeft > 0 ? "SPIN!" : "NO SPINS LEFT"}
          </button>
        )}

        {state === "spinning" && (
          <div className="flex items-center justify-center gap-2">
            <RefreshCw size={16} className="animate-spin text-[#c8a882]" />
            <span className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>
              Spinning...
            </span>
          </div>
        )}

        {state === "win" && gamesLeft > 0 && (
          <button
            onClick={reset}
            className="flex items-center gap-2 mx-auto bg-foreground text-background px-8 py-4 hover:opacity-80 transition-opacity"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", letterSpacing: "0.1em", fontWeight: 600 }}
          >
            <RefreshCw size={16} strokeWidth={1.5} />
            SPIN AGAIN
          </button>
        )}
      </div>
    </section>
  );
}

function TriangleDown() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <polygon points="12,24 2,0 22,0" fill="#c8a882" />
    </svg>
  );
}
