import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { apiClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  Globe,
  Shield,
  Mail,
  Calendar,
  MapPin,
} from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

/* ── Constants ──────────────────────────────────────────────────── */

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी (Hindi)" },
  { value: "kn", label: "ಕನ್ನಡ (Kannada)" },
  { value: "bn", label: "বাংলা (Bengali)" },
  { value: "ta", label: "தமிழ் (Tamil)" },
  { value: "te", label: "తెలుగు (Telugu)" },
  { value: "ml", label: "മലയാളം (Malayalam)" },
] as const;

const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
] as const;

/* ── Component ──────────────────────────────────────────────────── */

function ProfilePage() {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    updateProfile,
  } = useAuth();

  /* ── form state ── */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [language, setLanguage] = useState("en");

  /* ── UI state ── */
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  /* ── auth guard ── */
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [authLoading, isAuthenticated, navigate]);

  /* ── load profile from API ── */
  useEffect(() => {
    if (!isAuthenticated) return;

    const load = async () => {
      try {
        const res = await apiClient.auth.getProfile();
        const profile = res.data || res;

        setName(profile.name || "");
        setEmail(profile.email || "");
        setPhoneNumber(profile.phone || "");
        setDateOfBirth(
          profile.dateOfBirth
            ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
            : ""
        );
        setGender(profile.gender || "");
        setAddress(profile.address || "");
        setLanguage(profile.language || "en");
      } catch {
        /* profile data may already be in context via user */
        if (user) {
          setName(user.name || "");
          setEmail(user.email || "");
          setLanguage((user as any).language || "en");
        }
      } finally {
        setIsLoadingProfile(false);
      }
    };

    load();
  }, [isAuthenticated, user]);

  /* ── submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setIsSaving(true);

    try {
      const payload: Record<string, any> = {
        name: name.trim(),
        language,
      };

      if (phoneNumber.trim()) payload.phone = phoneNumber.trim();
      if (dateOfBirth) payload.dateOfBirth = dateOfBirth;
      if (gender) payload.gender = gender;
      if (address.trim()) payload.address = address.trim();

      await updateProfile(payload);
      setSuccess(true);
      // Clear success after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  /* ── loading state ── */
  if (authLoading || isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile…</p>
        </div>
      </div>
    );
  }

  /* ── render ── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-4 py-3 sm:px-6">
          <button
            onClick={() => navigate({ to: "/dashboard" })}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-card hover:bg-muted transition-colors"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-primary">Edit Profile</h1>
            <p className="text-sm text-muted-foreground">
              Update your personal information
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6">
        {/* ── Success ── */}
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Profile updated successfully!
            </AlertDescription>
          </Alert>
        )}

        {/* ── Error ── */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── Avatar & Name ── */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Your basic profile details visible across the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Avatar placeholder */}
              <div className="flex items-center gap-5 mb-6">
                <div className="h-20 w-20 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-lg">
                    {name || "Your Name"}
                  </p>
                  <p className="text-sm text-muted-foreground">{email}</p>
                  {user?.role && (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary capitalize">
                      <Shield className="h-3 w-3" />
                      {user.role}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Name */}
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="name">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11"
                  />
                </div>

                {/* Email (read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="h-11 bg-muted/50 cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed.
                  </p>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="10-digit phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Additional Details ── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              {/* Date of Birth */}
              <div className="space-y-2">
                <Label
                  htmlFor="dateOfBirth"
                  className="flex items-center gap-1.5"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="h-11"
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger id="gender" className="h-11">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDERS.map((g) => (
                      <SelectItem key={g.value} value={g.value}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Address */}
              <div className="space-y-2 sm:col-span-2">
                <Label
                  htmlFor="address"
                  className="flex items-center gap-1.5"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  Address
                </Label>
                <Input
                  id="address"
                  placeholder="Your city or full address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="h-11"
                />
              </div>
            </CardContent>
          </Card>

          {/* ── Preferences ── */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="h-5 w-5 text-primary" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-w-sm">
                <Label htmlFor="language">Preferred Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language" className="h-11">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((l) => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* ── Submit ── */}
          <div className="flex items-center justify-end gap-4 pb-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/dashboard" })}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="min-w-[140px]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
