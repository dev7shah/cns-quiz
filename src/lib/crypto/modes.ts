/**
 * Block Cipher Modes of Operation Simulation
 * ECB, CBC, CFB, OFB, CTR
 * Includes block chaining, IV initialization, and error propagation bit-flip analysis.
 */

// Simple reversible 16-bit block cipher using 2-round Feistel structure (8-bit halves)
function roundF(half: number, subkey: number): number {
  return ((half * 107 + (subkey & 0xFF)) ^ 0x5A) & 0xFF
}

export function mockBlockCipher(block: number, key: number): number {
  const l0 = (block >>> 8) & 0xFF
  const r0 = block & 0xFF
  const k1 = (key >>> 8) & 0xFF
  const k2 = key & 0xFF

  // Round 1
  const l1 = r0
  const r1 = (l0 ^ roundF(r0, k1)) & 0xFF

  // Round 2
  const l2 = r1
  const r2 = (l1 ^ roundF(r1, k2)) & 0xFF

  return ((l2 << 8) | r2) & 0xFFFF
}

export function mockBlockDecipher(block: number, key: number): number {
  const l2 = (block >>> 8) & 0xFF
  const r2 = block & 0xFF
  const k1 = (key >>> 8) & 0xFF
  const k2 = key & 0xFF

  // Invert Round 2
  const r1 = l2
  const l1 = (r2 ^ roundF(r1, k2)) & 0xFF

  // Invert Round 1
  const r0 = l1
  const l0 = (r1 ^ roundF(r0, k1)) & 0xFF

  return ((l0 << 8) | r0) & 0xFFFF
}

export type CipherMode = 'ECB' | 'CBC' | 'CFB' | 'OFB' | 'CTR'

export interface ModeStepResult {
  blockIndex: number
  plaintext: number
  ciphertext: number
  intermediate?: number
  feedback?: number
}

// 1. ECB
export function ecbEncrypt(plainBlocks: number[], key: number): number[] {
  return plainBlocks.map(p => mockBlockCipher(p, key))
}
export function ecbDecrypt(cipherBlocks: number[], key: number): number[] {
  return cipherBlocks.map(c => mockBlockDecipher(c, key))
}

// 2. CBC
export function cbcEncrypt(plainBlocks: number[], key: number, iv: number): number[] {
  const cipherBlocks: number[] = []
  let prev = iv & 0xFFFF
  for (const p of plainBlocks) {
    const mixed = (p ^ prev) & 0xFFFF
    const c = mockBlockCipher(mixed, key)
    cipherBlocks.push(c)
    prev = c
  }
  return cipherBlocks
}
export function cbcDecrypt(cipherBlocks: number[], key: number, iv: number): number[] {
  const plainBlocks: number[] = []
  let prev = iv & 0xFFFF
  for (const c of cipherBlocks) {
    const raw = mockBlockDecipher(c, key)
    const p = (raw ^ prev) & 0xFFFF
    plainBlocks.push(p)
    prev = c
  }
  return plainBlocks
}

// 3. CFB
export function cfbEncrypt(plainBlocks: number[], key: number, iv: number): number[] {
  const cipherBlocks: number[] = []
  let prev = iv & 0xFFFF
  for (const p of plainBlocks) {
    const stream = mockBlockCipher(prev, key)
    const c = (p ^ stream) & 0xFFFF
    cipherBlocks.push(c)
    prev = c
  }
  return cipherBlocks
}
export function cfbDecrypt(cipherBlocks: number[], key: number, iv: number): number[] {
  const plainBlocks: number[] = []
  let prev = iv & 0xFFFF
  for (const c of cipherBlocks) {
    const stream = mockBlockCipher(prev, key)
    const p = (c ^ stream) & 0xFFFF
    plainBlocks.push(p)
    prev = c
  }
  return plainBlocks
}

// 4. OFB
export function ofbEncrypt(plainBlocks: number[], key: number, iv: number): number[] {
  const cipherBlocks: number[] = []
  let o = iv & 0xFFFF
  for (const p of plainBlocks) {
    o = mockBlockCipher(o, key)
    const c = (p ^ o) & 0xFFFF
    cipherBlocks.push(c)
  }
  return cipherBlocks
}
export function ofbDecrypt(cipherBlocks: number[], key: number, iv: number): number[] {
  // OFB decryption is symmetric to encryption!
  return ofbEncrypt(cipherBlocks, key, iv)
}

// 5. CTR
export function ctrEncrypt(plainBlocks: number[], key: number, nonce: number): number[] {
  const cipherBlocks: number[] = []
  for (let i = 0; i < plainBlocks.length; i++) {
    const counter = (nonce + i) & 0xFFFF
    const stream = mockBlockCipher(counter, key)
    const c = (plainBlocks[i] ^ stream) & 0xFFFF
    cipherBlocks.push(c)
  }
  return cipherBlocks
}
export function ctrDecrypt(cipherBlocks: number[], key: number, nonce: number): number[] {
  // CTR decryption is symmetric
  return ctrEncrypt(cipherBlocks, key, nonce)
}

// Error Propagation Simulator
export interface ErrorImpact {
  corruptedCipherBlock: number
  affectedPlainBlocks: number[]
  explanation: string
}

export function simulateErrorPropagation(mode: CipherMode, blockCount: number, errorBlockIdx: number): ErrorImpact {
  switch (mode) {
    case 'ECB':
      return {
        corruptedCipherBlock: errorBlockIdx,
        affectedPlainBlocks: [errorBlockIdx],
        explanation: 'ECB has zero error propagation beyond the corrupted block. Only block ' + errorBlockIdx + ' is garbled.'
      }
    case 'CBC':
      return {
        corruptedCipherBlock: errorBlockIdx,
        affectedPlainBlocks: [errorBlockIdx, errorBlockIdx + 1].filter(i => i < blockCount),
        explanation: 'In CBC, block ' + errorBlockIdx + ' is completely garbled; block ' + (errorBlockIdx + 1) + ' has the exact same bit flipped (self-synchronizing after 2 blocks).'
      }
    case 'CFB':
      return {
        corruptedCipherBlock: errorBlockIdx,
        affectedPlainBlocks: [errorBlockIdx, errorBlockIdx + 1].filter(i => i < blockCount),
        explanation: 'In CFB, block ' + errorBlockIdx + ' has 1 bit flipped; block ' + (errorBlockIdx + 1) + ' is completely garbled as corrupted feedback.'
      }
    case 'OFB':
      return {
        corruptedCipherBlock: errorBlockIdx,
        affectedPlainBlocks: [errorBlockIdx],
        explanation: 'In OFB, keystream is independent of ciphertext. Only block ' + errorBlockIdx + ' has the matching bit flipped; zero propagation.'
      }
    case 'CTR':
      return {
        corruptedCipherBlock: errorBlockIdx,
        affectedPlainBlocks: [errorBlockIdx],
        explanation: 'In CTR, keystream depends only on counter. Only block ' + errorBlockIdx + ' has the matching bit flipped; zero error propagation.'
      }
  }
}
