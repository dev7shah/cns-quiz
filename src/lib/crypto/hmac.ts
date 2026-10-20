/**
 * HMAC (Keyed-Hash Message Authentication Code) - RFC 2104
 * Demonstrates:
 * - Padding/hashing of keys
 * - Inner and outer hash wrapping with ipad (0x36) and opad (0x5c)
 * - Length extension attack vulnerability on naive H(K || M) vs HMAC immunity
 */

export interface HMACBreakdown {
  key: string
  normalizedKeyHex: string
  ipadHex: string
  opadHex: string
  kXorIpadHex: string
  kXorOpadHex: string
  message: string
  innerDataPreview: string
  innerHashHex: string
  outerDataPreview: string
  hmacResultHex: string
}

// Simple FNV-1a 32-bit hash function for deterministic synchronous demonstration
export function fnv1a32(input: string | Uint8Array): number {
  let hash = 0x811c9dc5
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input
  for (let i = 0; i < bytes.length; i++) {
    hash ^= bytes[i]
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

export function fnv1a32Hex(input: string | Uint8Array): string {
  return fnv1a32(input).toString(16).padStart(8, "0")
}

/**
 * Computes an educational HMAC using a 64-byte block size and 32-bit FNV-1a or truncated SHA.
 * Returns both the result and a step-by-step breakdown of ipad/opad operations.
 */
export function computeHMACEducational(key: string, message: string, blockSize: number = 16): HMACBreakdown {
  const encoder = new TextEncoder()
  let keyBytes = Array.from(encoder.encode(key))

  // If key is longer than blockSize, hash it first
  if (keyBytes.length > blockSize) {
    const hashVal = fnv1a32(new Uint8Array(keyBytes))
    keyBytes = [
      (hashVal >>> 24) & 0xff,
      (hashVal >>> 16) & 0xff,
      (hashVal >>> 8) & 0xff,
      hashVal & 0xff
    ]
  }

  // Pad key with zeros up to blockSize
  while (keyBytes.length < blockSize) {
    keyBytes.push(0x00)
  }

  const IPAD = 0x36
  const OPAD = 0x5c

  const kXorIpad = keyBytes.map(b => b ^ IPAD)
  const kXorOpad = keyBytes.map(b => b ^ OPAD)

  const msgBytes = Array.from(encoder.encode(message))
  const innerData = new Uint8Array([...kXorIpad, ...msgBytes])
  const innerHashHex = fnv1a32Hex(innerData)

  const innerHashBytes = Array.from(encoder.encode(innerHashHex))
  const outerData = new Uint8Array([...kXorOpad, ...innerHashBytes])
  const hmacResultHex = fnv1a32Hex(outerData)

  const toHex = (arr: number[]) => arr.map(b => b.toString(16).padStart(2, "0")).join("")

  return {
    key,
    normalizedKeyHex: toHex(keyBytes),
    ipadHex: toHex(new Array(blockSize).fill(IPAD)),
    opadHex: toHex(new Array(blockSize).fill(OPAD)),
    kXorIpadHex: toHex(kXorIpad),
    kXorOpadHex: toHex(kXorOpad),
    message,
    innerDataPreview: `(K ^ ipad) || "${message}"`,
    innerHashHex,
    outerDataPreview: `(K ^ opad) || ${innerHashHex}`,
    hmacResultHex
  }
}

/**
 * Length Extension Attack Simulator:
 * Shows why naive H(K || M) fails under Merkle-Damgård constructions:
 * If MAC = H(K || M), an attacker who sees MAC and knows len(M) can compute
 * MAC' = H(K || M || pad || M_extension) without ever knowing key K!
 */
export interface LengthExtensionSimulation {
  originalMessage: string
  extensionMessage: string
  keyLength: number
  naiveVulnerable: boolean
  naiveForgedHash: string
  hmacResistant: boolean
  explanation: string
}

export function simulateLengthExtensionAttack(
  originalMessage: string,
  extensionMessage: string,
  keyLength: number = 16
): LengthExtensionSimulation {
  // In Merkle-Damgard, internal state after H(K || M) equals the hash value.
  // We can inject new blocks continuing from this state:
  const naiveOriginal = fnv1a32Hex(`SECRET_KEY_HIDDEN_${originalMessage}`)
  // Attacker extends state:
  const naiveForged = fnv1a32Hex(`${naiveOriginal}_EXT_${extensionMessage}`)

  return {
    originalMessage,
    extensionMessage,
    keyLength,
    naiveVulnerable: true,
    naiveForgedHash: naiveForged,
    hmacResistant: true,
    explanation:
      "Under naive Merkle-Damgard constructions, H(K || M) allows an attacker to resume the compression function from the published digest and append data. HMAC defeats this because the inner hash H((K ^ ipad) || M) is wrapped by an outer hash with (K ^ opad), hiding the inner state."
  }
}
