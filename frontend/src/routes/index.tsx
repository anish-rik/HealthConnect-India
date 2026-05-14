import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ThemeToggle } from "../components/theme-toggle";
import { VoiceButton } from "../components/voice-button";
import { useAuth } from "../components/auth-provider";
import {
  Activity,
  IdCard,
  FolderOpen,
  ShieldCheck,
  Languages,
  CalendarClock,
  Lock,
  Globe,
  Check,
  Menu,
  X,
  HeartPulse,
  FileText,
  Pill,
  ClipboardList,
  User,
  ArrowRight,
} from "lucide-react";
import { LANGUAGES, translations, type LangCode } from "@/lib/translations";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function LanguageSwitcher({
  lang,
  setLang,
  compact = false,
  ariaLabel,
}: {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  compact?: boolean;
  ariaLabel: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`flex flex-nowrap items-center gap-0.5 rounded-full border border-border bg-card p-0.5 ${
        compact ? "text-xs" : "text-xs sm:text-sm"
      }`}
    >
      {LANGUAGES.map((l) => {
        const active = l.code === lang;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLang(l.code)}
            aria-pressed={active}
            lang={l.htmlLang}
            className={`rounded-full px-2 py-1 font-medium transition-all min-h-[32px] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-body hover:bg-muted hover:text-foreground"
            }`}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}

function Logo({ onDark = false }: { onDark?: boolean }) {
  return (
    <a href="#top" className="flex items-center gap-2.5" aria-label="HealthConnect India home">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-primary">
        <Activity className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} aria-hidden />
      </span>
      <span className="leading-tight">
        <span
          className={`block font-display text-lg font-bold ${
            onDark ? "text-white" : "text-primary"
          }`}
        >
          HealthConnect
        </span>
        <span className="block text-xs font-semibold text-accent -mt-0.5">India</span>
      </span>
    </a>
  );
}

function PhoneMockup({ t }: { t: ReturnType<typeof useT> }) {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      {/* background blobs */}
      <div className="absolute -top-6 -right-6 h-44 w-44 rounded-full bg-accent/20 blur-3xl" aria-hidden />
      <div className="absolute -bottom-8 -left-6 h-52 w-52 rounded-full bg-primary/20 blur-3xl" aria-hidden />

      <div className="relative rounded-[2.5rem] border-[10px] border-foreground/90 bg-background p-4 shadow-2xl">
        {/* notch */}
        <div className="mx-auto mb-3 h-1.5 w-20 rounded-full bg-foreground/20" aria-hidden />
        <div className="rounded-2xl bg-trust p-4">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary">
              <HeartPulse className="h-4 w-4 text-primary-foreground" aria-hidden />
            </span>
            <div>
              <p className="font-display text-sm font-semibold text-foreground">
                {t.hero.mockTitle}
              </p>
              <p className="text-xs text-muted-foreground">{t.hero.mockSubtitle}</p>
            </div>
          </div>

          <ul className="mt-4 space-y-2">
            {[
              { icon: FileText, label: t.hero.mockItem1, tone: "bg-card" },
              { icon: Pill, label: t.hero.mockItem2, tone: "bg-card" },
              { icon: ClipboardList, label: t.hero.mockItem3, tone: "bg-card" },
            ].map(({ icon: Icon, label, tone }) => (
              <li
                key={label}
                className={`flex items-center justify-between gap-2 rounded-xl ${tone} px-3 py-2.5 shadow-sm`}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span className="truncate text-sm font-medium text-foreground">{label}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              </li>
            ))}
          </ul>

          <div className="mt-3 flex items-center gap-2 rounded-xl bg-success/10 px-3 py-2">
            <ShieldCheck className="h-4 w-4 text-success" aria-hidden />
            <span className="text-xs font-medium text-success">ABHA · Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function useT(lang: LangCode) {
  return useMemo(() => translations[lang], [lang]);
}

function HomePage() {
  const [lang, setLang] = useState<LangCode>("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const t = useT(lang);

  useEffect(() => {
    const html = LANGUAGES.find((l) => l.code === lang)?.htmlLang ?? "en";
    if (typeof document !== "undefined") {
      document.documentElement.lang = html;
    }
  }, [lang]);

  const navLinks = [
    { href: "#top", label: t.nav.home },
    { href: "#how", label: t.nav.records },
    { href: "#features", label: t.nav.appointments },
    { href: "#trust", label: t.nav.help },
  ];

  const steps = [
    { icon: IdCard, title: t.how.s1Title, text: t.how.s1Text },
    { icon: FolderOpen, title: t.how.s2Title, text: t.how.s2Text },
    { icon: ShieldCheck, title: t.how.s3Title, text: t.how.s3Text },
  ];

  const features = [
    { icon: Globe, title: t.features.f1Title, text: t.features.f1Text },
    { icon: CalendarClock, title: t.features.f2Title, text: t.features.f2Text },
    { icon: Lock, title: t.features.f3Title, text: t.features.f3Text },
    { icon: Languages, title: t.features.f4Title, text: t.features.f4Text },
  ];

  const personas = [
    { name: t.personas.p1Name, loc: t.personas.p1Loc, quote: t.personas.p1Quote },
    { name: t.personas.p2Name, loc: t.personas.p2Loc, quote: t.personas.p2Quote },
    { name: t.personas.p3Name, loc: t.personas.p3Loc, quote: t.personas.p3Quote },
  ];

  return (
    <div id="top" className="min-h-screen bg-background">
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* HEADER */}
      <header role="banner" className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:px-6 lg:px-8">
          <Logo />

          <nav aria-label="Primary" className="hidden lg:flex items-center gap-7">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm font-medium text-body transition-colors hover:text-primary"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <VoiceButton startLabel={t.a11y.startScreenReading} stopLabel={t.a11y.stopScreenReading} />
            <ThemeToggle />
            <LanguageSwitcher lang={lang} setLang={setLang} compact ariaLabel={t.a11y.selectLanguage} />
            {isAuthenticated ? (
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-4 py-2 text-xs sm:text-sm font-semibold shadow-sm transition-all hover:scale-[1.02] hover:shadow-md whitespace-nowrap"
              >
                Dashboard
              </a>
            ) : (
              <>
                <a
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border-2 border-primary text-primary px-4 py-2 text-xs sm:text-sm font-semibold transition-all hover:bg-primary/10 whitespace-nowrap"
                >
                  Sign In
                </a>
                <a
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2 text-xs sm:text-sm font-semibold text-accent-foreground shadow-sm transition-all hover:scale-[1.02] hover:shadow-md whitespace-nowrap"
                >
                  {t.nav.cta}
                </a>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <VoiceButton startLabel={t.a11y.startScreenReading} stopLabel={t.a11y.stopScreenReading} />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen((s) => !s)}
              aria-label={menuOpen ? t.a11y.closeMenu : t.a11y.openMenu}
              aria-expanded={menuOpen}
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <div className="space-y-4 px-4 py-4">
              <nav aria-label="Mobile" className="flex flex-col">
                {navLinks.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-2 py-3 text-base font-medium text-foreground hover:bg-muted"
                  >
                    {l.label}
                  </a>
                ))}
              </nav>
              <LanguageSwitcher lang={lang} setLang={setLang} ariaLabel={t.a11y.selectLanguage} />
              {isAuthenticated ? (
                <a
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full rounded-full bg-primary text-primary-foreground px-5 py-3 text-center text-sm font-semibold shadow-sm"
                >
                  Dashboard
                </a>
              ) : (
                <>
                  <a
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full rounded-full border-2 border-primary text-primary px-5 py-3 text-center text-sm font-semibold"
                  >
                    Sign In
                  </a>
                  <a
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full rounded-full bg-accent px-5 py-3 text-center text-sm font-semibold text-accent-foreground shadow-sm"
                  >
                    {t.nav.cta}
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main id="main-content" role="main">
        {/* HERO */}
        <section className="relative">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
            <div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
                {t.hero.title}
              </h1>
              <p className="mt-5 max-w-xl text-lg text-body">{t.hero.subtitle}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => navigate({ to: "/abha-link" })}
                  className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3.5 text-base font-semibold text-accent-foreground shadow-sm transition-all hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                  aria-describedby="cta-description"
                >
                  {t.hero.ctaPrimary}
                </button>
                <a
                  href="#how"
                  className="inline-flex items-center justify-center rounded-full border-2 border-primary bg-transparent px-6 py-3.5 text-base font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  {t.hero.ctaSecondary}
                </a>
              </div>

              <p id="cta-description" className="sr-only">
                Link your ABHA ID to access your health records securely
              </p>

              <ul className="mt-8 grid gap-2.5 text-sm text-body sm:grid-cols-1">
                {[t.hero.trust1, t.hero.trust2, t.hero.trust3].map((line) => (
                  <li key={line} className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success/15">
                      <Check className="h-3.5 w-3.5 text-success" strokeWidth={3} aria-hidden />
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="order-first lg:order-last">
              <PhoneMockup t={t} />
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="border-y border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-accent">
                {t.how.eyebrow}
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
                {t.how.heading}
              </h2>
            </div>

            <ol className="mt-12 grid gap-6 md:grid-cols-3">
              {steps.map((s, i) => (
                <li
                  key={s.title}
                  className="relative rounded-2xl border border-border bg-background p-6 transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="absolute right-5 top-5 font-display text-5xl font-bold text-primary/10">
                    0{i + 1}
                  </span>
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-trust">
                    <s.icon className="h-6 w-6 text-primary" aria-hidden />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-body">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="bg-trust">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                {t.features.heading}
              </h2>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {features.map((f) => (
                <article
                  key={f.title}
                  className="rounded-2xl bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-md sm:p-7"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent/15">
                    <f.icon className="h-6 w-6 text-accent" aria-hidden />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-body">{f.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST */}
        <section id="trust" className="bg-background">
          <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 md:py-20 lg:px-8">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              {t.trust.heading}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-body sm:text-lg">{t.trust.body}</p>

            <div className="mt-8 flex flex-nowrap items-center justify-center gap-2 overflow-x-auto">
              {[t.trust.badge1, t.trust.badge2, t.trust.badge3].map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-trust px-3 py-1.5 text-xs sm:text-sm font-semibold text-primary whitespace-nowrap flex-shrink-0"
                >
                  <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden />
                  {b}
                </span>
              ))}
            </div>

            <p className="mx-auto mt-8 max-w-xl text-sm text-muted-foreground">{t.trust.note}</p>
          </div>
        </section>

        {/* PERSONAS */}
        <section className="bg-persona">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                {t.personas.heading}
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {personas.map((p) => (
                <figure
                  key={p.name}
                  className="flex flex-col rounded-2xl border border-accent/20 bg-card p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-accent/20">
                      <User className="h-6 w-6 text-accent" aria-hidden />
                    </span>
                    <figcaption>
                      <p className="font-display text-base font-semibold text-foreground">
                        {p.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{p.loc}</p>
                    </figcaption>
                  </div>
                  <blockquote className="mt-5 grow text-base leading-relaxed text-body">
                    “{p.quote}”
                  </blockquote>
                </figure>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer role="contentinfo" className="bg-footer text-white/85">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <Logo onDark />
              <p className="mt-4 max-w-xs text-sm text-white/70">{t.footer.tagline}</p>
            </div>

            <nav aria-label="Footer">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
                {t.footer.colLinks}
              </h3>
              <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
                {[
                  t.footer.about,
                  t.footer.features,
                  t.footer.abhaHelp,
                  t.footer.accessibility,
                  t.footer.privacy,
                ].map((l) => (
                  <li key={l}>
                    <a href="#top" className="text-white/75 transition-colors hover:text-accent">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
                {t.footer.languageLabel}
              </h3>
              <div className="mt-4">
                <LanguageSwitcher
                  lang={lang}
                  setLang={setLang}
                  compact
                  ariaLabel={t.a11y.selectLanguage}
                />
              </div>
              <p className="mt-6 text-sm text-white/70">{t.footer.by}</p>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/60">
            {t.footer.bottom}
          </div>
        </div>
      </footer>
    </div>
  );
}
