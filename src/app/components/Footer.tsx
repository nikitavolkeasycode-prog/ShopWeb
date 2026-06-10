import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";

const footerLinks = {
  "Shop": ["New Arrivals", "Women", "Men", "Kids", "Accessories", "Sale"],
  "Help": ["FAQs", "Shipping & Returns", "Size Guide", "Track Order", "Contact Us"],
  "Company": ["About Us", "Sustainability", "Careers", "Press", "Affiliates"],
};

export function Footer() {
  return (
    <footer className="bg-[#1a1714] text-[#faf9f7]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-16 pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <span
              className="block mb-5"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 600, letterSpacing: "0.04em" }}
            >
              VOILÀ
            </span>
            <p
              className="text-[rgba(250,249,247,0.55)] leading-relaxed mb-6 max-w-[280px]"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 300 }}
            >
              Curated fashion for the modern wardrobe. Quality, sustainability, and effortless style.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 border border-[rgba(250,249,247,0.2)] flex items-center justify-center hover:border-[#c8a882] hover:text-[#c8a882] transition-colors"
                >
                  <Icon size={14} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4
                className="mb-5 text-[rgba(250,249,247,0.5)] tracking-[0.15em]"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 600 }}
              >
                {section.toUpperCase()}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[rgba(250,249,247,0.7)] hover:text-[#faf9f7] transition-colors"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 300 }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[rgba(250,249,247,0.08)] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p
            className="text-[rgba(250,249,247,0.35)]"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}
          >
            © 2026 Voilà. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Use", "Cookie Settings"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-[rgba(250,249,247,0.35)] hover:text-[rgba(250,249,247,0.7)] transition-colors"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
