/**
 * Access Control Models & Resource Protection Mechanics
 * Covers:
 * - Discretionary Access Control (DAC): Access Control Matrix (ACM), ACLs vs Capabilities
 * - Mandatory Access Control (MAC):
 *     - Bell-LaPadula Model (Confidentiality): No Read Up (NRU), No Write Down (NWD)
 *     - Biba Model (Integrity): No Read Down (NRD), No Write Up (NWU)
 * - Role-Based Access Control (RBAC): User-Role-Permission mappings & Separation of Duties (SoD)
 */

export type ClearanceLevel = "unclassified" | "confidential" | "secret" | "top_secret"

export const CLEARANCE_VALUES: Record<ClearanceLevel, number> = {
  unclassified: 0,
  confidential: 1,
  secret: 2,
  top_secret: 3
}

export interface AccessDecision {
  subject: string
  subjectClearance: ClearanceLevel
  object: string
  objectClassification: ClearanceLevel
  operation: "read" | "write"
  model: "bell_lapadula" | "biba"
  allowed: boolean
  ruleTriggered: string
  explanation: string
}

/**
 * Bell-LaPadula Confidentiality Model:
 * 1. Simple Security Property (No Read Up): Subject S can read Object O iff Level(S) >= Level(O).
 * 2. *-Property (No Write Down): Subject S can write Object O iff Level(S) <= Level(O).
 */
export function evaluateBellLaPadula(
  subject: string,
  subjectClearance: ClearanceLevel,
  object: string,
  objectClassification: ClearanceLevel,
  operation: "read" | "write"
): AccessDecision {
  const sLevel = CLEARANCE_VALUES[subjectClearance]
  const oLevel = CLEARANCE_VALUES[objectClassification]

  if (operation === "read") {
    const allowed = sLevel >= oLevel
    return {
      subject,
      subjectClearance,
      object,
      objectClassification,
      operation,
      model: "bell_lapadula",
      allowed,
      ruleTriggered: allowed ? "Simple Security Property (Read Allowed)" : "Simple Security Property Violation (No Read Up)",
      explanation: allowed
        ? `Subject (${subjectClearance}, level ${sLevel}) possesses sufficient clearance to read Object (${objectClassification}, level ${oLevel}).`
        : `DENIED: Subject (${subjectClearance}) cannot read higher-clearance Object (${objectClassification}) (No Read Up rule).`
    }
  }

  // operation === 'write'
  const allowed = sLevel <= oLevel
  return {
    subject,
    subjectClearance,
    object,
    objectClassification,
    operation,
    model: "bell_lapadula",
    allowed,
    ruleTriggered: allowed ? "*-Property (Write Allowed)" : "*-Property Violation (No Write Down)",
    explanation: allowed
      ? `Subject (${subjectClearance}) can write to equal or higher Object (${objectClassification}) without leaking confidentiality.`
      : `DENIED: High-clearance Subject (${subjectClearance}) writing to lower Object (${objectClassification}) would leak secrets (No Write Down rule).`
  }
}

/**
 * Biba Integrity Model:
 * 1. Simple Integrity Property (No Read Down): Subject S can read Object O iff Integrity(S) <= Integrity(O).
 * 2. *-Integrity Property (No Write Up): Subject S can write Object O iff Integrity(S) >= Integrity(O).
 */
