import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/components/auth-provider";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { FileText, Calendar, User, LogOut, IdCard } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

interface HealthRecord {
  _id: string;
  title: string;
  recordType: string;
  date: string;
  doctor?: { name: string; hospital: string };
}

interface Appointment {
  _id: string;
  appointmentDate: string;
  doctor?: string;
  reason: string;
  status: string;
}

interface ABHAStatus {
  isLinked: boolean;
  abhaId?: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout, isLoading: authLoading } = useAuth();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [abhaStatus, setAbhaStatus] = useState<ABHAStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "records" | "appointments">("overview");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/login" });
    }
  }, [authLoading, user, navigate]);

  // Load data
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [recordsRes, appointmentsRes, abhaRes] = await Promise.all([
        apiClient.records.list().catch(() => ({ data: [] })),
        apiClient.appointments.list().catch(() => ({ data: [] })),
        apiClient.abha.status().catch(() => null),
      ]);
      setRecords(recordsRes.data || []);
      setAppointments(appointmentsRes.data || []);
      setAbhaStatus(abhaRes?.data || abhaRes);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          {["overview", "records", "appointments"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 font-medium transition-colors capitalize ${
                activeTab === tab
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Profile Card */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Profile</p>
                  <p className="font-semibold">{user?.name}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>
              <a
                href="/profile"
                className="text-primary text-sm font-medium hover:underline"
              >
                Edit Profile →
              </a>
            </div>

            {/* ABHA Card */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  abhaStatus?.isLinked ? 'bg-success/20' : 'bg-warning/20'
                }`}>
                  <IdCard className={abhaStatus?.isLinked ? 'text-success' : 'text-warning'} size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ABHA Status</p>
                  <p className="font-semibold">{abhaStatus?.isLinked ? 'Linked' : 'Not Linked'}</p>
                </div>
              </div>
              {abhaStatus?.isLinked ? (
                <p className="text-sm text-muted-foreground">
                  ABHA: {abhaStatus.abhaId}
                </p>
              ) : (
                <button
                  onClick={() => navigate({ to: "/abha-link" })}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  Link ABHA ID →
                </button>
              )}
            </div>

            {/* Records Card */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <FileText className="text-accent" size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Health Records</p>
                  <p className="font-semibold text-2xl">{records.length}</p>
                </div>
              </div>
              <a
                href="#records"
                onClick={() => setActiveTab("records")}
                className="text-primary text-sm font-medium hover:underline"
              >
                View All →
              </a>
            </div>

            {/* Appointments Card */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                  <Calendar className="text-success" size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Appointments</p>
                  <p className="font-semibold text-2xl">{appointments.length}</p>
                </div>
              </div>
              <a
                href="#appointments"
                onClick={() => setActiveTab("appointments")}
                className="text-primary text-sm font-medium hover:underline"
              >
                View All →
              </a>
            </div>
          </div>
        )}

        {/* Records Tab */}
        {activeTab === "records" && (
          <div>
            <div className="mb-6 flex gap-4">
              {abhaStatus?.isLinked && (
                <button
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      const result = await apiClient.abha.getHealthRecords();
                      if (result.records && result.records.length > 0) {
                        // In a real app, you'd save these to the database
                        // For now, we'll just display them
                        setRecords(result.records);
                      }
                    } catch (error) {
                      console.error('Error fetching health records:', error);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
                >
                  📥 Fetch from ABHA
                </button>
              )}
              <a
                href="/records/upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                + Upload Record
              </a>
            </div>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : records.length === 0 ? (
              <div className="text-center py-12 bg-card border border-border rounded-lg">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No health records yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {records.map((record) => (
                  <div
                    key={record._id}
                    className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{record.title}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {record.recordType.replace("_", " ")}
                        </p>
                        {record.doctor && (
                          <p className="text-sm text-body mt-2">
                            Dr. {record.doctor.name} • {record.doctor.hospital}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {new Date(record.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <div>
            <div className="mb-6">
              <a
                href="/appointments/book"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                + Book Appointment
              </a>
            </div>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-12 bg-card border border-border rounded-lg">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No appointments scheduled</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div
                    key={apt._id}
                    className={`bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow ${
                      apt.status === "completed" ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">{apt.reason}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                            apt.status === "scheduled"
                              ? "bg-blue-100 text-blue-700"
                              : apt.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                        {apt.doctor && (
                          <p className="text-sm text-body">Doctor: {apt.doctor}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          {new Date(apt.appointmentDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(apt.appointmentDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
