/**
 * smsService.js
 * SMS OTP delivery with Fast2SMS (primary, free Indian gateway) and Twilio fallback.
 *
 * Priority:
 *   1. Fast2SMS (FAST2SMS_API_KEY set)  – free tier, works on Indian numbers
 *   2. Twilio   (TWILIO_* vars set)     – paid, works globally
 *   3. Console  (dev fallback)          – logs OTP to server console / response
 */

const axios = require('axios');

/**
 * Generate a cryptographically-adequate 6-digit OTP.
 */
function generateOtp() {
  // Use Math.random for simplicity; switch to crypto.randomInt if Node ≥ 14.10
  return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * Send an OTP via Fast2SMS (https://www.fast2sms.com).
 * Requires FAST2SMS_API_KEY in .env.
 *
 * @param {string} phone  10-digit Indian phone number
 * @param {string} otp    6-digit OTP string
 */
async function sendViaFast2SMS(phone, otp) {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) throw new Error('FAST2SMS_API_KEY not set');

  // Fast2SMS Quick SMS route (no DLT required for transactional in dev/test)
  const response = await axios.post(
    'https://www.fast2sms.com/dev/bulkV2',
    {
      route: 'otp',
      variables_values: otp,
      flash: 0,
      numbers: phone,
    },
    {
      headers: {
        authorization: apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    }
  );

  if (!response.data.return) {
    throw new Error(`Fast2SMS error: ${JSON.stringify(response.data)}`);
  }

  return { provider: 'fast2sms', messageId: response.data.request_id };
}

/**
 * Send an OTP via Twilio Verify or plain SMS.
 * Requires TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER in .env.
 *
 * @param {string} phone  E.164 phone number e.g. +919876543210
 * @param {string} otp    6-digit OTP string
 */
async function sendViaTwilio(phone, otp) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !from) throw new Error('Twilio credentials not set');

  const e164 = phone.startsWith('+') ? phone : `+91${phone}`;
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

  const params = new URLSearchParams({
    From: from,
    To: e164,
    Body: `Your HealthConnect India OTP is ${otp}. Valid for 10 minutes. Do not share with anyone.`,
  });

  const response = await axios.post(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    params.toString(),
    {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: 10000,
    }
  );

  return { provider: 'twilio', messageId: response.data.sid };
}

/**
 * Main entry point. Tries Fast2SMS → Twilio → console fallback.
 *
 * @param {string} phone  10-digit phone (without country code)
 * @param {string} otp    6-digit OTP
 * @returns {{ provider: string, messageId?: string, devMode?: boolean }}
 */
async function sendOtp(phone, otp) {
  // Try Fast2SMS first
  if (process.env.FAST2SMS_API_KEY) {
    try {
      return await sendViaFast2SMS(phone, otp);
    } catch (err) {
      console.warn('[smsService] Fast2SMS failed, trying Twilio:', err.message);
    }
  }

  // Try Twilio
  if (process.env.TWILIO_ACCOUNT_SID) {
    try {
      return await sendViaTwilio(phone, otp);
    } catch (err) {
      console.warn('[smsService] Twilio failed:', err.message);
    }
  }

  // Dev console fallback — OTP is logged and (in dev) returned in response body
  console.log(`[smsService] ⚠️  DEV MODE — OTP for +91${phone}: ${otp}`);
  return { provider: 'console', devMode: true };
}

module.exports = { generateOtp, sendOtp };
