const axios = require('axios');
const crypto = require('crypto');

/**
 * ABDM V3 Integration Service
 *
 * Handles all communication with the Ayushman Bharat Digital Mission (ABDM)
 * Health Information Exchange & Consent Manager (HIECM) Gateway.
 *
 * Sandbox docs: https://sandbox.abdm.gov.in/
 * V3 base:      https://dev.abdm.gov.in/api/hiecm/gateway/v3
 */
class ABDMService {
  constructor() {
    // V3 sandbox base URL (override via env for production)
    this.baseURL =
      process.env.ABDM_BASE_URL ||
      'https://dev.abdm.gov.in/api/hiecm/gateway/v3';

    this.clientId = process.env.ABHA_CLIENT_ID;
    this.clientSecret = process.env.ABHA_CLIENT_SECRET;

    // Auto-enable mock when credentials are missing
    this.useMock =
      process.env.ABDM_USE_MOCK === 'true' ||
      !this.clientId ||
      !this.clientSecret;

    // Consent Manager ID: 'sbx' for sandbox, 'abdm' for production
    this.cmId = process.env.ABDM_CM_ID || 'sbx';

    this.accessToken = null;
    this.tokenExpiry = null;
  }

  // ---------------------------------------------------------------------------
  //  Helpers
  // ---------------------------------------------------------------------------

  sanitizeAbhaNumber(abhaNumber) {
    return String(abhaNumber || '').replace(/\D/g, '');
  }

  isConfigured() {
    return !!(this.clientId && this.clientSecret && this.baseURL && !this.useMock);
  }

