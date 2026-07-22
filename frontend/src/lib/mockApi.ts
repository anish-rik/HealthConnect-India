import seedData from './patients.seed.json';

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  abhaId: string;
  gender: string;
  dateOfBirth: string;
  address: string;
}

const DEMO_PATIENTS: DemoUser[] = seedData.patients.map((p: any) => ({
  id: p.id,
  name: p.name,
  email: `${p.id.toLowerCase()}@example.com`,
  phone: p.phone.replace(/x/g, '0'),
  abhaId: p.abhaId,
  gender: p.gender,
  dateOfBirth: `${new Date().getFullYear() - p.age}-01-01`,
  address: p.location,
}));

// Default demo user if credentials match none
const DEFAULT_USER = DEMO_PATIENTS[0]; // Suresh Rao

export async function handleMockRequest(endpoint: string, options: any = {}, currentToken?: string | null) {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};

  console.log(`[Demo Mode Mock] ${method} ${endpoint}`, body);

  // 1. AUTH: Login (Phone / Password) or ABHA Login
  if (endpoint.startsWith('/auth/login')) {
    const inputIdentifier = (body.phone || body.abhaId || '').replace(/[\s+-]/g, '');
    const found = DEMO_PATIENTS.find(
      (p) => {
        const cleanPhone = p.phone.replace(/[\s+-]/g, '');
        const cleanInput = inputIdentifier;
        return (
          cleanPhone === cleanInput ||
          cleanPhone.endsWith(cleanInput) ||
          cleanInput.endsWith(cleanPhone) ||
          p.abhaId === inputIdentifier ||
          p.abhaId === (body.abhaId || '') ||
          p.id.toLowerCase() === inputIdentifier.toLowerCase()
        );
      }
    );

    const user = found || DEFAULT_USER;
    const token = `mock-token-${user.id}`;
    localStorage.setItem('authToken', token);
    localStorage.setItem('mock_user_id', user.id);

    return {
      success: true,
      message: 'Login successful (Demo Mode)',
      data: {
        token,
        user: { id: user.id, email: user.email, name: user.name, role: 'user' as const },
      },
    };
  }

  // Determine active mock user from token or localStorage
  let activeUserId = localStorage.getItem('mock_user_id') || 'P001';
  if (currentToken && currentToken.startsWith('mock-token-')) {
    activeUserId = currentToken.replace('mock-token-', '');
  }

  let activeUser = DEMO_PATIENTS.find((p) => p.id === activeUserId) || DEFAULT_USER;
  let rawPatientData = seedData.patients.find((p: any) => p.id === activeUser.id) || seedData.patients[0];

  // 2. AUTH: Profile
  if (endpoint === '/auth/profile') {
    return {
      success: true,
      data: activeUser,
    };
  }

  // 3. RECORDS: List
  if (endpoint === '/records' && method === 'GET') {
    const baseRecords = rawPatientData.timeline.map((evt: any, index: number) => ({
      _id: `rec-${rawPatientData.id}-${index}`,
      recordType:
        evt.type === 'DischargeSummary'
          ? 'discharge_summary'
          : evt.type === 'DiagnosticReport'
          ? 'diagnostic_report'
          : 'visit_summary',
      title: evt.summary || evt.type,
      description: evt.summary,
      date: evt.date,
      doctor: {
        name: evt.doctorName || 'Dr. Manjunath',
        hospital: evt.facilityName || 'Health Center',
      },
      diagnosis: evt.diagnosis ? evt.diagnosis.join(', ') : '',
      medicines: evt.prescriptions
        ? evt.prescriptions.map((p: string) => ({ name: p, dosage: 'As prescribed', frequency: 'OD', duration: '5 days' }))
        : [],
      labTests: evt.tests
        ? evt.tests.map((t: any) => ({ testName: t.name, result: t.value, normalRange: '', unit: '' }))
        : [],
    }));

    // Add local uploaded records if any
    const localCustomRecords = JSON.parse(localStorage.getItem(`custom_records_${activeUser.id}`) || '[]');

    return {
      success: true,
      data: [...localCustomRecords, ...baseRecords],
    };
  }

  // 4. RECORDS: Create
  if (endpoint === '/records' && method === 'POST') {
    const newRecord = {
      _id: `rec-custom-${Date.now()}`,
      recordType: body.recordType || 'visit_summary',
      title: body.title || 'Uploaded Medical Record',
      description: body.description || '',
      date: body.date || new Date().toISOString(),
      doctor: body.doctor || { name: 'Self Uploaded', hospital: 'Personal' },
    };

    const existing = JSON.parse(localStorage.getItem(`custom_records_${activeUser.id}`) || '[]');
    localStorage.setItem(`custom_records_${activeUser.id}`, JSON.stringify([newRecord, ...existing]));

    return {
      success: true,
      message: 'Record created (Demo Mode)',
      data: newRecord,
    };
  }

  // 5. APPOINTMENTS: List
  if (endpoint === '/appointments' && method === 'GET') {
    const baseAppointments = [
      {
        _id: 'apt-1',
        appointmentDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        doctor: 'Dr. Anita Desai (Cardiology)',
        reason: 'Regular Follow-up',
        status: 'scheduled',
      },
      {
        _id: 'apt-2',
        appointmentDate: new Date(Date.now() - 86400000 * 10).toISOString(),
        doctor: 'Dr. Manjunath (General Medicine)',
        reason: 'Routine Health Checkup',
        status: 'completed',
      },
    ];

    const localApts = JSON.parse(localStorage.getItem(`custom_apts_${activeUser.id}`) || '[]');

    return {
      success: true,
      data: [...localApts, ...baseAppointments],
    };
  }

  // 6. APPOINTMENTS: Create
  if (endpoint === '/appointments' && method === 'POST') {
    const newApt = {
      _id: `apt-${Date.now()}`,
      appointmentDate: body.appointmentDate || new Date().toISOString(),
      doctor: body.doctor || 'Dr. HealthConnect Specialist',
      reason: body.reason || 'Consultation',
      status: 'scheduled',
    };

    const existing = JSON.parse(localStorage.getItem(`custom_apts_${activeUser.id}`) || '[]');
    localStorage.setItem(`custom_apts_${activeUser.id}`, JSON.stringify([newApt, ...existing]));

    return {
      success: true,
      message: 'Appointment booked (Demo Mode)',
      data: newApt,
    };
  }

  // 7. ABHA: Status
  if (endpoint === '/abha/status') {
    return {
      success: true,
      data: {
        isLinked: true,
        abhaId: activeUser.abhaId,
        user: activeUser,
      },
    };
  }

  // 8. SHARE: Generate
  if (endpoint === '/share/generate') {
    const token = `share-${Math.random().toString(36).substring(2, 10)}`;
    const expiresAt = new Date(Date.now() + (body.expiryHours || 24) * 3600000).toISOString();
    const shareUrl = `${window.location.origin}/share/${token}`;

    const shareInfo = {
      token,
      shareUrl,
      expiresAt,
      userId: activeUser.id,
      recordId: body.recordId || null,
    };

    localStorage.setItem(`share_token_${token}`, JSON.stringify(shareInfo));

    return {
      success: true,
      data: shareInfo,
    };
  }

  // 9. SHARE: List active tokens
  if (endpoint === '/share/my-tokens' && method === 'GET') {
    // Collect all share tokens stored by the generate mock
    const tokens: any[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('share_token_')) {
        try {
          const parsed = JSON.parse(localStorage.getItem(key) || '{}');
          // Only return tokens belonging to the active user that haven't expired
          if (parsed.userId === activeUser.id && new Date(parsed.expiresAt) > new Date()) {
            tokens.push({
              id: parsed.token,           // use token string as id in demo mode
              token: parsed.token,
              shareUrl: parsed.shareUrl,
              label: parsed.recordId ? 'Specific Record Share' : 'Medical History QR',
              expiresAt: parsed.expiresAt,
              accessCount: 0,
              createdAt: new Date().toISOString(),
            });
          }
        } catch (_) {
          // skip malformed entries
        }
      }
    }
    return { success: true, data: tokens };
  }

  // 10. SHARE: Revoke token
  if (endpoint.startsWith('/share/') && method === 'DELETE') {
    const tokenId = endpoint.replace('/share/', '');
    localStorage.removeItem(`share_token_${tokenId}`);
    return { success: true, message: 'Token revoked' };
  }

  // 11. SHARE: Public Timeline
  if (endpoint.startsWith('/share/public/')) {
    const token = endpoint.replace('/share/public/', '');
    const savedToken = localStorage.getItem(`share_token_${token}`);
    let targetUser = activeUser;
    let targetPatientData = rawPatientData;
    let singleRecordId: string | null = null;

    if (savedToken) {
      const parsed = JSON.parse(savedToken);
      singleRecordId = parsed.recordId;
      const match = DEMO_PATIENTS.find((p) => p.id === parsed.userId);
      if (match) {
        targetUser = match;
        targetPatientData = seedData.patients.find((p: any) => p.id === match.id) || seedData.patients[0];
      }
    }

    let timeline = targetPatientData.timeline.map((evt: any, index: number) => ({
      id: `rec-${targetPatientData.id}-${index}`,
      type:
        evt.type === 'DischargeSummary'
          ? 'discharge_summary'
          : evt.type === 'DiagnosticReport'
          ? 'diagnostic_report'
          : 'visit_summary',
      title: evt.summary || evt.type,
      description: evt.summary,
      date: evt.date,
      doctor: {
        name: evt.doctorName || 'Dr. Manjunath',
        hospital: evt.facilityName || 'Health Center',
      },
      diagnosis: evt.diagnosis ? evt.diagnosis.join(', ') : '',
      medicines: evt.prescriptions
        ? evt.prescriptions.map((p: string) => ({ name: p, dosage: 'As prescribed', frequency: 'OD', duration: '5 days' }))
        : [],
      labTests: evt.tests
        ? evt.tests.map((t: any) => ({ testName: t.name, result: t.value, normalRange: '', unit: '' }))
        : [],
    }));

    if (singleRecordId) {
      timeline = timeline.filter((t: any) => t.id === singleRecordId);
    }

    return {
      success: true,
      data: {
        patient: {
          name: targetUser.name,
          gender: targetUser.gender,
          dateOfBirth: targetUser.dateOfBirth,
          abhaId: targetUser.abhaId,
        },
        recordCount: timeline.length,
        timeline,
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
      },
    };
  }

  // Fallback for any unhandled mock request
  return {
    success: true,
    data: [],
  };
}
