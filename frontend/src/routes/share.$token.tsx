import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import {
  Activity,
  Calendar,
  Clock,
  FileText,
  Heart,
  Pill,
  Stethoscope,
  TestTube2,
  User,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { AppIcon } from "@/components/logo";

export const Route = createFileRoute("/share/$token")({
  component: PublicTimelinePage,
});

interface TimelineEntry {
  id: string;
  type: string;
  title: string;
  description?: string;
  date: string;
  doctor?: { name?: string; hospital?: string };
  diagnosis?: string;
  treatmentPlan?: string;
  medicines?: { name: string; dosage: string; frequency: string; duration: string }[];
  labTests?: { testName: string; result: string; normalRange: string; unit: string }[];
}

interface PatientInfo {
  name: string;
  gender?: string;
  dateOfBirth?: string;
  abhaId?: string;
}

interface TimelineData {
  patient: PatientInfo;
  recordCount: number;
  timeline: TimelineEntry[];
  expiresAt: string;
}

const typeConfig: Record<string, { icon: typeof FileText; color: string; bg: string; label: string }> = {
  prescription: { icon: Pill, color: "text-blue-600", bg: "bg-blue-100", label: "Prescription" },
  lab_report: { icon: TestTube2, color: "text-purple-600", bg: "bg-purple-100", label: "Lab Report" },
  visit_summary: { icon: Stethoscope, color: "text-emerald-600", bg: "bg-emerald-100", label: "Visit Summary" },
  discharge_summary: { icon: Heart, color: "text-rose-600", bg: "bg-rose-100", label: "Discharge Summary" },
  diagnostic_report: { icon: Activity, color: "text-amber-600", bg: "bg-amber-100", label: "Diagnostic Report" },
};

function PublicTimelinePage() {
  const { token } = Route.useParams();
  const [data, setData] = useState<TimelineData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTimeline();
  }, [token]);

  const fetchTimeline = async () => {
    try {
      setIsLoading(true);
      const result = await apiClient.share.getPublicTimeline(token);
      setData(result.data);
    } catch (err: any) {
      setError(err.message || "This link has expired or is invalid.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading medical history…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-red-50 px-4">
        <div className="max-w-md text-center bg-white rounded-2xl shadow-xl p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-red-500" size={32} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 mb-2">Link Expired or Invalid</h1>
          <p className="text-slate-500">
            {error || "This QR code link has expired or does not exist. Please ask the patient to generate a new one."}
          </p>
        </div>
      </div>
    );
  }

  const age = data.patient.dateOfBirth
    ? Math.floor((Date.now() - new Date(data.patient.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <AppIcon size={36} />
          <div>
            <h1 className="text-lg font-bold text-slate-800">HealthConnect India</h1>
            <p className="text-xs text-slate-500">Shared Medical Timeline</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
            <ShieldCheck size={14} />
            Verified
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Patient Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {data.patient.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-800">{data.patient.name}</h2>
              <div className="flex flex-wrap gap-3 mt-1 text-sm text-slate-500">
                {data.patient.gender && (
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    {data.patient.gender.charAt(0).toUpperCase() + data.patient.gender.slice(1)}
                    {age ? `, ${age} yrs` : ""}
                  </span>
                )}
                {data.patient.abhaId && (
                  <span className="flex items-center gap-1 text-blue-600">
                    <ShieldCheck size={14} />
                    ABHA: {data.patient.abhaId}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-full">
              <FileText size={12} />
              {data.recordCount} record{data.recordCount !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full">
              <Clock size={12} />
              Expires: {new Date(data.expiresAt).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Timeline */}
        {data.timeline.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow border border-slate-200">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No medical records available.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 via-indigo-300 to-purple-300"></div>

            <div className="space-y-6">
              {data.timeline.map((entry, index) => {
                const config = typeConfig[entry.type] || typeConfig.visit_summary;
                const Icon = config.icon;

                return (
                  <div key={entry.id} className="relative pl-16">
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-3 top-3 w-[22px] h-[22px] rounded-full ${config.bg} flex items-center justify-center ring-4 ring-white shadow-sm`}
                    >
                      <Icon className={config.color} size={12} />
                    </div>

                    {/* Card */}
                    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5 hover:shadow-lg transition-shadow">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.color} mb-1.5`}>
                            <Icon size={10} />
                            {config.label}
                          </span>
                          <h3 className="font-semibold text-slate-800">{entry.title}</h3>
                        </div>
                        <div className="text-right text-sm text-slate-500 whitespace-nowrap flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(entry.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </div>

                      {/* Description */}
                      {entry.description && (
                        <p className="text-sm text-slate-600 mb-3">{entry.description}</p>
                      )}

                      {/* Doctor */}
                      {entry.doctor?.name && (
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                          <Stethoscope size={14} className="text-slate-400" />
                          <span>
                            {entry.doctor.name}
                            {entry.doctor.hospital ? ` • ${entry.doctor.hospital}` : ""}
                          </span>
                        </div>
                      )}

                      {/* Diagnosis */}
                      {entry.diagnosis && (
                        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 mb-3">
                          <p className="text-xs font-semibold text-rose-700 mb-1">Diagnosis</p>
                          <p className="text-sm text-rose-600">{entry.diagnosis}</p>
                        </div>
                      )}

                      {/* Medicines */}
                      {entry.medicines && entry.medicines.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                          <p className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1">
                            <Pill size={12} /> Medications
                          </p>
                          <div className="space-y-1">
                            {entry.medicines.map((med, i) => (
                              <div key={i} className="text-sm text-blue-600 flex items-baseline gap-2">
                                <span className="font-medium">{med.name}</span>
                                <span className="text-blue-400 text-xs">
                                  {[med.dosage, med.frequency, med.duration].filter(Boolean).join(" · ")}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Lab Tests */}
                      {entry.labTests && entry.labTests.length > 0 && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                          <p className="text-xs font-semibold text-purple-700 mb-2 flex items-center gap-1">
                            <TestTube2 size={12} /> Lab Results
                          </p>
                          <div className="space-y-1">
                            {entry.labTests.map((test, i) => (
                              <div key={i} className="text-sm text-purple-600 flex items-baseline justify-between gap-2">
                                <span className="font-medium">{test.testName}</span>
                                <span className="text-purple-500 text-xs">
                                  {test.result}
                                  {test.unit ? ` ${test.unit}` : ""}
                                  {test.normalRange ? ` (Ref: ${test.normalRange})` : ""}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-slate-400 pb-8">
          <p>Shared via HealthConnect India • This is a temporary link</p>
          <p className="mt-1">If you are not the intended recipient, please close this page.</p>
        </div>
      </main>
    </div>
  );
}
