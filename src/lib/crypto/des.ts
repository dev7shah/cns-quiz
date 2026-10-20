/**
 * Data Encryption Standard (DES) & 3DES Educational Implementation
 * - 64-bit Block
 * - 56-bit Key (+ 8 parity bits = 64 bits)
 * - 16 Feistel Rounds
 * - S-boxes (S1..S8: 6-bit to 4-bit non-linear substitution)
 * - 3DES EDE Mode: C = E_K3(D_K2(E_K1(P)))
 */

// S-Box 1 sample table (4 rows, 16 columns)
export const DES_SBOX_1: number[][] = [
  [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
  [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
  [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
  [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
]

export function sboxLookup(input6Bit: number, table: number[][] = DES_SBOX_1): number {
  const val = input6Bit & 0x3F
  // Outer bits (bit 5 and bit 0) form row (0..3)
  const row = ((val & 0x20) >>> 4) | (val & 0x01)
  // Inner bits (bits 4, 3, 2, 1) form column (0..15)
  const col = (val >>> 1) & 0x0F
  return table[row][col]
}

// 32-bit to 48-bit Expansion permutation intuition:
// 8 nibbles of 4 bits expanded to 8 chunks of 6 bits by duplicating boundary bits.
export function desExpansionE(r32: number): bigint {
  let expanded = BigInt(0)
  const bits: number[] = []
  for (let i = 31; i >= 0; i--) {
    bits.push((r32 >>> i) & 1)
  }
  // Standard E-bit selection table (1-indexed mapping)
  const E_TABLE = [
    32, 1, 2, 3, 4, 5,
    4, 5, 6, 7, 8, 9,
    8, 9, 10, 11, 12, 13,
    12, 13, 14, 15, 16, 17,
    16, 17, 18, 19, 20, 21,
    20, 21, 22, 23, 24, 25,
    24, 25, 26, 27, 28, 29,
    28, 29, 30, 31, 32, 1
  ]

  for (const pos of E_TABLE) {
    const bit = bits[pos - 1]
    expanded = (expanded << BigInt(1)) | BigInt(bit)
  }
  return expanded
}

// 3DES (Triple DES) EDE Mode
export interface TripleDESKeys {
  k1: number
  k2: number
  k3: number
}

export function tripleDesEncrypt(block: number, keys: TripleDESKeys, cipherFn: (b: number, k: number) => number, decipherFn: (b: number, k: number) => number): number {
  // EDE: Encrypt with K1, Decrypt with K2, Encrypt with K3
  const step1 = cipherFn(block, keys.k1)
  const step2 = decipherFn(step1, keys.k2)
  const step3 = cipherFn(step2, keys.k3)
  return step3
}

export function tripleDesDecrypt(block: number, keys: TripleDESKeys, cipherFn: (b: number, k: number) => number, decipherFn: (b: number, k: number) => number): number {
  // DED: Decrypt with K3, Encrypt with K2, Decrypt with K1
  const step1 = decipherFn(block, keys.k3)
  const step2 = cipherFn(step1, keys.k2)
  const step3 = decipherFn(step2, keys.k1)
  return step3
}

// Meet-in-the-Middle Attack Complexity Demonstration
export function meetInTheMiddleComplexity(keyBits: number = 56): {
  naiveBruteForce: string
  mitmTimeComplexity: string
  mitmSpaceComplexity: string
  effectiveBits: number
} {
  return {
    naiveBruteForce: `2^(2 × ${keyBits}) = 2^${keyBits * 2}`,
    mitmTimeComplexity: `2 × 2^${keyBits} = 2^${keyBits + 1}`,
    mitmSpaceComplexity: `2^${keyBits} blocks in hash table`,
    effectiveBits: keyBits + 1
  }
}
