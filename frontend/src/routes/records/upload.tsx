import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef, useCallback } from "react";
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
  Upload,
  FileText,
  Plus,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  Pill,
  TestTubeDiagonal,
} from "lucide-react";

export const Route = createFileRoute("/records/upload")({
  component: UploadRecordPage,
});

/* ── Types ──────────────────────────────────────────────────────── */

interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface LabTest {
  testName: string;
  result: string;
  normalRange: string;
  unit: string;
}

const RECORD_TYPES = [
  { value: "prescription", label: "Prescription" },
  { value: "lab_report", label: "Lab Report" },
  { value: "visit_summary", label: "Visit Summary" },
  { value: "discharge_summary", label: "Discharge Summary" },
  { value: "diagnostic_report", label: "Diagnostic Report" },
] as const;

const EMPTY_MEDICINE: Medicine = {
  name: "",
  dosage: "",
  frequency: "",
  duration: "",
};

const EMPTY_LAB_TEST: LabTest = {
  testName: "",
  result: "",
  normalRange: "",
  unit: "",
};

/* ── Component ──────────────────────────────────────────────────── */

function UploadRecordPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  /* ── form state ── */
  const [recordType, setRecordType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorHospital, setDoctorHospital] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  /* ── UI state ── */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── auth guard ── */
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [authLoading, isAuthenticated, navigate]);

  /* ── file helpers ── */
  const addFiles = useCallback((incoming: FileList | File[]) => {
    const arr = Array.from(incoming);
    // De-duplicate by name+size
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => `${f.name}::${f.size}`));
      const fresh = arr.filter((f) => !existing.has(`${f.name}::${f.size}`));
      return [...prev, ...fresh].slice(0, 5); // max 5 files
    });
  }, []);

  const removeFile = (index: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  /* ── drag-and-drop ── */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  /* ── medicines ── */
  const addMedicine = () => setMedicines((m) => [...m, { ...EMPTY_MEDICINE }]);
  const removeMedicine = (i: number) =>
    setMedicines((m) => m.filter((_, idx) => idx !== i));
  const updateMedicine = (i: number, field: keyof Medicine, value: string) =>
    setMedicines((m) =>
      m.map((med, idx) => (idx === i ? { ...med, [field]: value } : med))
    );

  /* ── lab tests ── */
  const addLabTest = () => setLabTests((t) => [...t, { ...EMPTY_LAB_TEST }]);
  const removeLabTest = (i: number) =>
    setLabTests((t) => t.filter((_, idx) => idx !== i));
  const updateLabTest = (i: number, field: keyof LabTest, value: string) =>
    setLabTests((t) =>
      t.map((test, idx) => (idx === i ? { ...test, [field]: value } : test))
    );

  /* ── submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!recordType) {
      setError("Please select a record type");
      return;
    }
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: Record<string, any> = {
        recordType,
        title: title.trim(),
        description: description.trim(),
        date,
      };

      if (doctorName.trim() || doctorHospital.trim()) {
        payload.doctor = JSON.stringify({
          name: doctorName.trim(),
          hospital: doctorHospital.trim(),
        });
      }

      if (diagnosis.trim()) payload.diagnosis = diagnosis.trim();
      if (treatmentPlan.trim()) payload.treatmentPlan = treatmentPlan.trim();

      const validMedicines = medicines.filter((m) => m.name.trim());
      if (validMedicines.length > 0)
        payload.medicines = JSON.stringify(validMedicines);

      const validLabTests = labTests.filter((t) => t.testName.trim());
      if (validLabTests.length > 0)
        payload.labTests = JSON.stringify(validLabTests);

      await apiClient.records.create(payload, files.length > 0 ? files : undefined);
      setSuccess(true);

      // redirect after a beat so the success message is visible
      setTimeout(() => navigate({ to: "/dashboard" }), 1500);
    } catch (err: any) {
      setError(err.message || "Failed to upload record");
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
        <div className="max-w-4xl mx-auto flex items-center gap-4 px-4 py-3 sm:px-6">
          <button
            onClick={() => navigate({ to: "/dashboard" })}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-card hover:bg-muted transition-colors"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-primary">
              Upload Health Record
            </h1>
            <p className="text-sm text-muted-foreground">
              Add a new medical record to your profile
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
        {/* ── Success ── */}
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Record uploaded successfully! Redirecting to dashboard…
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
          {/* ── Basic Info ── */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                Record Details
              </CardTitle>
              <CardDescription>
                Enter the basic details about this health record.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              {/* Record type */}
              <div className="space-y-2 sm:col-span-1">
                <Label htmlFor="recordType">
                  Record Type <span className="text-red-500">*</span>
                </Label>
                <Select value={recordType} onValueChange={setRecordType}>
                  <SelectTrigger id="recordType" className="h-11">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {RECORD_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div className="space-y-2 sm:col-span-1">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-11"
                />
              </div>

              {/* Title */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Blood Test Report, Discharge Summary"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-11"
                />
              </div>

              {/* Description */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief summary of this record…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* ── Doctor Info ── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Doctor Information</CardTitle>
              <CardDescription>
                Optionally record the treating doctor's details.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="doctorName">Doctor Name</Label>
                <Input
                  id="doctorName"
                  placeholder="Dr. Sharma"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctorHospital">Hospital / Clinic</Label>
                <Input
                  id="doctorHospital"
                  placeholder="City Hospital"
                  value={doctorHospital}
                  onChange={(e) => setDoctorHospital(e.target.value)}
                  className="h-11"
                />
              </div>
            </CardContent>
          </Card>

          {/* ── Diagnosis & Treatment ── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Diagnosis & Treatment
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-1">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Textarea
                  id="diagnosis"
                  placeholder="Primary diagnosis…"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2 sm:col-span-1">
                <Label htmlFor="treatmentPlan">Treatment Plan</Label>
                <Textarea
                  id="treatmentPlan"
                  placeholder="Follow-up steps, exercises, etc."
                  value={treatmentPlan}
                  onChange={(e) => setTreatmentPlan(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* ── Medicines ── */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Pill className="h-5 w-5 text-primary" />
                  Medicines
                </CardTitle>
                <CardDescription>
                  List any medications prescribed.
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMedicine}
                className="shrink-0"
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </CardHeader>
            {medicines.length > 0 && (
              <CardContent className="space-y-4">
                {medicines.map((med, i) => (
                  <div
                    key={i}
                    className="grid gap-3 sm:grid-cols-5 items-end rounded-lg border border-border bg-muted/30 p-4"
                  >
                    <div className="space-y-1 sm:col-span-2">
                      <Label className="text-xs">Medicine Name</Label>
                      <Input
                        placeholder="Paracetamol"
                        value={med.name}
                        onChange={(e) =>
                          updateMedicine(i, "name", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Dosage</Label>
                      <Input
                        placeholder="500mg"
                        value={med.dosage}
                        onChange={(e) =>
                          updateMedicine(i, "dosage", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Frequency</Label>
                      <Input
                        placeholder="Twice daily"
                        value={med.frequency}
                        onChange={(e) =>
                          updateMedicine(i, "frequency", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1 space-y-1">
                        <Label className="text-xs">Duration</Label>
                        <Input
                          placeholder="7 days"
                          value={med.duration}
                          onChange={(e) =>
                            updateMedicine(i, "duration", e.target.value)
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMedicine(i)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                        aria-label="Remove medicine"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>

          {/* ── Lab Tests ── */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TestTubeDiagonal className="h-5 w-5 text-primary" />
                  Lab Tests
                </CardTitle>
                <CardDescription>
                  Record any lab test results.
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLabTest}
                className="shrink-0"
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </CardHeader>
            {labTests.length > 0 && (
              <CardContent className="space-y-4">
                {labTests.map((test, i) => (
                  <div
                    key={i}
                    className="grid gap-3 sm:grid-cols-5 items-end rounded-lg border border-border bg-muted/30 p-4"
                  >
                    <div className="space-y-1 sm:col-span-2">
                      <Label className="text-xs">Test Name</Label>
                      <Input
                        placeholder="Hemoglobin"
                        value={test.testName}
                        onChange={(e) =>
                          updateLabTest(i, "testName", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Result</Label>
                      <Input
                        placeholder="14.2"
                        value={test.result}
                        onChange={(e) =>
                          updateLabTest(i, "result", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Normal Range</Label>
                      <Input
                        placeholder="12-16"
                        value={test.normalRange}
                        onChange={(e) =>
                          updateLabTest(i, "normalRange", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1 space-y-1">
                        <Label className="text-xs">Unit</Label>
                        <Input
                          placeholder="g/dL"
                          value={test.unit}
                          onChange={(e) =>
                            updateLabTest(i, "unit", e.target.value)
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLabTest(i)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                        aria-label="Remove lab test"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>

          {/* ── File Attachments ── */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Upload className="h-5 w-5 text-primary" />
                Attachments
              </CardTitle>
              <CardDescription>
                Upload scanned prescriptions, reports, or images (max 5 files).
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Drop zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/30"
                }`}
              >
                <Upload
                  className={`h-8 w-8 mb-3 ${isDragging ? "text-primary" : "text-muted-foreground"}`}
                />
                <p className="font-medium text-foreground">
                  Drag & drop files here
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  or click to browse · PDF, JPG, PNG
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) addFiles(e.target.files);
                    e.target.value = ""; // allow re-selecting same file
                  }}
                />
              </div>

              {/* File list */}
              {files.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {files.map((file, i) => (
                    <li
                      key={`${file.name}-${file.size}`}
                      className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-2.5"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="h-5 w-5 shrink-0 text-primary" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="ml-2 grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                        aria-label={`Remove ${file.name}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
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
            <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Record
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
