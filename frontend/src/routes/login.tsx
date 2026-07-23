import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/auth-provider";
import { useNavigate } from "@tanstack/react-router";
import { RefreshCw, ArrowLeft, ShieldCheck } from "lucide-react";
import { AppIcon } from "@/components/logo";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

type Step = "enter_identifier" | "enter_otp";

const RESEND_COOLDOWN_S = 60;

// Detect whether a digit string looks like a phone (10 digits) or ABHA (12-14 digits)
function classifyInput(digits: string): "phone" | "abha" | null {
  if (digits.length === 10) return "phone";
  if (digits.length >= 12 && digits.length <= 14) return "abha";
  return null;
}

// Format ABHA display with a space every 4 digits: 1234 5678 9012 34
function formatAbha(raw: string) {
  return raw.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function LoginPage() {
  const navigate = useNavigate();
  const { sendLoginOtp, loginPhoneOtp, isAuthenticated } = useAuth();

  const [step, setStep] = useState<Step>("enter_identifier");

  // Step 1
  const [identifier, setIdentifier] = useState(""); // raw digits only
  const [inputError, setInputError] = useState("");

  // Step 2
  const [otpPhone, setOtpPhone] = useState(""); // actual phone OTP is keyed to
  const [maskedPhone, setMaskedPhone] = useState(""); // e.g. XXXXXX3210
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isAuthenticated) navigate({ to: "/dashboard" });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => { if (cooldownRef.current) clearInterval(cooldownRef.current); };
  }, []);

  function startCooldown() {
    setResendCooldown(RESEND_COOLDOWN_S);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) { clearInterval(cooldownRef.current!); cooldownRef.current = null; return 0; }
        return prev - 1;
      });
    }, 1000);
  }

  // ── Handle identifier input — strip non-digits, cap at 14
  function handleIdentifierChange(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 14);
    setIdentifier(digits);
    setInputError("");
  }

  // Display value: phone = plain digits, ABHA = spaced groups
  const displayValue =
    identifier.length > 10 ? formatAbha(identifier) : identifier;

  const inputType = classifyInput(identifier);

  // ── Step 1: Send OTP
  async function handleSendOtp(e?: React.FormEvent) {
    e?.preventDefault();
    setError("");

    if (!inputType) {
      setInputError("Enter a 10-digit phone number or 12–14 digit ABHA ID");
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendLoginOtp(identifier);

      if (!result.phone) {
        // Server didn't return a phone — identifier not registered
        setError("No account found for this phone number or ABHA ID.");
        setIsLoading(false);
        return;
      }

      setOtpPhone(result.phone);
      setMaskedPhone(result.maskedPhone || `XXXXXX${result.phone.slice(-4)}`);
      if (result.devOtp) setDevOtp(result.devOtp);
      setStep("enter_otp");
      startCooldown();
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // ── Step 2: Verify OTP
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Enter the 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      await loginPhoneOtp(otpPhone, otp);
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      setError(err.message || "Incorrect OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // ── Resend
  async function handleResend() {
    if (resendCooldown > 0 || isLoading) return;
    setOtp("");
    setDevOtp(null);
    setError("");
    setIsLoading(true);
    try {
      const result = await sendLoginOtp(identifier);
      if (result.devOtp) setDevOtp(result.devOtp);
      startCooldown();
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">

          {/* Top accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-primary to-primary/60" />

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <AppIcon size={52} className="mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground">Sign In</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {step === "enter_identifier"
                  ? "Enter your phone number or ABHA ID"
                  : "Enter the OTP sent to your mobile"}
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div role="alert" className="mb-5 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                {error}
              </div>
            )}

            {/* ── STEP 1: Identifier input ───────────────────────── */}
            {step === "enter_identifier" && (
              <form onSubmit={handleSendOtp} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="identifier" className="block text-sm font-medium text-foreground mb-2">
                    Phone Number or ABHA ID
                  </label>

                  <div className="relative">
                    {/* +91 prefix shown only for phone-length input */}
                    {identifier.length <= 10 && (
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium select-none">
                        +91
                      </span>
                    )}
                    <input
                      id="identifier"
                      type="text"
                      value={displayValue}
                      onChange={(e) => handleIdentifierChange(e.target.value)}
                      placeholder="Phone or ABHA number"
                      className={`w-full py-3 rounded-lg border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                        inputError ? "border-destructive" : "border-border"
                      } ${identifier.length <= 10 ? "pl-12 pr-4" : "px-4 font-mono tracking-wider"}`}
                      aria-label="Phone number or ABHA ID"
                      inputMode="numeric"
                      autoFocus
                      autoComplete="off"
                    />
                  </div>

                  {/* Live hint */}
                  <div className="mt-2 min-h-[1.25rem]">
                    {inputError ? (
                      <p className="text-xs text-destructive">{inputError}</p>
                    ) : identifier.length === 0 ? (
                      <p className="text-xs text-muted-foreground">
                        10-digit mobile number &nbsp;·&nbsp; 12–14 digit ABHA ID
                      </p>
                    ) : inputType === "phone" ? (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <ShieldCheck size={12} /> Phone number recognised
                      </p>
                    ) : inputType === "abha" ? (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <ShieldCheck size={12} /> ABHA ID recognised
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        {identifier.length < 10
                          ? `${10 - identifier.length} more digit${10 - identifier.length !== 1 ? "s" : ""} for phone`
                          : `${12 - identifier.length} more digit${12 - identifier.length !== 1 ? "s" : ""} for ABHA`}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !inputType}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-busy={isLoading}
                >
                  {isLoading ? "Sending OTP…" : "Send OTP"}
                </button>
              </form>
            )}

            {/* ── STEP 2: OTP entry ──────────────────────────────── */}
            {step === "enter_otp" && (
              <form onSubmit={handleVerifyOtp} className="space-y-5" noValidate>
                {/* Destination info */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/60 border border-border text-sm">
                  <ShieldCheck size={16} className="text-primary shrink-0" />
                  <span className="text-foreground">
                    OTP sent to <span className="font-semibold font-mono">+91 {maskedPhone}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("enter_identifier");
                      setOtp(""); setDevOtp(null); setError("");
                      if (cooldownRef.current) { clearInterval(cooldownRef.current); cooldownRef.current = null; }
                      setResendCooldown(0);
                    }}
                    className="ml-auto flex items-center gap-1 text-xs text-primary hover:underline shrink-0"
                    aria-label="Change identifier"
                  >
                    <ArrowLeft size={12} /> Change
                  </button>
                </div>

                {/* Dev-mode hint */}
                {devOtp && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-sm">
                    <span>🛠 <strong>Dev mode</strong> — OTP:</span>
                    <code
                      className="font-mono font-bold tracking-widest cursor-pointer hover:opacity-70 px-1 rounded"
                      onClick={() => setOtp(devOtp)}
                      title="Click to auto-fill"
                    >
                      {devOtp}
                    </code>
                    <span className="text-xs opacity-70">(tap to fill)</span>
                  </div>
                )}

                {/* OTP input */}
                <div>
                  <label htmlFor="otp-input" className="block text-sm font-medium text-foreground mb-2">
                    6-digit OTP
                  </label>
                  <input
                    id="otp-input"
                    type="text"
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
                    placeholder="——————"
                    maxLength={6}
                    required
                    className="w-full px-4 py-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-center text-3xl tracking-[0.6em] font-mono"
                    aria-label="6-digit OTP"
                    inputMode="numeric"
                    autoFocus
                    autoComplete="one-time-code"
                  />
                  <div className="mt-2.5 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Valid for 10 minutes</span>
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resendCooldown > 0 || isLoading}
                      className="flex items-center gap-1 text-primary hover:underline disabled:text-muted-foreground disabled:no-underline disabled:cursor-not-allowed"
                    >
                      <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
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

            {/* Footer */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-card text-muted-foreground">New to HealthConnect?</span>
              </div>
            </div>

            <a
              href="/register"
              className="w-full block text-center px-6 py-3 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm"
            >
              Create Account
            </a>
          </div>
        </div>

        {/* Demo hint below card */}
        <div className="mt-4 p-3 rounded-xl bg-card/80 border border-border text-xs text-muted-foreground text-center leading-relaxed">
          <strong>Demo accounts</strong> (OTP: <code className="font-mono">123456</code>)<br />
          📱 9800000001 &nbsp;·&nbsp; 9900000022 &nbsp;·&nbsp; 9700000033<br />
          🪪 ABHA: 412356789012 &nbsp;·&nbsp; 418733442211
        </div>
      </div>
    </div>
  );
}
