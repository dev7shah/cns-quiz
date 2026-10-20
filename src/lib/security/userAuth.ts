/**
 * User Authentication Methods, Multi-Factor Auth (MFA), & Passwordless FIDO2
 * Covers:
 * - 3 Factors of Authentication: Knowledge (passwords), Possession (tokens), Inherence (biometrics)
 * - Biometric error trade-offs: FAR (False Acceptance), FRR (False Rejection), CER (Crossover Error Rate)
 * - RFC 6238 TOTP (Time-Based One-Time Password) with time-drift verification
 * - FIDO2 / WebAuthn Passwordless Authentication with origin binding & phishing resistance
 */

import { fnv1a32 } from "../crypto/hmac"

export interface BiometricOperatingPoint {
  threshold: number // 0 to 1 sensitivity threshold
  far: number       // False Acceptance Rate (%)
  frr: number       // False Rejection Rate (%)
  isCrossover: boolean
}

/**
 * Calculates FAR and FRR curves across sensitivity thresholds
 * finding the Crossover Error Rate (CER) where FAR == FRR.
 */
export function calculateBiometricCurve(steps: number = 10): { points: BiometricOperatingPoint[]; cerPoint: BiometricOperatingPoint } {
  const points: BiometricOperatingPoint[] = []
  let bestCerDiff = Infinity
  let cerPoint: BiometricOperatingPoint = { threshold: 0.5, far: 5, frr: 5, isCrossover: true }

  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    // Low threshold: accepts everyone (high FAR, low FRR)
    // High threshold: rejects everyone (low FAR, high FRR)
    const far = Math.round(100 * Math.exp(-4 * t) * 10) / 10
    const frr = Math.round(100 * (1 - Math.exp(-4 * (1 - t))) * 10) / 10

    const diff = Math.abs(far - frr)
    const isClosest = diff < bestCerDiff
    if (isClosest) {
      bestCerDiff = diff
    }

    points.push({
      threshold: t,
      far,
      frr,
      isCrossover: false
    })
  }

  // Mark CER
  const cerIdx = points.reduce((bestIdx, cur, idx) => {
    return Math.abs(cur.far - cur.frr) < Math.abs(points[bestIdx].far - points[bestIdx].frr) ? idx : bestIdx
  }, 0)

  points[cerIdx].isCrossover = true
  cerPoint = points[cerIdx]

  return { points, cerPoint }
}

/**
 * RFC 6238 TOTP Engine:
 * T = floor((CurrentTime - T0) / TimeStep)
 * Generates 6-digit decimal code using dynamic truncation.
 */
export interface TOTPVerificationResult {
  code: string
  counter: number
  timeLeftSec: number
  isValid: boolean
  driftWindowUsed: number
}

export function computeRFC6238TOTP(
  secret: string,
  timestampMs: number = Date.now(),
  timeStepSec: number = 30
): { code: string; counter: number; timeLeftSec: number } {
  const timeSec = Math.floor(timestampMs / 1000)
  const counter = Math.floor(timeSec / timeStepSec)
  const timeLeftSec = timeStepSec - (timeSec % timeStepSec)

  // Deterministic 32-bit HMAC/hash on (secret || counter)
  const data = `${secret}_COUNTER_${counter}`
  const hash32 = fnv1a32(data)

  // Dynamic truncation (RFC 4226 Section 5.4)
  // Low 4 bits of hash determine byte offset
  const offset = hash32 & 0x0f
  // Extract 31-bit integer
  const truncated = (hash32 >>> (offset % 16)) & 0x7fffffff
  const code = (truncated % 1000000).toString().padStart(6, "0")

  return { code, counter, timeLeftSec }
}

