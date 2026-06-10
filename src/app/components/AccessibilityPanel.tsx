import { useState } from "react";
import { Accessibility, Sun, Moon, Type, Contrast, X } from "lucide-react";

export interface A11ySettings {
  theme: "light" | "dark";
  fontSize: "normal" | "large" | "xlarge";
  highContrast: boolean;
  dyslexicFont: boolean;
}

interface AccessibilityPanelProps {
  settings: A11ySettings;
  onChange: (s: A11ySettings) => void;
}

export function AccessibilityPanel({ settings, onChange }: AccessibilityPanelProps) {
  const [open, setOpen] = useState(false);

  const set = <K extends keyof A11ySettings>(k: K, v: A11ySettings[K]) =>
    onChange({ ...settings, [k]: v });

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-40 w-12 h-12 bg-foreground text-background flex items-center justify-center shadow-lg hover:opacity-80 transition-opacity"
        aria-label="Accessibility settings"
        title="Accessibility settings"
      >
        <Accessibility size={20} strokeWidth={1.5} />
      </button>

      {/* Panel */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="fixed bottom-20 left-6 z-50 bg-card border border-border shadow-xl w-72 p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Accessibility size={16} className="text-[#c8a882]" />
                <span className="text-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, letterSpacing: "0.05em" }}>
                  Accessibility
                </span>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Theme */}
            <div className="mb-5">
              <p className="text-muted-foreground mb-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", letterSpacing: "0.1em", fontWeight: 600 }}>
                THEME
              </p>
              <div className="flex gap-2">
                {(["light", "dark"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => set("theme", t)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 border transition-colors ${settings.theme === t ? "bg-foreground text-background border-foreground" : "border-border text-foreground hover:border-foreground"}`}
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}
                  >
                    {t === "light" ? <Sun size={13} /> : <Moon size={13} />}
                    {t === "light" ? "Light" : "Dark"}
                  </button>
                ))}
              </div>
            </div>

            {/* Font size */}
            <div className="mb-5">
              <p className="text-muted-foreground mb-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", letterSpacing: "0.1em", fontWeight: 600 }}>
                TEXT SIZE
              </p>
              <div className="flex gap-2">
                {(["normal", "large", "xlarge"] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => set("fontSize", size)}
                    className={`flex-1 py-2.5 border transition-colors ${settings.fontSize === size ? "bg-foreground text-background border-foreground" : "border-border text-foreground hover:border-foreground"}`}
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: size === "normal" ? "11px" : size === "large" ? "13px" : "15px" }}
                  >
                    A
                  </button>
                ))}
              </div>
              <p className="text-muted-foreground mt-1.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px" }}>
                Normal · Large · Extra Large
              </p>
            </div>

            {/* Toggles */}
            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <Contrast size={14} className="text-muted-foreground" />
                  <span className="text-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>High Contrast</span>
                </div>
                <button
                  onClick={() => set("highContrast", !settings.highContrast)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${settings.highContrast ? "bg-[#c8a882]" : "bg-muted"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${settings.highContrast ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <Type size={14} className="text-muted-foreground" />
                  <span className="text-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>Dyslexic Font</span>
                </div>
                <button
                  onClick={() => set("dyslexicFont", !settings.dyslexicFont)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${settings.dyslexicFont ? "bg-[#c8a882]" : "bg-muted"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${settings.dyslexicFont ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </label>
            </div>

            <p className="text-muted-foreground mt-5 pt-4 border-t border-border" style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", lineHeight: 1.6 }}>
              Visually impaired mode: increase text size and enable high contrast for better readability.
            </p>
          </div>
        </>
      )}
    </>
  );
}