  /** Generate the mandatory V3 gateway headers. */
  getHeaders(token) {
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-CM-ID': this.cmId,
      'REQUEST-ID': crypto.randomUUID(),
      TIMESTAMP: new Date().toISOString(),
    };
  }

  // ---------------------------------------------------------------------------
  //  Authentication (V3 sessions endpoint)
  // ---------------------------------------------------------------------------

  async getAccessToken() {
    if (!this.isConfigured()) {
      throw new Error('ABDM credentials are not configured');
    }

    // Return cached token if still valid (tokens last ~600s, refresh at 550s)
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(`${this.baseURL}/sessions`, {
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        grantType: 'client_credentials',
      });

      const token =
        response.data.accessToken ||
        response.data.token ||
        response.data.session?.accessToken;

      if (!token) {
        throw new Error('ABDM session token missing from response');
      }

      this.accessToken = token;
      // Refresh 50 seconds before the typical 600s expiry
      this.tokenExpiry = Date.now() + 550 * 1000;
      return this.accessToken;
    } catch (error) {
      console.error(
        'Error getting ABDM access token:',
        error.response?.data || error.message || error
      );
      throw new Error('Failed to authenticate with ABDM');
    }
  }

  // ---------------------------------------------------------------------------
  //  ABHA Verification
  // ---------------------------------------------------------------------------

  async verifyABHA(abhaNumber) {
    const sanitized = this.sanitizeAbhaNumber(abhaNumber);

    if (!/^\d{14}$/.test(sanitized)) {
      return { exists: false, error: 'Invalid ABHA number format' };
    }

    if (!this.isConfigured()) {
      return this.mockVerifyABHA(sanitized);
    }

    try {
      const token = await this.getAccessToken();
      const response = await axios.get(
        `${this.baseURL}/users/${sanitized}`,
        { headers: this.getHeaders(token) }
      );

      return { exists: true, user: response.data };
    } catch (error) {
      if (error.response?.status === 404) {
        return { exists: false };
      }
      console.error(
        'Error verifying ABHA:',
        error.response?.data || error.message || error
      );
      throw new Error('Failed to verify ABHA number');
    }
  }

  // ---------------------------------------------------------------------------
  //  Consent Management (V3)
  // ---------------------------------------------------------------------------

  async createConsentRequest(abhaNumber, requesterId, purpose = 'LINK') {
    const sanitized = this.sanitizeAbhaNumber(abhaNumber);

    if (!/^\d{14}$/.test(sanitized)) {
      throw new Error('Invalid ABHA number format');
    }

    if (!this.isConfigured()) {
      return this.mockCreateConsentRequest(sanitized, requesterId);
    }

    try {
      const token = await this.getAccessToken();

      const consentRequest = {
        patient: {
          id: sanitized,
          type: 'ABHA',
        },
        requester: {
          id: requesterId,
          name: 'HealthConnect India',
          type: 'HIU',
        },
        purpose: {
          code: purpose,
          text: 'Access health records for patient portal',
        },
        hiTypes: [
          'Prescription',
          'DiagnosticReport',
          'OPConsultation',
          'DischargeSummary',
        ],
        permission: {
          accessMode: 'VIEW',
          dateRange: {
            from: new Date().toISOString().split('T')[0],
            to: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split('T')[0],
          },
          dataEraseAt: new Date(
            Date.now() + 365 * 24 * 60 * 60 * 1000
          ).toISOString(),
          frequency: {
            unit: 'HOUR',
            value: 1,
            repeats: 0,
          },
        },
      };

      const response = await axios.post(
        `${this.baseURL}/consent-requests/init`,
        consentRequest,
        { headers: this.getHeaders(token) }
      );

      return response.data;
    } catch (error) {
      console.error(
        'Error creating consent request:',
        error.response?.data || error.message || error
      );
      throw new Error('Failed to create consent request');
    }
  }

  async getConsentStatus(consentId) {
    if (!this.isConfigured()) {
      return this.mockGetConsentStatus(consentId);
    }

    try {
      const token = await this.getAccessToken();
      const response = await axios.get(
        `${this.baseURL}/consent-requests/${consentId}`,
        { headers: this.getHeaders(token) }
      );

      return response.data;
    } catch (error) {
      console.error(
        'Error getting consent status:',
        error.response?.data || error.message || error
      );
      throw new Error('Failed to get consent status');
    }
  }

  // ---------------------------------------------------------------------------
  //  Health Records Fetch (V3)
  // ---------------------------------------------------------------------------

  async fetchHealthRecords(consentId) {
    if (!this.isConfigured()) {
      return this.mockFetchHealthRecords(consentId);
    }

    try {
      const token = await this.getAccessToken();
      const response = await axios.post(
        `${this.baseURL}/health-information/request`,
        { consentId },
        { headers: this.getHeaders(token) }
      );

      return response.data;
    } catch (error) {
      console.error(
        'Error fetching health records:',
        error.response?.data || error.message || error
      );
      throw new Error('Failed to fetch health records');
    }
  }

  // ---------------------------------------------------------------------------
  //  Mock Implementations (used when ABDM credentials are missing)
  // ---------------------------------------------------------------------------

  async mockVerifyABHA(abhaNumber) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!/^\d{14}$/.test(abhaNumber)) {
      return { exists: false, error: 'Invalid ABHA number format' };
    }

    const mockValidABHA = [
      '12345678901234',
      '98765432109876',
      '11111111111111',
    ];
    const exists = mockValidABHA.includes(abhaNumber);

    if (exists) {
      return {
        exists: true,
        user: {
          id: abhaNumber,
          name: 'Mock Patient',
          gender: 'M',
          dateOfBirth: '1990-01-01',
        },
      };
    }

    return { exists: false };
  }

  async mockCreateConsentRequest(abhaNumber, requesterId) {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      consentId: `consent_${Date.now()}`,
      status: 'PENDING',
      patientId: abhaNumber,
      requesterId,
      createdAt: new Date().toISOString(),
    };
  }

  async mockGetConsentStatus(consentId) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      consentId,
      status: 'PENDING',
      updatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  async mockFetchHealthRecords(consentId) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return {
      consentId,
      records: [
        {
          id: 'rec_001',
          type: 'Prescription',
          title: 'Blood Pressure Medication',
          date: '2024-01-15',
          doctor: 'Dr. Sharma',
          hospital: 'City Hospital',
          content: 'Prescribed Amlodipine 5mg daily for hypertension',
        },
        {
          id: 'rec_002',
          type: 'DiagnosticReport',
          title: 'Blood Test Report',
          date: '2024-01-10',
          doctor: 'Dr. Patel',
          hospital: 'Lab Diagnostics',
          content: 'Hemoglobin: 14.2 g/dL, Glucose: 95 mg/dL',
        },
        {
          id: 'rec_003',
          type: 'OPConsultation',
          title: 'General Consultation',
          date: '2024-01-05',
          doctor: 'Dr. Mehta',
          hospital: 'City Hospital',
          content:
            'Patient complained of headache. Prescribed pain relief medication.',
        },
      ],
    };
  }
}

module.exports = new ABDMService();
