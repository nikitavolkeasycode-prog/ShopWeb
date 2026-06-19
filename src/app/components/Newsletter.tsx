// Компонент подписки на новостную рассылку// Секция подписки на рассылку: сбор email, кнопка подписки.
// Содержит поле email с валидацией

import { useState } from "react";
import { ArrowRight, Check, AlertCircle } from "lucide-react";
import { validation } from "../../services/auth.service";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация email
    const err = validation.email(email);
    if (err) {
      setError(err);
      return;
    }

    setError(null);
    setSubmitted(true);
  };

  return (
    <section className="bg-[#f0ede8] py-20 px-6 lg:px-12">
      <div className="max-w-[700px] mx-auto text-center">
        <p
          className="text-[#c8a882] mb-3 tracking-[0.2em]"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 500 }}
        >
          ПОДПИСКА
        </p>
        <h2
          className="text-[#1a1714] mb-4 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 400 }}
        >
          Style delivered to
          <br />
          your inbox
        </h2>
        <p
          className="text-[#7a7470] mb-10 leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 300 }}
        >
          Подпишитесь на ранний доступ к новым коллекциям, эксклюзивным предложениям и вдохновению. Без спама.
        </p>

        {submitted ? (
          <div className="flex items-center justify-center gap-3 text-[#1a1714]">
            <Check size={18} className="text-[#c8a882]" />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>
              Вы в списке! Проверьте почту для приветственного подарка.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-0 max-w-[480px] mx-auto flex-col" noValidate>
            <div className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Your email address"
                required
                className={`flex-1 bg-white border ${error ? "border-[#c0392b]" : "border-[rgba(26,23,20,0.12)]"} px-5 py-4 outline-none focus:border-[#c8a882] transition-colors`}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#1a1714" }}
              />
              <button
                type="submit"
                className="bg-[#1a1714] text-white px-6 py-4 hover:bg-[#2d2926] transition-colors flex items-center gap-2 flex-shrink-0"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", letterSpacing: "0.1em", fontWeight: 600 }}
              >
                ПОДПИСАТЬСЯ
                <ArrowRight size={13} />
              </button>
            </div>
            {error && (
              <p className="mt-1.5 text-[#c0392b] text-left" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>
                <AlertCircle size={12} className="inline mr-1" />
                {error}
              </p>
            )}
          </form>
        )}

        <p
          className="mt-4 text-[#7a7470]"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}
        >
          Подписываясь, вы соглашаетесь с Политикой конфиденциальности. Отписка в любое время.
        </p>
      </div>
    </section>
  );
}