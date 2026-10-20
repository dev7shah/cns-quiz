import { describe, it, expect } from 'vitest'
import {
  simulateBufferOverflow,
  simulateIncompleteMediation
} from '../../src/lib/security/bufferOverflow'
import {
  MALWARE_TAXONOMY,
  simulateWormEpidemic,
  scanFileWithAV
} from '../../src/lib/security/malware'
import {
  evaluateBellLaPadula,
  evaluateBiba,
  checkRBACPermission,
  validateSeparationOfDuties,
  SAMPLE_RBAC_CONFIG
} from '../../src/lib/security/accessControl'
import {
  calculateBiometricCurve,
  computeRFC6238TOTP,
  verifyRFC6238TOTP,
  registerWebAuthnCredential,
  authenticateWebAuthn
} from '../../src/lib/security/userAuth'
import {
  evaluateNistPassword,
  estimateCrackingTime,
  simulateRainbowChain
} from '../../src/lib/security/passwordAttacks'

describe('Module M4: Protection of Computing Resources and Security Features Solvers', () => {

  // 1. Buffer Overflow & Incomplete Mediation
  describe('Memory Vulnerabilities & Buffer Overflow', () => {
    it('handles normal write within buffer capacity safely', () => {
      const res = simulateBufferOverflow('ShortData', 16, { enableCanary: true })
      expect(res.overflowed).toBe(false)
      expect(res.canarySmashed).toBe(false)
      expect(res.returnAddressOverwritten).toBe(false)
      expect(res.executionStatus).toBe('safe')
      expect(res.terminalOutput).toContain('Successfully read')
    })

    it('StackGuard canary detects stack smashing and aborts execution', () => {
      // Buffer = 16 bytes. Canary = bytes 16..19. Input = 24 bytes.
      const payload = 'A'.repeat(16) + 'EVIL' + 'B'.repeat(4)
      const res = simulateBufferOverflow(payload, 16, { enableCanary: true })
      expect(res.overflowed).toBe(true)
      expect(res.canarySmashed).toBe(true)
      expect(res.executionStatus).toBe('aborted_by_canary')
      expect(res.terminalOutput).toContain('__stack_chk_fail')
    })

    it('hijacks instruction pointer when stack canary is absent', () => {
      // Buffer = 16 bytes. Saved EBP = bytes 16..19. EIP = bytes 20..23.
      const payload = 'A'.repeat(16) + 'BBBB' + '\xEF\xBE\xAD\xDE'
      const res = simulateBufferOverflow(payload, 16, { enableCanary: false, enableDEP: false })
      expect(res.overflowed).toBe(true)
      expect(res.returnAddressOverwritten).toBe(true)
      expect(res.executionStatus).toBe('control_flow_hijacked')
      expect(res.terminalOutput).toContain('INSTRUCTION POINTER HIJACKED')
    })

    it('DEP/NX blocks execution if stack is non-executable', () => {
      const payload = 'A'.repeat(16) + 'BBBB' + 'CCCC'
      const res = simulateBufferOverflow(payload, 16, { enableCanary: false, enableDEP: true })
      expect(res.returnAddressOverwritten).toBe(true)
      expect(res.executionStatus).toBe('dep_blocked')
      expect(res.terminalOutput).toContain('DEP/NX')
    })

    it('Incomplete Mediation simulates client-side validation bypass', () => {
      // Server validates: malicious negative price is rejected
      const secureOrder = simulateIncompleteMediation(-50, 2, true)
      expect(secureOrder.isVulnerable).toBe(false)
      expect(secureOrder.computedTotal).toBe(0)
      expect(secureOrder.verdict).toContain('Server rejected malicious input')

      // Server lacks mediation: negative price credits user account
      const vulnerableOrder = simulateIncompleteMediation(-50, 2, false)
      expect(vulnerableOrder.isVulnerable).toBe(true)
      expect(vulnerableOrder.computedTotal).toBe(-100)
      expect(vulnerableOrder.verdict).toContain('INCOMPLETE MEDIATION EXPLOIT')
    })
  })

  // 2. Malware & Antivirus Scanners
  describe('Malware Taxonomy & Epidemic Propagation', () => {
    it('verifies malware taxonomy definitions and distinguishing properties', () => {
      expect(MALWARE_TAXONOMY.length).toBe(6)
      const worm = MALWARE_TAXONOMY.find(m => m.type === 'worm')
      const virus = MALWARE_TAXONOMY.find(m => m.type === 'virus')
      expect(worm?.selfReplicating).toBe(true)
      expect(worm?.requiresHost).toBe(false)
      expect(virus?.requiresHost).toBe(true)
    })

    it('simulates worm epidemic propagation with logistic S-curve growth', () => {
      const steps = simulateWormEpidemic(10000, 10, 0.6, 15)
      expect(steps.length).toBe(16)
      expect(steps[0].infectedCount).toBe(10)
      // Later steps show exponential growth transitioning to saturation
      const finalStep = steps[steps.length - 1]
      expect(finalStep.infectedCount).toBeGreaterThan(5000)
      expect(finalStep.percentInfected).toBeGreaterThan(50)
    })

    it('antivirus scanner detects known signature hash and suspicious heuristics', () => {
      // Signature match
      const sigScan = scanFileWithAV('wannacry.exe', 'ed01ebfbc9eb5bbea545af4d01bf5f1071661840480439c6e5babe8e080e41aa')
      expect(sigScan.signatureDetected).toBe(true)
      expect(sigScan.recommendedAction).toBe('block_and_delete')

      // Heuristic behavior score detection
      const heuristicScan = scanFileWithAV('unknown.exe', 'unknown_hash_123', [
        'disable_antivirus_service',
        'encrypt_user_documents',
        'delete_volume_shadow_copies'
      ])
      expect(sigScan.signatureDetected).toBe(true)
      expect(heuristicScan.heuristicScore).toBeGreaterThan(50)
      expect(heuristicScan.heuristicVerdict).toBe('malicious')
      expect(heuristicScan.recommendedAction).toBe('block_and_delete')
    })
  })

  // 3. Access Control (DAC, MAC, RBAC)
  describe('Access Control: Bell-LaPadula, Biba, and RBAC', () => {
    it('Bell-LaPadula enforces No Read Up (NRU) and No Write Down (NWD)', () => {
      // Top Secret reading Confidential: ALLOWED
      const readAllowed = evaluateBellLaPadula('Alice', 'top_secret', 'Report', 'confidential', 'read')
      expect(readAllowed.allowed).toBe(true)

      // Confidential reading Secret: DENIED (No Read Up)
      const readDenied = evaluateBellLaPadula('Bob', 'confidential', 'Intel', 'secret', 'read')
      expect(readDenied.allowed).toBe(false)
      expect(readDenied.ruleTriggered).toContain('No Read Up')

      // Secret writing to Unclassified: DENIED (No Write Down - leakage prevention)
      const writeDenied = evaluateBellLaPadula('Alice', 'secret', 'PublicBoard', 'unclassified', 'write')
      expect(writeDenied.allowed).toBe(false)
      expect(writeDenied.ruleTriggered).toContain('No Write Down')

      // Confidential writing to Secret: ALLOWED (*-property)
      const writeAllowed = evaluateBellLaPadula('Bob', 'confidential', 'Intel', 'secret', 'write')
      expect(writeAllowed.allowed).toBe(true)
    })

    it('Biba enforces No Read Down (NRD) and No Write Up (NWU)', () => {
      // High-integrity reading Low-integrity: DENIED (No Read Down - prevent contamination)
      const readDenied = evaluateBiba('Kernel', 'top_secret', 'UntrustedInput', 'unclassified', 'read')
      expect(readDenied.allowed).toBe(false)
      expect(readDenied.ruleTriggered).toContain('No Read Down')

      // Low-integrity writing to High-integrity: DENIED (No Write Up - prevent corruption)
      const writeDenied = evaluateBiba('Guest', 'unclassified', 'SystemFile', 'top_secret', 'write')
      expect(writeDenied.allowed).toBe(false)
      expect(writeDenied.ruleTriggered).toContain('No Write Up')
    })

    it('RBAC grants permissions based on assigned roles and detects Separation of Duties conflicts', () => {
      // Alice is clerk -> can create invoice, cannot approve
      const aliceCreate = checkRBACPermission('alice', 'create_invoice', SAMPLE_RBAC_CONFIG)
      expect(aliceCreate.granted).toBe(true)

      const aliceApprove = checkRBACPermission('alice', 'approve_invoice', SAMPLE_RBAC_CONFIG)
      expect(aliceApprove.granted).toBe(false)

      // Carol has both clerk and manager roles -> violates Separation of Duties (SoD)
      const carolSod = validateSeparationOfDuties('carol', SAMPLE_RBAC_CONFIG)
      expect(carolSod.valid).toBe(false)
      expect(carolSod.conflicts.length).toBeGreaterThan(0)
    })
  })

  // 4. User Authentication, TOTP, and FIDO2 WebAuthn
  describe('User Authentication & Passwordless MFA', () => {
    it('calculates biometric curve and identifies Crossover Error Rate (CER)', () => {
      const { points, cerPoint } = calculateBiometricCurve(10)
      expect(points.length).toBe(11)
      expect(cerPoint.isCrossover).toBe(true)
      // At crossover, FAR and FRR are approximately equal
      expect(Math.abs(cerPoint.far - cerPoint.frr)).toBeLessThan(10)
    })

    it('computes and verifies RFC 6238 TOTP with time drift tolerance', () => {
      const secret = 'JBSWY3DPEHPK3PXP'
      const now = 1700000000000
      const { code } = computeRFC6238TOTP(secret, now, 30)
      expect(code.length).toBe(6)

      // Verify correct code passes
      const ver = verifyRFC6238TOTP(code, secret, now, 1)
      expect(ver.isValid).toBe(true)
      expect(ver.driftWindowUsed).toBe(0)

      // Drift window tolerance (+30s into next window)
      const verDrift = verifyRFC6238TOTP(code, secret, now + 30000, 1)
      expect(verDrift.isValid).toBe(true)
      expect(verDrift.driftWindowUsed).toBe(-1)

      // Bad code fails
      const verBad = verifyRFC6238TOTP('000000', secret, now, 1)
      expect(verBad.isValid).toBe(false)
    })

    it('FIDO2 WebAuthn authenticates valid origin and defeats phishing attacks', () => {
      const cred = registerWebAuthnCredential('alice@cns.edu', 'https://cns-lab.edu')
      const challenge = 'random_server_challenge_nonce_987'

      // Legitimate login on correct origin
      const legit = authenticateWebAuthn(cred, challenge, 'https://cns-lab.edu')
      expect(legit.success).toBe(true)
      expect(legit.originMatch).toBe(true)

      // Phishing site login on fake domain
      const phish = authenticateWebAuthn(cred, challenge, 'https://evil-cns-lab-phish.com')
      expect(phish.success).toBe(false)
      expect(phish.originMatch).toBe(false)
      expect(phish.explanation).toContain('PHISHING ATTEMPT DEFEATED')
    })
  })

  // 5. Password Attacks & NIST Guidelines
  describe('Password Attacks & NIST SP 800-63B Guidelines', () => {
    it('evaluates NIST SP 800-63B password compliance and entropy', () => {
      // Weak breached password fails
      const weak = evaluateNistPassword('password')
      expect(weak.isCompliant).toBe(false)
      expect(weak.violations.length).toBeGreaterThan(0)

      // Short password fails length rule
      const short = evaluateNistPassword('Ab1!')
      expect(short.isCompliant).toBe(false)
      expect(short.violations.some(v => v.includes('under 8 characters'))).toBe(true)

      // Strong passphrase passes
      const strong = evaluateNistPassword('correct-horse-battery-staple')
      expect(strong.isCompliant).toBe(true)
      expect(strong.entropyBits).toBeGreaterThan(60)
    })

    it('estimates cracking times demonstrating GPU vs memory-hard Argon2id resistance', () => {
      // 40 bits of entropy
      const estimates = estimateCrackingTime(40)
      const sha = estimates.find(e => e.algorithm.includes('SHA-256'))
      const argon = estimates.find(e => e.algorithm.includes('Argon2id'))

      expect(sha).toBeDefined()
      expect(argon).toBeDefined()
      // Fast SHA-256 takes milliseconds to seconds; Argon2id takes orders of magnitude longer
      expect(argon!.secondsToCrackKeyspace).toBeGreaterThan(sha!.secondsToCrackKeyspace)
    })

    it('simulates rainbow table chains and explains salting defense', () => {
      const sim = simulateRainbowChain('cns123', 4)
      expect(sim.chain.length).toBe(4)
      expect(sim.tableEntry.startPlaintext).toBe('cns123')
      expect(sim.tableEntry.endPlaintext.length).toBeGreaterThan(0)
      expect(sim.saltedDefenseExplanation).toContain('random salt')
    })
  })
})
