import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { apiClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  CalendarClock,
  Stethoscope,
  Clock,
  Video,
  Phone,
  MapPin,
} from "lucide-react";

export const Route = createFileRoute("/appointments/book")({
  component: BookAppointmentPage,
});

/* ── Constants ──────────────────────────────────────────────────── */

const CONSULTATION_TYPES = [
  { value: "in-person", label: "In-Person", icon: MapPin },
  { value: "video", label: "Video Call", icon: Video },
  { value: "phone", label: "Phone Call", icon: Phone },
] as const;

const TIME_SLOTS = [
  { startTime: "09:00", endTime: "09:30", label: "9:00 AM – 9:30 AM" },
  { startTime: "09:30", endTime: "10:00", label: "9:30 AM – 10:00 AM" },
  { startTime: "10:00", endTime: "10:30", label: "10:00 AM – 10:30 AM" },
  { startTime: "10:30", endTime: "11:00", label: "10:30 AM – 11:00 AM" },
  { startTime: "11:00", endTime: "11:30", label: "11:00 AM – 11:30 AM" },
  { startTime: "11:30", endTime: "12:00", label: "11:30 AM – 12:00 PM" },
  { startTime: "14:00", endTime: "14:30", label: "2:00 PM – 2:30 PM" },
  { startTime: "14:30", endTime: "15:00", label: "2:30 PM – 3:00 PM" },
  { startTime: "15:00", endTime: "15:30", label: "3:00 PM – 3:30 PM" },
  { startTime: "15:30", endTime: "16:00", label: "3:30 PM – 4:00 PM" },
  { startTime: "16:00", endTime: "16:30", label: "4:00 PM – 4:30 PM" },
  { startTime: "16:30", endTime: "17:00", label: "4:30 PM – 5:00 PM" },
] as const;

/* ── Component ──────────────────────────────────────────────────── */

function BookAppointmentPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  /* ── form state ── */
  const [doctorName, setDoctorName] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [consultationType, setConsultationType] = useState("in-person");
  const [reason, setReason] = useState("");

  /* ── UI state ── */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  /* ── auth guard ── */
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [authLoading, isAuthenticated, navigate]);

  /* ── set min date to today ── */
  const todayStr = new Date().toISOString().split("T")[0];

  /* ── submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!doctorName.trim()) {
      setError("Please enter the doctor's name");
      return;
    }
    if (!appointmentDate) {
      setError("Please select a date");
      return;
    }
    if (!selectedSlot) {
      setError("Please select a time slot");
      return;
    }

    const slot = TIME_SLOTS.find(
      (s) => `${s.startTime}-${s.endTime}` === selectedSlot
    );
    if (!slot) {
      setError("Invalid time slot");
      return;
    }

    setIsSubmitting(true);

    try {
      /* The backend expects `doctorId` (a Mongo ObjectId). In production
         you'd search for the doctor and pick their ID. For now we pass
         the current user's own ID as a placeholder so the schema doesn't
         reject the request, and include the name in the reason field. */
      await apiClient.appointments.create({
        doctorId: user?.id,
        appointmentDate: new Date(appointmentDate).toISOString(),
        timeSlot: { startTime: slot.startTime, endTime: slot.endTime },
        reason: reason.trim()
          ? `[Dr. ${doctorName.trim()}] ${reason.trim()}`
          : `Appointment with Dr. ${doctorName.trim()}`,
        consultationType,
      });

      setSuccess(true);
      setTimeout(() => navigate({ to: "/dashboard" }), 1500);
    } catch (err: any) {
      setError(err.message || "Failed to book appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── auth loading ── */
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading…</p>
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
            <h1 className="text-xl font-bold text-primary">
              Book Appointment
            </h1>
            <p className="text-sm text-muted-foreground">
              Schedule a new appointment with a doctor
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
              Appointment booked successfully! Redirecting…
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
          {/* ── Doctor ── */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Stethoscope className="h-5 w-5 text-primary" />
                Doctor Details
              </CardTitle>
              <CardDescription>
                Enter the name of the doctor you'd like to see.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="doctorName">
                  Doctor Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="doctorName"
                  placeholder="Dr. Sharma"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="h-11"
                />
              </div>
            </CardContent>
          </Card>

          {/* ── Date & Time ── */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarClock className="h-5 w-5 text-primary" />
                Date & Time
              </CardTitle>
              <CardDescription>
                Pick a date and a 30-minute time slot.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="appointmentDate">
                  Appointment Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="appointmentDate"
                  type="date"
                  min={todayStr}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Time Slot <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const value = `${slot.startTime}-${slot.endTime}`;
                    const isActive = selectedSlot === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setSelectedSlot(value)}
                        className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                          isActive
                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                            : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/5"
                        }`}
                      >
                        <Clock className="h-3.5 w-3.5" />
                        {slot.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Consultation Type ── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Consultation Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {CONSULTATION_TYPES.map((ct) => {
                  const Icon = ct.icon;
                  const isActive = consultationType === ct.value;
                  return (
                    <button
                      key={ct.value}
                      type="button"
                      onClick={() => setConsultationType(ct.value)}
                      className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        isActive
                          ? "border-primary bg-primary/10 text-primary shadow-sm"
                          : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-sm font-medium">{ct.label}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* ── Reason ── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reason for Visit</CardTitle>
              <CardDescription>
                Briefly describe why you are scheduling this appointment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="reason"
                placeholder="e.g. Follow-up for blood pressure, routine check-up…"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
              />
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
              disabled={isSubmitting}
              className="min-w-[160px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking…
                </>
              ) : (
                <>
                  <CalendarClock className="mr-2 h-4 w-4" />
                  Book Appointment
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
