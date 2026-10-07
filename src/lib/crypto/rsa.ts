/**
 * Calculates the greatest common divisor (GCD) of two BigInts.
 */
export function gcd(a: bigint, b: bigint): bigint {
  while (b !== BigInt(0)) {
    const temp = b
    b = a % b
    a = temp
  }
  return a
}

/**
 * Calculates the modular multiplicative inverse using the Extended Euclidean Algorithm.
 * Returns d such that (e * d) % phi = 1.
 */
export function modInverse(e: bigint, phi: bigint): bigint {
  let [m0, y, x] = [phi, BigInt(0), BigInt(1)]
  let a = e

  if (phi === BigInt(1)) return BigInt(0)

  while (a > BigInt(1)) {
    const q = a / m0
    let t = m0
    m0 = a % m0
    a = t
    t = y
    y = x - q * y
    x = t
  }

  if (x < BigInt(0)) x += phi
  return x
}

/**
 * Performs modular exponentiation: (base^exponent) % modulus
 * Uses the square-and-multiply algorithm for efficiency with large numbers.
 */
export function modPow(base: bigint, exponent: bigint, modulus: bigint): bigint {
  let result = BigInt(1)
  base = base % modulus
  while (exponent > BigInt(0)) {
    if (exponent % BigInt(2) === BigInt(1)) {
      result = (result * base) % modulus
    }
    exponent = exponent / BigInt(2)
    base = (base * base) % modulus
  }
  return result
}

export interface RSAKeys {
  n: string
  e: string
  d: string
  phi: string
}

/**
 * Generates an RSA keypair given two prime numbers p and q.
 * In a real scenario, p and q are randomly generated large primes.
 */
export function generateRSAKeys(p: number, q: number): RSAKeys | null {
  const bigP = BigInt(p)
  const bigQ = BigInt(q)
  
  const n = bigP * bigQ
  const phi = (bigP - BigInt(1)) * (bigQ - BigInt(1))
  
  // Choose e such that 1 < e < phi and gcd(e, phi) == 1
  let e = BigInt(3)
  while (e < phi) {
    if (gcd(e, phi) === BigInt(1)) {
      break
    }
    e += BigInt(2)
  }
  
  if (e >= phi) return null
  
  const d = modInverse(e, phi)
  
  return {
    n: n.toString(),
    e: e.toString(),
    d: d.toString(),
    phi: phi.toString()
  }
}

/**
 * Encrypts a message (represented as a BigInt) using public key (e, n).
 */
export function rsaEncrypt(message: bigint, e: bigint, n: bigint): bigint {
  return modPow(message, e, n)
}

/**
 * Decrypts a ciphertext (represented as a BigInt) using private key (d, n).
 */
export function rsaDecrypt(ciphertext: bigint, d: bigint, n: bigint): bigint {
  return modPow(ciphertext, d, n)
}
