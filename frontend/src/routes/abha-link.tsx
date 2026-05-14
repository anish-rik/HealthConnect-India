import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useNavigate } from "@tanstack/react-router";
import { apiClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle, Link as LinkIcon } from "lucide-react";

export const Route = createFileRoute("/abha-link")({
  component: ABHALinkPage,
});

function ABHALinkPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [abhaNumber, setAbhaNumber] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [isRequestingConsent, setIsRequestingConsent] = useState(false);
  const [isFetchingRecords, setIsFetchingRecords] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ exists: boolean; user?: any; error?: string } | null>(null);
  const [consentRequest, setConsentRequest] = useState(null);
  const [consentStatus, setConsentStatus] = useState('UNKNOWN');
  const [records, setRecords] = useState([]);
  const [isLinked, setIsLinked] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      loadABHAStatus();
    }
  }, [isAuthenticated]);

  const loadABHAStatus = async () => {
    try {
      const response = await apiClient.abha.status();
      const status = response.data || response;
      setIsLinked(status.isLinked ?? false);
      setConsentRequest(status.consentRequest || status.consents || null);
      setConsentStatus(status.abhaConsentStatus || 'UNKNOWN');
    } catch (err) {
      console.error("Failed to load ABHA status", err);
    }
  };

  const refreshConsentStatus = async () => {
    if (!isLinked) {
      return;
    }

    try {
      const response = await apiClient.abha.getConsentStatus();
      const data = response.data || response;
      setConsentRequest(data);
      setConsentStatus(data.status || 'UNKNOWN');
    } catch (err) {
      console.error("Failed to refresh consent status", err);
    }
  };

  const handleVerify = async () => {
    if (!abhaNumber.trim()) {
      setError("Please enter your ABHA number");
      return;
    }

    setError("");
    setVerificationResult(null);
    setIsVerifying(true);

    try {
      const response = await apiClient.abha.verify(abhaNumber);
      const data = response.data || response;
      setVerificationResult({ exists: true, user: data });
    } catch (err: any) {
      setError(err.message || "Failed to verify ABHA number");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLink = async () => {
    setError("");
    setIsLinking(true);

    try {
      await apiClient.abha.link(abhaNumber);
      setIsLinked(true);
      await loadABHAStatus();
    } catch (err: any) {
      setError(err.message || "Failed to link ABHA number");
    } finally {
      setIsLinking(false);
    }
  };

  const handleRequestConsent = async () => {
    setError("");
    setIsRequestingConsent(true);

    try {
      const response = await apiClient.abha.createConsentRequest();
      const data = response.data || response;
      setConsentRequest(data);
      setConsentStatus(data.status || 'PENDING');
    } catch (err: any) {
      setError(err.message || "Failed to request ABHA consent");
    } finally {
      setIsRequestingConsent(false);
    }
  };

  const handleFetchRecords = async () => {
    setError("");
    setIsFetchingRecords(true);

    try {
      const response = await apiClient.abha.getHealthRecords();
      const data = response.data || response;
      setRecords(data.records || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch health records");
    } finally {
      setIsFetchingRecords(false);
    }
  };

  const formatABHA = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 14);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const handleABHAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatABHA(e.target.value);
    setAbhaNumber(formatted.replace(/\s/g, ""));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading authentication…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-primary">
              <LinkIcon size={24} />
              Link Your ABHA ID
            </CardTitle>
            <CardDescription>
              Connect your Ayushman Bharat Health Account and request consent to fetch records.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {isLinked && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Your ABHA is linked. You can request consent or fetch records now.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="abha" className="text-sm font-medium">
                ABHA Number (14 digits)
              </label>
              <Input
                id="abha"
                type="text"
                placeholder="1234 5678 9012 34"
                value={formatABHA(abhaNumber)}
                onChange={handleABHAChange}
                maxLength={17}
                className="text-center text-lg tracking-wider"
              />
              <p className="text-xs text-muted-foreground">
                Enter your 14-digit ABHA number from the ABHA app.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                onClick={handleVerify}
                disabled={isVerifying || abhaNumber.length !== 14}
                className="w-full"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying…
                  </>
                ) : (
                  "Verify ABHA Number"
                )}
              </Button>

              <Button
                onClick={handleLink}
                disabled={isLinking || !verificationResult?.exists}
                variant="default"
                className="w-full"
              >
                {isLinking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Linking ABHA…
                  </>
                ) : (
                  "Link ABHA to Account"
                )}
              </Button>
            </div>

            {verificationResult && (
              <Alert className={verificationResult.exists ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                {verificationResult.exists ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={verificationResult.exists ? "text-green-800" : "text-red-800"}>
                  {verificationResult.exists
                    ? `Verified ABHA: ${verificationResult.user?.name || 'Verified patient'}`
                    : verificationResult.error || "ABHA number not found. Please check and try again."
                  }
                </AlertDescription>
              </Alert>
            )}

            {consentRequest && (
              <div className="space-y-3 p-4 rounded-lg border border-border bg-surface">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold">Consent request created</p>
                    <p className="text-sm text-muted-foreground">ID: {consentRequest.consentId || consentRequest.id}</p>
                    <p className="text-sm text-muted-foreground">Status: {consentRequest.status || consentStatus || 'PENDING'}</p>
                  </div>
                  <Button
                    onClick={refreshConsentStatus}
                    disabled={!isLinked}
                    variant="secondary"
                    className="w-full sm:w-auto"
                  >
                    Refresh Status
                  </Button>
                </div>
              </div>
            )}

            {records.length > 0 && (
              <div className="space-y-3 p-4 rounded-lg border border-border bg-surface">
                <h2 className="text-base font-semibold">Fetched Health Records</h2>
                <div className="space-y-3">
                  {records.map((record, index) => (
                    <div key={record.id || index} className="rounded-lg border border-border bg-card p-3">
                      <p className="text-sm font-semibold">{record.title || record.type}</p>
                      <p className="text-sm text-muted-foreground">{record.date}</p>
                      <p className="text-sm">{record.content || record.description || record.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                onClick={handleRequestConsent}
                disabled={!isLinked || isRequestingConsent}
                className="w-full"
              >
                {isRequestingConsent ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Requesting Consent…
                  </>
                ) : (
                  "Request ABHA Consent"
                )}
              </Button>
              <Button
                onClick={handleFetchRecords}
                disabled={!isLinked || isFetchingRecords}
                className="w-full"
              >
                {isFetchingRecords ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Fetching Records…
                  </>
                ) : (
                  "Fetch Health Records"
                )}
              </Button>
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="text-center text-sm text-muted-foreground">
              <p>Don't have an ABHA number?</p>
              <a
                href="https://abha.abdm.gov.in/abha/v3/register"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Create one at abha.abdm.gov.in
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
