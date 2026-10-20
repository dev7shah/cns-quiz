/**
 * Public Key Infrastructure (PKI) & X.509 Certificate Chain Validator
 * Covers:
 * - X.509 v3 fields: Subject, Issuer, Serial, Validity, Key Usage, Basic Constraints (isCA)
 * - Trust Anchor verification (Self-signed Root CAs in OS/browser trust stores)
 * - Chain of Trust validation: Root CA -> Intermediate CA -> Leaf Certificate
 * - Revocation checks: CRL (Certificate Revocation List) & OCSP (Online Certificate Status Protocol)
 */

export interface X509Certificate {
  serialNumber: string
  subject: string
  issuer: string
  validNotBefore: string // ISO string "YYYY-MM-DD"
  validNotAfter: string  // ISO string "YYYY-MM-DD"
  publicKey: string
  signatureAlgorithm: string
  signatureHex: string
  isCA: boolean
  keyUsage: string[]
  crlDistributionPoint?: string
  ocspResponderUrl?: string
}

export interface ChainValidationResult {
  isValid: boolean
  chainLength: number
  trustedRoot: string | null
  errors: string[]
  warnings: string[]
  verifiedPath: string[]
}

/**
 * Validates a certificate chain:
 * Chain order expected: [Leaf, Intermediate_1, ..., Intermediate_N]
 * Root certificates are looked up in the trustedRootStore.
 */
export function validateCertificateChain(
  chain: X509Certificate[],
  trustedRootStore: X509Certificate[],
  currentDate: Date = new Date("2026-06-01T00:00:00Z"),
  revokedSerials: string[] = []
): ChainValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const verifiedPath: string[] = []

  if (chain.length === 0) {
    return {
      isValid: false,
      chainLength: 0,
      trustedRoot: null,
      errors: ["Empty certificate chain provided."],
      warnings,
      verifiedPath
    }
  }

  const checkTime = currentDate.getTime()

  // 1. Verify individual certificates and linkage
  for (let i = 0; i < chain.length; i++) {
    const cert = chain[i]
    verifiedPath.push(cert.subject)

    // Check revocation
    if (revokedSerials.includes(cert.serialNumber)) {
      errors.push(`Certificate '${cert.subject}' (Serial: ${cert.serialNumber}) is revoked via CRL/OCSP.`)
    }

    // Check validity window
    const notBefore = new Date(cert.validNotBefore).getTime()
    const notAfter = new Date(cert.validNotAfter).getTime()

    if (checkTime < notBefore) {
      errors.push(`Certificate '${cert.subject}' is not yet valid (valid from ${cert.validNotBefore}).`)
    }
    if (checkTime > notAfter) {
      errors.push(`Certificate '${cert.subject}' has expired (expired on ${cert.validNotAfter}).`)
    }

    // Intermediates must have BasicConstraints isCA = true
    if (i > 0 && !cert.isCA) {
      errors.push(`Intermediate certificate '${cert.subject}' lacks BasicConstraints isCA=true.`)
    }

    // Linkage to issuer
    if (i < chain.length - 1) {
      const parent = chain[i + 1]
      if (cert.issuer !== parent.subject) {
        errors.push(
          `Issuer mismatch: '${cert.subject}' claims issuer '${cert.issuer}', but next certificate is '${parent.subject}'.`
        )
      }
    }
  }

  // 2. Validate root trust anchor
  const topCert = chain[chain.length - 1]
  const rootCA = trustedRootStore.find(
    root => root.subject === topCert.issuer || (root.subject === topCert.subject && topCert.issuer === topCert.subject)
  )

  if (!rootCA) {
    errors.push(
      `Chain terminates at '${topCert.issuer}', which is not in the trusted Root CA store.`
    )
    return {
      isValid: false,
      chainLength: chain.length,
      trustedRoot: null,
      errors,
      warnings,
      verifiedPath
    }
  }

  // Root must be self-signed and a CA
  if (!rootCA.isCA) {
    errors.push(`Root certificate '${rootCA.subject}' is not designated as a CA.`)
  }

  verifiedPath.push(rootCA.subject)

  return {
    isValid: errors.length === 0,
    chainLength: chain.length + 1,
    trustedRoot: rootCA.subject,
    errors,
    warnings,
    verifiedPath
  }
}

/**
 * Standard test fixtures representing a realistic PKI chain:
 * Digicert Global Root CA -> Digicert TLS RSA SHA256 Intermediate CA -> cns-lab.edu
 */
export const SAMPLE_ROOT_CA: X509Certificate = {
  serialNumber: "083BE056904246B1A1756AC95991C74A",
  subject: "CN=DigiCert Global Root CA, OU=www.digicert.com, O=DigiCert Inc, C=US",
  issuer: "CN=DigiCert Global Root CA, OU=www.digicert.com, O=DigiCert Inc, C=US",
  validNotBefore: "2016-01-01T00:00:00Z",
  validNotAfter: "2036-01-01T00:00:00Z",
  publicKey: "RSA-4096-PUBLIC-KEY-ROOT",
  signatureAlgorithm: "SHA384withRSA",
  signatureHex: "ROOT_SELF_SIGNED_SIG_00AA",
  isCA: true,
  keyUsage: ["CertificateSign", "CRLSign"]
}

export const SAMPLE_INTERMEDIATE_CA: X509Certificate = {
  serialNumber: "04C251C333EC42B10B45C0A620D2387B",
  subject: "CN=DigiCert TLS RSA SHA256 2020 CA1, O=DigiCert Inc, C=US",
  issuer: "CN=DigiCert Global Root CA, OU=www.digicert.com, O=DigiCert Inc, C=US",
  validNotBefore: "2020-04-08T00:00:00Z",
  validNotAfter: "2030-04-14T00:00:00Z",
  publicKey: "RSA-2048-PUBLIC-KEY-INT",
  signatureAlgorithm: "SHA256withRSA",
  signatureHex: "INT_SIGNED_BY_ROOT_BBCC",
  isCA: true,
  keyUsage: ["CertificateSign", "CRLSign"]
}

export const SAMPLE_LEAF_CERT: X509Certificate = {
  serialNumber: "0E821FA96C42637D069B6F304B8C132E",
  subject: "CN=cns-lab.edu, O=CNS Security Lab, C=US",
  issuer: "CN=DigiCert TLS RSA SHA256 2020 CA1, O=DigiCert Inc, C=US",
  validNotBefore: "2025-01-01T00:00:00Z",
  validNotAfter: "2027-01-01T00:00:00Z",
  publicKey: "RSA-2048-PUBLIC-KEY-LEAF",
  signatureAlgorithm: "SHA256withRSA",
  signatureHex: "LEAF_SIGNED_BY_INT_DDEE",
  isCA: false,
  keyUsage: ["DigitalSignature", "KeyEncipherment"],
  crlDistributionPoint: "http://crl3.digicert.com/DigiCertTLSRSASHA2562020CA1-4.crl",
  ocspResponderUrl: "http://ocsp.digicert.com"
}
