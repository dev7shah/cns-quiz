export interface S3BucketPolicy {
  PublicAccessBlock: boolean
  MFA_Delete: boolean
  EncryptionAtRest: boolean
}

export interface IAMUser {
  name: string
  hasMFA: boolean
  attachedPolicies: string[]
  passwordAgeDays: number
}

export interface CloudConfigReport {
  score: number
  findings: string[]
  passed: string[]
}

/**
 * Simulates a cloud security posture management (CSPM) check.
 */
export function checkCloudConfiguration(bucket: S3BucketPolicy, users: IAMUser[]): CloudConfigReport {
  const findings: string[] = []
  const passed: string[] = []
  let score = 100

  // Bucket Checks
  if (!bucket.PublicAccessBlock) {
    findings.push("CRITICAL: S3 Bucket is public. Block Public Access is disabled.")
    score -= 30
  } else {
    passed.push("S3 Bucket blocks public access.")
  }

  if (!bucket.EncryptionAtRest) {
    findings.push("HIGH: S3 Bucket data is not encrypted at rest.")
    score -= 15
  } else {
    passed.push("S3 Bucket encryption at rest is enabled.")
  }

  if (!bucket.MFA_Delete) {
    findings.push("MEDIUM: MFA Delete is not enabled on S3 Bucket.")
    score -= 5
  } else {
    passed.push("MFA Delete is enabled on S3 Bucket.")
  }

  // IAM Checks
  let mfaFailures = 0
  let adminFailures = 0
  let passwordFailures = 0

  for (const user of users) {
    if (!user.hasMFA) mfaFailures++
    if (user.attachedPolicies.includes("AdministratorAccess")) adminFailures++
    if (user.passwordAgeDays > 90) passwordFailures++
  }

  if (mfaFailures > 0) {
    findings.push(`HIGH: ${mfaFailures} IAM user(s) do not have MFA enabled.`)
    score -= (10 * mfaFailures)
  } else {
    passed.push("All IAM users have MFA enabled.")
  }

  if (adminFailures > 1) {
    findings.push(`HIGH: Too many users (${adminFailures}) have AdministratorAccess. Follow Principle of Least Privilege.`)
    score -= 20
  } else {
    passed.push("AdministratorAccess is restricted to 1 user.")
  }

  if (passwordFailures > 0) {
    findings.push(`MEDIUM: ${passwordFailures} IAM user(s) have passwords older than 90 days.`)
    score -= (5 * passwordFailures)
  }

  return {
    score: Math.max(0, score),
    findings,
    passed
  }
}
