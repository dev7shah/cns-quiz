/**
 * Tiny Encryption Algorithm (TEA) - Lightweight Cryptography
 * - Designed by David Wheeler and Roger Needham (1994)
 * - 64-bit Block: [v0, v1] (two 32-bit unsigned integers)
 * - 128-bit Key: [k0, k1, k2, k3] (four 32-bit unsigned integers)
 * - 32 Cycles (64 Feistel rounds)
 * - Golden Ratio Constant DELTA = 0x9E3779B9
 */

export const TEA_DELTA = 0x9E3779B9

export interface TeaState {
  v0: number
  v1: number
}

export type TeaKey = [number, number, number, number]

export function teaEncrypt(block: TeaState, key: TeaKey, cycles: number = 32): TeaState {
  let v0 = block.v0 >>> 0
  let v1 = block.v1 >>> 0
  let sum = 0
  const [k0, k1, k2, k3] = key

  for (let i = 0; i < cycles; i++) {
    sum = (sum + TEA_DELTA) >>> 0
    const term0 = (((v1 << 4) >>> 0) + k0) >>> 0
    const term1 = (v1 + sum) >>> 0
    const term2 = ((v1 >>> 5) + k1) >>> 0
    v0 = (v0 + (term0 ^ term1 ^ term2)) >>> 0

    const term3 = (((v0 << 4) >>> 0) + k2) >>> 0
    const term4 = (v0 + sum) >>> 0
    const term5 = ((v0 >>> 5) + k3) >>> 0
    v1 = (v1 + (term3 ^ term4 ^ term5)) >>> 0
  }

  return { v0, v1 }
}

export function teaDecrypt(block: TeaState, key: TeaKey, cycles: number = 32): TeaState {
  let v0 = block.v0 >>> 0
  let v1 = block.v1 >>> 0
  const [k0, k1, k2, k3] = key
  // sum starts at DELTA * cycles mod 2^32
  let sum = ((TEA_DELTA * cycles) >>> 0)

  for (let i = 0; i < cycles; i++) {
    const term3 = (((v0 << 4) >>> 0) + k2) >>> 0
    const term4 = (v0 + sum) >>> 0
    const term5 = ((v0 >>> 5) + k3) >>> 0
    v1 = (v1 - (term3 ^ term4 ^ term5)) >>> 0

    const term0 = (((v1 << 4) >>> 0) + k0) >>> 0
    const term1 = (v1 + sum) >>> 0
    const term2 = ((v1 >>> 5) + k1) >>> 0
    v0 = (v0 - (term0 ^ term1 ^ term2)) >>> 0

    sum = (sum - TEA_DELTA) >>> 0
  }

  return { v0, v1 }
}
