import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/auth-provider";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Phone, MessageSquare, CreditCard, RefreshCw } from "lucide-react";
import { AppIcon } from "@/components/logo";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

type LoginTab = "phone" | "otp" | "abha";

// ── OTP step state ────────────────────────────────────────────────────────────
type OtpStep = "enter_phone" | "enter_otp";

const RESEND_COOLDOWN_S = 60; // seconds before resend is allowed

function LoginPage() {
  const navigate = useNavigate();
  const { login, loginAbha, sendLoginOtp, loginPhoneOtp, isAuthenticated } = useAuth();

  // ── shared state
  const [activeTab, setActiveTab] = useState<LoginTab>("phone");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ── phone + password tab
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ── OTP tab
  const [otpPhone, setOtpPhone] = useState("");
  const [otpStep, setOtpStep] = useState<OtpStep>("enter_phone");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null); // shown when no SMS provider
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── ABHA tab
  const [abhaId, setAbhaId] = useState("");
  const [abhaPassword, setAbhaPassword] = useState("");
  const [showAbhaPassword, setShowAbhaPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) navigate({ to: "/dashboard" });
  }, [isAuthenticated, navigate]);

  // Cleanup cooldown timer on unmount
  useEffect(() => () => { if (cooldownRef.current) clearInterval(cooldownRef.current); }, []);

  const clearError = () => setError("");

  function startCooldown() {
    setResendCooldown(RESEND_COOLDOWN_S);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current!);
          cooldownRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  // ── Phone + Password submit
  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsLoading(true);
    try {
      await login(phone, password);
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // ── OTP: Step 1 – send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!otpPhone || otpPhone.length !== 10) {
      setError("Enter a valid 10-digit phone number");
      return;
    }
    clearError();
    setIsLoading(true);
    try {
      const result = await sendLoginOtp(otpPhone);
      if (result.devOtp) {
        setDevOtp(result.devOtp); // dev / demo mode — no real SMS
      }
      setOtpStep("enter_otp");
      startCooldown();
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // ── OTP: Step 2 – verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError("Enter the 6-digit OTP");
      return;
    }
    clearError();
    setIsLoading(true);
    try {
      await loginPhoneOtp(otpPhone, otp);
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // ── ABHA submit
  const handleAbhaLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsLoading(true);
    try {
      await loginAbha(abhaId, abhaPassword);
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Format ABHA ID display (insert spaces every 4 digits)
  const formatAbhaDisplay = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 14);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  };

  const tabs: { id: LoginTab; label: string; icon: React.ReactNode }[] = [
    { id: "phone", label: "Password", icon: <Phone size={15} /> },
    { id: "otp", label: "OTP", icon: <MessageSquare size={15} /> },
    { id: "abha", label: "ABHA ID", icon: <CreditCard size={15} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl border border-border shadow-lg p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <AppIcon size={56} className="mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-primary mb-2">Welcome Back</h1>
            <p className="text-muted-foreground text-sm">Sign in to access your health records</p>
          </div>

          {/* Tab switcher */}
          <div className="flex p-1 bg-muted rounded-xl mb-6 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => { setActiveTab(tab.id); clearError(); setOtpStep("enter_phone"); setDevOtp(null); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-pressed={activeTab === tab.id}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Error banner */}
          {error && (
            <div
              role="alert"
              className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
            >
              {error}
            </div>
          )}

          {/* ── Tab: Phone + Password ──────────────────────────────── */}
          {activeTab === "phone" && (
            <form onSubmit={handlePhoneLogin} className="space-y-5" noValidate>
              <div>
                <label htmlFor="phone-pw" className="block text-sm font-medium text-foreground mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">+91</span>
                  <input
                    id="phone-pw"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="9876543210"
                    maxLength={10}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Phone number"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password-pw" className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password-pw"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-busy={isLoading}
              >
                {isLoading ? "Signing in…" : "Sign In"}
              </button>
            </form>
          )}

          {/* ── Tab: OTP Login ─────────────────────────────────────── */}
          {activeTab === "otp" && (
            <div>
              {otpStep === "enter_phone" ? (
                <form onSubmit={handleSendOtp} className="space-y-5" noValidate>
                  <div>
                    <label htmlFor="otp-phone" className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">+91</span>
                      <input
                        id="otp-phone"
                        type="tel"
                        value={otpPhone}
                        onChange={(e) => setOtpPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="9876543210"
                        maxLength={10}
                        required
                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label="Phone number for OTP"
                        inputMode="numeric"
                        autoFocus
                      />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      We'll send a 6-digit OTP to this number via SMS
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || otpPhone.length !== 10}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-busy={isLoading}
                  >
                    {isLoading ? "Sending OTP…" : "Send OTP"}
                  </button>
                </form>
              ) : (
                /* Step 2: Enter OTP */
                <form onSubmit={handleVerifyOtp} className="space-y-5" noValidate>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                    <Phone size={16} className="text-primary shrink-0" />
                    <span className="text-sm text-foreground">
                      OTP sent to <strong>+91 {otpPhone}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => { setOtpStep("enter_phone"); setOtp(""); setDevOtp(null); clearError(); }}
                      className="ml-auto text-xs text-primary hover:underline"
                    >
                      Change
                    </button>
                  </div>

                  {/* Dev mode hint */}
                  {devOtp && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                      <span>🛠️ <strong>Dev mode</strong> – no SMS sent. OTP:</span>
                      <code
                        className="font-mono font-bold tracking-widest cursor-pointer hover:bg-amber-100 px-1 rounded"
                        onClick={() => setOtp(devOtp)}
                        title="Click to auto-fill"
                      >
                        {devOtp}
                      </code>
                      <span className="text-xs">(click to fill)</span>
                    </div>
                  )}

                  <div>
                    <label htmlFor="otp-input" className="block text-sm font-medium text-foreground mb-2">
                      Enter OTP
                    </label>
                    <input
                      id="otp-input"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="• • • • • •"
                      maxLength={6}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl tracking-[0.5em] font-mono"
                      aria-label="6-digit OTP"
                      inputMode="numeric"
                      autoFocus
                      autoComplete="one-time-code"
                    />
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>OTP valid for 10 minutes</span>
                      <button
                        type="button"
                        onClick={() => handleSendOtp()}
                        disabled={resendCooldown > 0 || isLoading}
                        className="flex items-center gap-1 text-primary hover:underline disabled:text-muted-foreground disabled:no-underline disabled:cursor-not-allowed"
                      >
                        <RefreshCw size={12} />
                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || otp.length !== 6}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-busy={isLoading}
                  >
                    {isLoading ? "Verifying…" : "Verify & Sign In"}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ── Tab: ABHA ID ───────────────────────────────────────── */}
          {activeTab === "abha" && (
            <form onSubmit={handleAbhaLogin} className="space-y-5" noValidate>
              <div>
                <label htmlFor="abha-id" className="block text-sm font-medium text-foreground mb-2">
                  ABHA Number
                </label>
                <input
                  id="abha-id"
                  type="text"
                  value={formatAbhaDisplay(abhaId)}
                  onChange={(e) => setAbhaId(e.target.value.replace(/\D/g, "").slice(0, 14))}
                  placeholder="1234 5678 9012 34"
                  required
                  maxLength={19} // 14 digits + 3 spaces
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-lg tracking-wider font-mono"
                  aria-label="14-digit ABHA Number"
                  inputMode="numeric"
                  autoComplete="off"
                />
                <p className="mt-1 text-xs text-muted-foreground">14-digit Ayushman Bharat Health Account number</p>
              </div>

              <div>
                <label htmlFor="abha-password" className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="abha-password"
                    type={showAbhaPassword ? "text" : "password"}
                    value={abhaPassword}
                    onChange={(e) => setAbhaPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Password for ABHA login"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAbhaPassword(!showAbhaPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showAbhaPassword ? "Hide password" : "Show password"}
                  >
                    {showAbhaPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs leading-relaxed">
                <strong>Test ABHA IDs (demo mode):</strong>
                <ul className="mt-1 space-y-0.5 list-disc list-inside">
                  <li>412356789012 — Suresh Rao</li>
                  <li>418733442211 — Meena Sharma</li>
                  <li>415599883300 — Rahul Verma</li>
                </ul>
                <p className="mt-1">Password: <code>Password123!</code></p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-busy={isLoading}
              >
                {isLoading ? "Signing in…" : "Sign In with ABHA"}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">New to HealthConnect?</span>
            </div>
          </div>

          {/* Sign Up link */}
          <a
            href="/register"
            className="w-full block text-center px-6 py-3 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
}
