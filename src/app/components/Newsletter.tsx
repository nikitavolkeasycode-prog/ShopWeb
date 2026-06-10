import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="bg-[#f0ede8] py-20 px-6 lg:px-12">
      <div className="max-w-[700px] mx-auto text-center">
        <p
          className="text-[#c8a882] mb-3 tracking-[0.2em]"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 500 }}
        >
          STAY IN THE LOOP
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
          Subscribe for early access to new collections, exclusive offers, and style inspiration. No spam — ever.
        </p>

        {submitted ? (
          <div className="flex items-center justify-center gap-3 text-[#1a1714]">
            <Check size={18} className="text-[#c8a882]" />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>
              You're on the list! Check your inbox for a welcome gift.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-0 max-w-[480px] mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 bg-white border border-[rgba(26,23,20,0.12)] px-5 py-4 outline-none focus:border-[#c8a882] transition-colors"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#1a1714" }}
            />
            <button
              type="submit"
              className="bg-[#1a1714] text-white px-6 py-4 hover:bg-[#2d2926] transition-colors flex items-center gap-2 flex-shrink-0"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", letterSpacing: "0.1em", fontWeight: 600 }}
            >
              JOIN
              <ArrowRight size={13} />
            </button>
          </form>
        )}

        <p
          className="mt-4 text-[#7a7470]"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}
        >
          By subscribing, you agree to our Privacy Policy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