export function evaluateBiba(
  subject: string,
  subjectIntegrity: ClearanceLevel,
  object: string,
  objectIntegrity: ClearanceLevel,
  operation: "read" | "write"
): AccessDecision {
  const sLevel = CLEARANCE_VALUES[subjectIntegrity]
  const oLevel = CLEARANCE_VALUES[objectIntegrity]

  if (operation === "read") {
    const allowed = sLevel <= oLevel
    return {
      subject,
      subjectClearance: subjectIntegrity,
      object,
      objectClassification: objectIntegrity,
      operation,
      model: "biba",
      allowed,
      ruleTriggered: allowed ? "Simple Integrity Property (Read Allowed)" : "Simple Integrity Property Violation (No Read Down)",
      explanation: allowed
        ? `Subject (${subjectIntegrity}) reading equal or higher integrity Object (${objectIntegrity}) will not contaminate internal state.`
        : `DENIED: High-integrity Subject (${subjectIntegrity}) reading lower-integrity Object (${objectIntegrity}) would ingest dirty data (No Read Down rule).`
    }
  }

  // operation === 'write'
  const allowed = sLevel >= oLevel
  return {
    subject,
    subjectClearance: subjectIntegrity,
    object,
    objectClassification: objectIntegrity,
    operation,
    model: "biba",
    allowed,
    ruleTriggered: allowed ? "*-Integrity Property (Write Allowed)" : "*-Integrity Property Violation (No Write Up)",
    explanation: allowed
      ? `High-integrity Subject (${subjectIntegrity}) writing to equal or lower Object (${objectIntegrity}) preserves data integrity.`
      : `DENIED: Low-integrity Subject (${subjectIntegrity}) cannot corrupt higher-integrity Object (${objectIntegrity}) (No Write Up rule).`
  }
}

/**
 * Role-Based Access Control (RBAC) Engine:
 * Maps Users -> Roles -> Permissions
 * Demonstrates Separation of Duties (SoD): e.g. Purchasing Manager cannot also be Payment Approver.
 */
export interface RBACRole {
  roleId: string
  name: string
  permissions: string[]
}

export interface RBACConfig {
  roles: Record<string, RBACRole>
  userRoles: Record<string, string[]>
  mutuallyExclusiveRoles?: [string, string][] // Static Separation of Duties (SSoD)
}

export const SAMPLE_RBAC_CONFIG: RBACConfig = {
  roles: {
    clerk: {
      roleId: "clerk",
      name: "Accounts Clerk",
      permissions: ["create_invoice", "view_invoice"]
    },
    manager: {
      roleId: "manager",
      name: "Billing Manager",
      permissions: ["view_invoice", "approve_invoice"]
    },
    auditor: {
      roleId: "auditor",
      name: "External Auditor",
      permissions: ["view_invoice", "view_audit_logs"]
    },
    admin: {
      roleId: "admin",
      name: "System Administrator",
      permissions: ["manage_users", "view_audit_logs", "backup_database"]
    }
  },
  userRoles: {
    alice: ["clerk"],
    bob: ["manager"],
    carol: ["clerk", "manager"], // Potential SoD conflict
    david: ["auditor"]
  },
  mutuallyExclusiveRoles: [
    ["clerk", "manager"] // Segregation: person who creates invoice cannot approve it
  ]
}

export function checkRBACPermission(
  user: string,
  permission: string,
  config: RBACConfig = SAMPLE_RBAC_CONFIG
): { granted: boolean; assignedRoles: string[]; reason: string } {
  const roles = config.userRoles[user.toLowerCase()] || []
  if (roles.length === 0) {
    return { granted: false, assignedRoles: [], reason: `User '${user}' has no assigned roles.` }
  }

  for (const roleId of roles) {
    const role = config.roles[roleId]
    if (role && role.permissions.includes(permission)) {
      return {
        granted: true,
        assignedRoles: roles,
        reason: `Permission '${permission}' granted via role '${role.name}'.`
      }
    }
  }

  return {
    granted: false,
    assignedRoles: roles,
    reason: `User '${user}' possesses roles [${roles.join(", ")}], none of which include permission '${permission}'.`
  }
}

export function validateSeparationOfDuties(
  user: string,
  config: RBACConfig = SAMPLE_RBAC_CONFIG
): { valid: boolean; conflicts: string[] } {
  const roles = config.userRoles[user.toLowerCase()] || []
  const conflicts: string[] = []

  if (!config.mutuallyExclusiveRoles) return { valid: true, conflicts }

  for (const [r1, r2] of config.mutuallyExclusiveRoles) {
    if (roles.includes(r1) && roles.includes(r2)) {
      conflicts.push(`User '${user}' violates Separation of Duties by holding both '${r1}' and '${r2}'.`)
    }
  }

  return {
    valid: conflicts.length === 0,
    conflicts
  }
}
