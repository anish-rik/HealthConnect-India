const axios = require('axios');

class ABDMService {
  constructor() {
    this.baseURL = process.env.ABDM_BASE_URL || 'https://api.abdm.gov.in/v1';
    this.clientId = process.env.ABHA_CLIENT_ID;
    this.clientSecret = process.env.ABHA_CLIENT_SECRET;
    this.useMock = process.env.ABDM_USE_MOCK === 'true';
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  sanitizeAbhaNumber(abhaNumber) {
    return String(abhaNumber || '').replace(/\D/g, '');
  }

  isConfigured() {
    return !!(this.clientId && this.clientSecret && this.baseURL && !this.useMock);
  }

  getHeaders(token) {
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getAccessToken() {
    if (!this.isConfigured()) {
      throw new Error('ABDM credentials are not configured');
    }

    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(`${this.baseURL}/gateway/v0.5/sessions`, {
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        grantType: 'client_credentials',
      });

      const token = response.data.accessToken || response.data.token || response.data.session?.accessToken;
      if (!token) {
        throw new Error('ABDM session token missing from response');
      }

      this.accessToken = token;
      this.tokenExpiry = Date.now() + 55 * 60 * 1000;
      return this.accessToken;
    } catch (error) {
      console.error('Error getting ABDM access token:', error.response?.data || error.message || error);
      throw new Error('Failed to authenticate with ABDM');
    }
  }

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
      const response = await axios.get(`${this.baseURL}/gateway/v0.5/users/${sanitized}`, {
        headers: this.getHeaders(token),
      });

      return { exists: true, user: response.data };
    } catch (error) {
      if (error.response?.status === 404) {
        return { exists: false };
      }
      console.error('Error verifying ABHA:', error.response?.data || error.message || error);
      throw new Error('Failed to verify ABHA number');
    }
  }

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
        hiTypes: ['Prescription', 'DiagnosticReport', 'OPConsultation', 'DischargeSummary'],
        permission: {
          accessMode: 'VIEW',
          dateRange: {
            from: new Date().toISOString().split('T')[0],
            to: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          },
          dataEraseAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          frequency: {
            unit: 'HOUR',
            value: 1,
            repeats: 0,
          },
        },
      };

      const response = await axios.post(`${this.baseURL}/gateway/v0.5/consent-requests`, consentRequest, {
        headers: this.getHeaders(token),
      });

      return response.data;
    } catch (error) {
      console.error('Error creating consent request:', error.response?.data || error.message || error);
      throw new Error('Failed to create consent request');
    }
  }

  async getConsentStatus(consentId) {
    if (!this.isConfigured()) {
      throw new Error('ABDM credentials are not configured');
    }

    try {
      const token = await this.getAccessToken();
      const response = await axios.get(`${this.baseURL}/gateway/v0.5/consent-requests/${consentId}`, {
        headers: this.getHeaders(token),
      });

      return response.data;
    } catch (error) {
      console.error('Error getting consent status:', error.response?.data || error.message || error);
      throw new Error('Failed to get consent status');
    }
  }

  async fetchHealthRecords(consentId) {
    if (!this.isConfigured()) {
      return this.mockFetchHealthRecords(consentId);
    }

    try {
      const token = await this.getAccessToken();
      const response = await axios.get(`${this.baseURL}/gateway/v0.5/health-information/${consentId}`, {
        headers: this.getHeaders(token),
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching health records:', error.response?.data || error.message || error);
      throw new Error('Failed to fetch health records');
    }
  }

  async mockVerifyABHA(abhaNumber) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!/^\d{14}$/.test(abhaNumber)) {
      return { exists: false, error: 'Invalid ABHA number format' };
    }

    const mockValidABHA = ['12345678901234', '98765432109876', '11111111111111'];
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
          content: 'Patient complained of headache. Prescribed pain relief medication.',
        },
      ],
    };
  }
}

module.exports = new ABDMService();