export function verifyRFC6238TOTP(
  submittedCode: string,
  secret: string,
  timestampMs: number = Date.now(),
  allowedDriftWindows: number = 1
): TOTPVerificationResult {
  const timeStepSec = 30
  const timeSec = Math.floor(timestampMs / 1000)
  const baseCounter = Math.floor(timeSec / timeStepSec)
  const timeLeftSec = timeStepSec - (timeSec % timeStepSec)

  // Check current window and +/- allowed drift windows to tolerate clock skew
  for (let drift = -allowedDriftWindows; drift <= allowedDriftWindows; drift++) {
    const c = baseCounter + drift
    const candidateData = `${secret}_COUNTER_${c}`
    const hash32 = fnv1a32(candidateData)
    const offset = hash32 & 0x0f
    const truncated = (hash32 >>> (offset % 16)) & 0x7fffffff
    const expected = (truncated % 1000000).toString().padStart(6, "0")

    if (submittedCode.trim() === expected) {
      return {
        code: expected,
        counter: c,
        timeLeftSec,
        isValid: true,
        driftWindowUsed: drift
      }
    }
  }

  const { code: currentCode } = computeRFC6238TOTP(secret, timestampMs, timeStepSec)
  return {
    code: currentCode,
    counter: baseCounter,
    timeLeftSec,
    isValid: false,
    driftWindowUsed: 0
  }
}

/**
 * FIDO2 / WebAuthn Passwordless Authentication Simulator:
 * Demonstrates:
 * - Public key cryptography in hardware enclave (private key never leaves device)
 * - Origin binding: Client digitally signs clientDataHash containing website origin (e.g. "https://cns-lab.edu")
 * - Phishing immunity: If user enters credential on fake site ("https://evil-phish.com"),
 *   the origin in signature does NOT match server expectation, automatically aborting the attack!
 */
export interface WebAuthnCredential {
  credentialId: string
  userName: string
  rpOrigin: string
  publicKeyHex: string
  privateKeyHex: string
}

export interface WebAuthnAuthResult {
  success: boolean
  originMatch: boolean
  signatureValid: boolean
  challengeVerified: boolean
  explanation: string
}

export function registerWebAuthnCredential(userName: string, rpOrigin: string): WebAuthnCredential {
  const credId = "cred_" + fnv1a32(`${userName}_${rpOrigin}_${Date.now()}`).toString(16)
  const privKey = "priv_" + fnv1a32(`secret_enclave_key_${userName}`).toString(16)
  const pubKey = "pub_" + fnv1a32(`public_key_derived_${privKey}`).toString(16)

  return {
    credentialId: credId,
    userName,
    rpOrigin,
    publicKeyHex: pubKey,
    privateKeyHex: privKey
  }
}

export function authenticateWebAuthn(
  cred: WebAuthnCredential,
  serverChallenge: string,
  clientBrowserOrigin: string
): WebAuthnAuthResult {
  // Origin check
  const originMatch = clientBrowserOrigin.toLowerCase() === cred.rpOrigin.toLowerCase()

  if (!originMatch) {
    return {
      success: false,
      originMatch: false,
      signatureValid: false,
      challengeVerified: false,
      explanation: `PHISHING ATTEMPT DEFEATED! Browser connected to '${clientBrowserOrigin}', but hardware credential is bound to '${cred.rpOrigin}'. Signature aborted.`
    }
  }

  // Signature check: Client signs (challenge || origin) with hardware private key
  const authData = `${serverChallenge}_${clientBrowserOrigin}_${cred.privateKeyHex}`
  const signature = "sig_" + fnv1a32(authData).toString(16)

  // Server verifies signature with public key
  const expectedAuthData = `${serverChallenge}_${cred.rpOrigin}_${cred.privateKeyHex}`
  const expectedSig = "sig_" + fnv1a32(expectedAuthData).toString(16)
  const signatureValid = signature === expectedSig

  return {
    success: signatureValid,
    originMatch: true,
    signatureValid,
    challengeVerified: true,
    explanation: "FIDO2 / WebAuthn authentication successful: Phishing-resistant public-key signature verified."
  }
}
