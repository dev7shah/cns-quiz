/**
 * Affine Cipher Solver and Modular Arithmetic Utilities
 * C = (a * P + b) mod 26
 * P = a^-1 * (C - b) mod 26
 */

export function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b !== 0) {
    const t = b
    b = a % b
    a = t
  }
  return a
}

export function extendedEuclid(a: number, m: number = 26): { gcdVal: number; x: number; y: number } {
  let [oldR, r] = [a, m]
  let [oldS, s] = [1, 0]
  let [oldT, t] = [0, 1]

  while (r !== 0) {
    const quotient = Math.floor(oldR / r)
    ;[oldR, r] = [r, oldR - quotient * r]
    ;[oldS, s] = [s, oldS - quotient * s]
    ;[oldT, t] = [t, oldT - quotient * t]
  }

  return { gcdVal: oldR, x: oldS, y: oldT }
}

export function modInverse26(a: number, m: number = 26): number | null {
  const { gcdVal, x } = extendedEuclid(a, m)
  if (gcdVal !== 1) return null
  return ((x % m) + m) % m
}

export function isValidAffineMultiplier(a: number, m: number = 26): boolean {
  return gcd(a, m) === 1
}

export function getValidAffineMultipliers(m: number = 26): number[] {
  const result: number[] = []
  for (let i = 1; i < m; i++) {
    if (gcd(i, m) === 1) result.push(i)
  }
  return result
}

export function affineEncrypt(plaintext: string, a: number, b: number, m: number = 26): string {
  if (!isValidAffineMultiplier(a, m)) {
    throw new Error(`Multiplier 'a' (${a}) is not coprime to modulus ${m}`)
  }
  const cleanB = ((b % m) + m) % m

  return plaintext.split('').map(ch => {
    const code = ch.charCodeAt(0)
    if (code >= 65 && code <= 90) {
      const p = code - 65
      const c = (a * p + cleanB) % m
      return String.fromCharCode(c + 65)
    }
    if (code >= 97 && code <= 122) {
      const p = code - 97
      const c = (a * p + cleanB) % m
      return String.fromCharCode(c + 97)
    }
    return ch
  }).join('')
}

export function affineDecrypt(ciphertext: string, a: number, b: number, m: number = 26): string {
  const aInv = modInverse26(a, m)
  if (aInv === null) {
    throw new Error(`Multiplier 'a' (${a}) has no modular inverse mod ${m}`)
  }
  const cleanB = ((b % m) + m) % m

  return ciphertext.split('').map(ch => {
    const code = ch.charCodeAt(0)
    if (code >= 65 && code <= 90) {
      const c = code - 65
      const p = ((aInv * (c - cleanB)) % m + m) % m
      return String.fromCharCode(p + 65)
    }
    if (code >= 97 && code <= 122) {
      const c = code - 97
      const p = ((aInv * (c - cleanB)) % m + m) % m
      return String.fromCharCode(p + 97)
    }
    return ch
  }).join('')
}
