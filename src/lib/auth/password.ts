/**
 * Calculates the entropy of a password.
 * Entropy (bits) = L * log2(R)
 * where L is the length of the password, and R is the size of the character pool.
 */
export function calculatePasswordEntropy(password: string): number {
  if (!password) return 0
  
  let poolSize = 0
  if (/[a-z]/.test(password)) poolSize += 26
  if (/[A-Z]/.test(password)) poolSize += 26
  if (/[0-9]/.test(password)) poolSize += 10
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32 // Rough estimate for symbols

  if (poolSize === 0) return 0
  
  const entropy = password.length * Math.log2(poolSize)
  return Math.round(entropy * 10) / 10 // Round to 1 decimal place
}

/**
 * Returns a descriptive strength rating based on entropy.
 */
export function getPasswordStrengthLabel(entropy: number): { label: string, color: string } {
  if (entropy < 30) return { label: "Very Weak", color: "text-destructive" }
  if (entropy < 50) return { label: "Weak", color: "text-orange-500" }
  if (entropy < 70) return { label: "Good", color: "text-yellow-500" }
  return { label: "Strong", color: "text-green-500" }
}

// Common passwords for dictionary attack simulation
const dictionary = new Set(["password", "123456", "qwerty", "admin", "admin123", "letmein"])

/**
 * Simulates a dictionary attack.
 */
export function isVulnerableToDictionary(password: string): boolean {
  return dictionary.has(password.toLowerCase())
}
