import { useState, useEffect } from "react";// Модальное окно авторизации: вход, регистрация, восстановление пароля.
import { X, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { validation } from "../../services/auth.service";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { login, register, error, clearError } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    newsletter: false,
    terms: false,
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});

  const set = (k: string, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validateField = (field: string, value: string | boolean) => {
    let err: string | null = null;
    switch (field) {
      case "email":
        err = validation.email(value as string);
        break;
      case "password":
        err = validation.password(value as string);
        break;
      case "name":
        if (mode === "register") err = validation.name(value as string);
        break;
      case "confirm":
        if (mode === "register")
          err = validation.confirmPassword(form.password, value as string);
        break;
    }
    return err;
  };

  const handleBlur = (field: string) => {
    const value = form[field as keyof typeof form];
    const err = validateField(field, value);
    setFieldErrors((prev) => ({ ...prev, [field]: err }));
  };

  useEffect(() => {
    if (open) {
      clearError();
      setForm({ name: "", email: "", password: "", confirm: "", newsletter: false, terms: false });
      setFieldErrors({});
      setSubmitted(false);
      setShowPass(false);
      setShowConfirm(false);
      setMode("login");
    }
  }, [open, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const errors: Record<string, string | null> = {};
    errors.email = validation.email(form.email);
    errors.password = validation.password(form.password);
    if (mode === "register") {
      errors.name = validation.name(form.name);
      errors.confirm = validation.confirmPassword(form.password, form.confirm);
    }
    setFieldErrors(errors);

    if (Object.values(errors).some((e) => e !== null)) return;

    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await register({
          name: form.name,
          email: form.email,
          password: form.password,
          newsletter: form.newsletter,
        });
      }
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch {
      // Error is set in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (newMode: "login" | "register") => {
    setMode(newMode);
    clearError();
    setFieldErrors({});
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)]" onClick={onClose} />
      <div className="relative bg-card w-full max-w-[440px] p-8 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        {/* Logo */}
        <div className="text-center mb-7">
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "22px",
              fontWeight: 600,
              color: "var(--foreground)",
              letterSpacing: "0.04em",
            }}
          >
            VOILÀ
          </span>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-7">
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`flex-1 pb-3 capitalize transition-colors ${
                mode === m
                  ? "text-foreground border-b-2 border-foreground -mb-px"
                  : "text-muted-foreground"
              }`}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                letterSpacing: "0.06em",
              }}
            >
              {m === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="w-12 h-12 rounded-full bg-[#c8a882] flex items-center justify-center">
              <Check size={20} className="text-white" />
            </div>
            <p
              className="text-foreground"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px" }}
            >
              {mode === "login" ? "Welcome back!" : "Account created!"}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {/* Global error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-[#fef2f2] dark:bg-[#3b1010] text-[#c0392b] border border-[#c0392b]/20">
                <AlertCircle size={16} strokeWidth={1.5} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>
                  {error}
                </span>
              </div>
            )}

            {mode === "register" && (
              <div>
                <label
                  className="block text-muted-foreground mb-1.5"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "11px",
                    letterSpacing: "0.08em",
                  }}
                >
                  FULL NAME
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => {
                    set("name", e.target.value);
                    setFieldErrors((p) => ({ ...p, name: null }));
                  }}
                  onBlur={() => handleBlur("name")}
                  placeholder="Sophie Martin"
                  required
                  className={`w-full bg-secondary border ${
                    fieldErrors.name ? "border-[#c0392b]" : "border-border"
                  } px-4 py-3 text-foreground placeholder-muted-foreground outline-none focus:border-[#c8a882] transition-colors`}
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}
                />
                {fieldErrors.name && (
                  <p
                    className="mt-1 text-[#c0392b]"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}
                  >
                    {fieldErrors.name}
                  </p>
                )}
              </div>
            )}

            <div>
              <label
                className="block text-muted-foreground mb-1.5"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "11px",
                  letterSpacing: "0.08em",
                }}
              >
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => {
                  set("email", e.target.value);
                  setFieldErrors((p) => ({ ...p, email: null }));
                }}
                onBlur={() => handleBlur("email")}
                placeholder="sophie@example.com"
                required
                className={`w-full bg-secondary border ${
                  fieldErrors.email ? "border-[#c0392b]" : "border-border"
                } px-4 py-3 text-foreground placeholder-muted-foreground outline-none focus:border-[#c8a882] transition-colors`}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}
              />
              {fieldErrors.email && (
                <p
                  className="mt-1 text-[#c0392b]"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}
                >
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="text-muted-foreground"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "11px",
                    letterSpacing: "0.08em",
                  }}
                >
                  PASSWORD
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "11px",
                      borderBottom: "1px solid currentColor",
                    }}
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => {
                    set("password", e.target.value);
                    setFieldErrors((p) => ({ ...p, password: null }));
                  }}
                  onBlur={() => handleBlur("password")}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className={`w-full bg-secondary border ${
                    fieldErrors.password ? "border-[#c0392b]" : "border-border"
                  } px-4 py-3 pr-12 text-foreground placeholder-muted-foreground outline-none focus:border-[#c8a882] transition-colors`}
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? (
                    <EyeOff size={16} strokeWidth={1.5} />
                  ) : (
                    <Eye size={16} strokeWidth={1.5} />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p
                  className="mt-1 text-[#c0392b]"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}
                >
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {mode === "register" && (
              <>
                <div>
                  <label
                    className="block text-muted-foreground mb-1.5"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "11px",
                      letterSpacing: "0.08em",
                    }}
                  >
                    CONFIRM PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={form.confirm}
                      onChange={(e) => {
                        set("confirm", e.target.value);
                        setFieldErrors((p) => ({ ...p, confirm: null }));
                      }}
                      onBlur={() => handleBlur("confirm")}
                      placeholder="••••••••"
                      required
                      className={`w-full bg-secondary border ${
                        fieldErrors.confirm ? "border-[#c0392b]" : "border-border"
                      } px-4 py-3 pr-12 text-foreground placeholder-muted-foreground outline-none focus:border-[#c8a882] transition-colors`}
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirm ? (
                        <EyeOff size={16} strokeWidth={1.5} />
                      ) : (
                        <Eye size={16} strokeWidth={1.5} />
                      )}
                    </button>
                  </div>
                  {fieldErrors.confirm && (
                    <p
                      className="mt-1 text-[#c0392b]"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}
                    >
                      {fieldErrors.confirm}
                    </p>
                  )}
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.newsletter}
                    onChange={(e) => set("newsletter", e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-[#c8a882]"
                  />
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "12px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    Subscribe to our newsletter for exclusive offers
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.terms}
                    onChange={(e) => set("terms", e.target.checked)}
                    required
                    className="mt-0.5 w-4 h-4 accent-[#c8a882]"
                  />
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "12px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    I agree to the{" "}
                    <span className="text-foreground underline">Terms of Service</span> and{" "}
                    <span className="text-foreground underline">Privacy Policy</span>
                  </span>
                </label>
              </>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-foreground text-background py-4 hover:opacity-80 transition-opacity mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "12px",
                letterSpacing: "0.1em",
                fontWeight: 600,
              }}
            >
              {isSubmitting
                ? "PLEASE WAIT..."
                : mode === "login"
                ? "SIGN IN"
                : "CREATE ACCOUNT"}
            </button>

            {/* Social */}
            <div className="relative text-center my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <span
                className="relative bg-card px-4 text-muted-foreground"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}
              >
                or continue with
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {["Google", "Apple"].map((provider) => (
                <button
                  key={provider}
                  type="button"
                  className="border border-border py-2.5 text-foreground hover:bg-secondary transition-colors"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "12px",
                    fontWeight: 500,
                  }}
                >
                  {provider}
                </button>
              ))}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}